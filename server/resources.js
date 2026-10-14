// Resource Center API (MySQL, see server/db.js).
//   Public  (read-only, published content only):  /api/resources/...
//   Admin   (signed-in users, see server/auth.js): /api/admin/...
import fs from 'node:fs'
import path from 'node:path'
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'
import express from 'express'
import {
  query,
  one,
  json,
  transaction,
  getSetting,
  setSetting,
  DEFAULT_SETTINGS,
  PUBLIC_UPLOAD_DIR,
  PRIVATE_UPLOAD_DIR,
  SIGNING_SECRET, // live binding: set once the database is ready
} from './db.js'
import {
  ROLES,
  MIN_PASSWORD,
  login,
  requireAuth,
  requireAdmin,
  csrfGuard,
  destroySession,
  destroyUserSessions,
  hashPassword,
  verifyPassword,
  publicUser,
} from './auth.js'
import { validateLead, EMAIL_RE } from '../src/lib/leadForms.js'

const ICONS = ['chart', 'fileText', 'book', 'target', 'monitor', 'play', 'sparkle', 'layers', 'trendingUp', 'users', 'globe', 'briefcase', 'shield', 'cpu', 'bolt', 'download']
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DOWNLOAD_LINK_MS = 30 * 60 * 1000

class HttpError extends Error {
  constructor(status, message, fields) {
    super(message)
    this.status = status
    this.fields = fields
  }
}

// Express 5 forwards rejected promises from async handlers to this handler.
function handleErrors(err, req, res, next) {
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'That file or request is too large.' })
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message, fields: err.fields })
  if (err.code === 'ER_DUP_ENTRY' && /type_slug/.test(err.sqlMessage)) {
    return res.status(409).json({ error: 'Another resource in this category already uses that slug.', fields: { slug: 'Slug already in use.' } })
  }
  if (err.code === 'ER_DUP_ENTRY' && /email/.test(err.sqlMessage)) {
    return res.status(409).json({ error: 'A user with that email already exists.', fields: { email: 'Already in use.' } })
  }
  console.error('[resources]', err)
  res.status(500).json({ error: 'Something went wrong on the server.' })
}

// ---------- Input helpers ----------
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

function safeUrl(v, { allowUploads = true } = {}) {
  const s = str(v, 500)
  if (!s) return ''
  if (allowUploads && /^\/uploads\/[A-Za-z0-9._-]+$/.test(s)) return s
  try {
    const u = new URL(s)
    if (u.protocol === 'https:') return u.href
  } catch {}
  return null
}

const today = () => new Date().toISOString().slice(0, 10)

async function parseResourceInput(body) {
  const fields = {}
  const type = str(body.type, 60)
  if (type === 'glossary' || !(await one('SELECT 1 FROM categories WHERE slug = ?', [type]))) fields.type = 'Choose a category.'
  const title = str(body.title, 200)
  if (!title) fields.title = 'Title is required.'
  const slug = str(body.slug, 120).toLowerCase()
  if (!SLUG_RE.test(slug)) fields.slug = 'Use lowercase letters, numbers and hyphens only.'
  const status = body.status === 'published' ? 'published' : 'draft'
  const publishedAt = str(body.publishedAt, 10)
  if (publishedAt && !/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) fields.publishedAt = 'Use a valid date.'
  const coverUrl = safeUrl(body.coverUrl)
  if (coverUrl === null) fields.coverUrl = 'Upload an image or use an https:// link.'
  const videoUrl = safeUrl(body.videoUrl, { allowUploads: false })
  if (videoUrl === null) fields.videoUrl = 'Use an https:// link (YouTube, Vimeo or Loom embed automatically).'
  const fileId = body.fileId ? Number(body.fileId) : null
  if (fileId && !(await one("SELECT 1 FROM uploads WHERE id = ? AND mime = 'application/pdf'", [fileId]))) fields.fileId = 'Upload a PDF.'
  const tags = (Array.isArray(body.tags) ? body.tags : [])
    .map((t) => str(t, 40))
    .filter(Boolean)
    .slice(0, 12)
  const m = body.meta || {}
  const meta = {
    customer: str(m.customer, 120),
    industry: str(m.industry, 80),
    results: (Array.isArray(m.results) ? m.results : []).map((r) => str(r, 160)).filter(Boolean).slice(0, 6),
    eventDate: str(m.eventDate, 40),
    duration: str(m.duration, 40),
  }
  for (const k of Object.keys(meta)) if (!meta[k] || (Array.isArray(meta[k]) && !meta[k].length)) delete meta[k]

  if (Object.keys(fields).length) throw new HttpError(400, 'Please fix the highlighted fields.', fields)
  return {
    type,
    slug,
    title,
    summary: str(body.summary, 400),
    body: typeof body.body === 'string' ? body.body.slice(0, 200_000) : '',
    cover_url: coverUrl,
    author: str(body.author, 100),
    published_at: publishedAt || (status === 'published' ? today() : null),
    status,
    featured: body.featured ? 1 : 0,
    tags: JSON.stringify(tags),
    video_url: videoUrl,
    file_id: fileId,
    gated: fileId && body.gated ? 1 : 0,
    meta: JSON.stringify(meta),
  }
}

// ---------- Serializers ----------
function card(r) {
  return {
    id: r.id,
    type: r.type,
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    coverUrl: r.cover_url,
    author: r.author,
    publishedAt: r.published_at,
    featured: !!r.featured,
    tags: json(r.tags, []),
    hasVideo: !!r.video_url,
    hasFile: !!r.file_id,
  }
}

function fullPublic(r) {
  return { ...card(r), body: r.body, videoUrl: r.video_url, gated: !!r.gated, meta: json(r.meta, {}) }
}

async function fullAdmin(r) {
  const file = r.file_id ? await one('SELECT id, original_name, size FROM uploads WHERE id = ?', [r.file_id]) : null
  return {
    ...fullPublic(r),
    status: r.status,
    fileId: r.file_id,
    file: file && { id: file.id, name: file.original_name, size: file.size },
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    updatedBy: r.updated_by_name || null,
  }
}

function category(c) {
  return { slug: c.slug, label: c.label, description: c.description, icon: c.icon, sort: c.sort, visible: !!c.visible }
}

// Published and not scheduled for the future, in a visible category.
const LIVE = `r.status = 'published' AND (r.published_at IS NULL OR r.published_at <= UTC_DATE())
  AND EXISTS (SELECT 1 FROM categories c WHERE c.slug = r.type AND c.visible = 1)`

// ---------- Signed download links for PDFs ----------
function sign(id, exp) {
  return createHmac('sha256', SIGNING_SECRET).update(`${id}.${exp}`).digest('base64url')
}

function downloadUrl(resourceId) {
  const exp = Date.now() + DOWNLOAD_LINK_MS
  return `/api/resources/file/${resourceId}?exp=${exp}&sig=${sign(resourceId, exp)}`
}

function validSignature(id, exp, sig) {
  if (!exp || !sig || Number(exp) < Date.now()) return false
  const a = Buffer.from(sign(id, exp))
  const b = Buffer.from(String(sig))
  return a.length === b.length && timingSafeEqual(a, b)
}

function sendStoredFile(res, upload, download) {
  const file = path.join(upload.private ? PRIVATE_UPLOAD_DIR : PUBLIC_UPLOAD_DIR, upload.stored_name)
  if (!fs.existsSync(file)) throw new HttpError(404, 'File not found.')
  res.setHeader('Content-Type', upload.mime)
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('Cache-Control', 'private, no-store')
  const name = upload.original_name.replace(/[^\w.\- ]+/g, '_')
  res.setHeader('Content-Disposition', `${download ? 'attachment' : 'inline'}; filename="${name}"`)
  fs.createReadStream(file).pipe(res)
}

// ================= Public router =================
export function publicRouter({ notifyDownload }) {
  const r = express.Router()
  r.use(express.json({ limit: '20kb' }))
  r.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache')
    next()
  })

  r.get('/', async (req, res) => {
    const cats = await query(
      `SELECT c.*, (SELECT COUNT(*) FROM resources r WHERE r.type = c.slug AND ${LIVE}) AS count
       FROM categories c WHERE c.visible = 1 ORDER BY c.sort, c.label`,
    )
    const { n: glossaryCount } = await one('SELECT COUNT(*) AS n FROM glossary')
    const featured = await query(`SELECT * FROM resources r WHERE ${LIVE} AND r.featured = 1 ORDER BY r.published_at DESC LIMIT 6`)
    const latest = await query(`SELECT * FROM resources r WHERE ${LIVE} ORDER BY r.published_at DESC, r.id DESC LIMIT 6`)
    res.json({
      categories: cats.map((c) => ({ ...category(c), count: Number(c.slug === 'glossary' ? glossaryCount : c.count) })),
      featured: featured.map(card),
      latest: latest.map(card),
      settings: { hub: await getSetting('hub'), teaser: await getSetting('teaser') },
    })
  })

  // PDF downloads: gated ones need a signed link from /unlock.
  r.get('/file/:id', async (req, res) => {
    const id = Number(req.params.id)
    const row = await one(
      `SELECT r.*, u.stored_name, u.original_name, u.mime, u.private FROM resources r JOIN uploads u ON u.id = r.file_id WHERE r.id = ? AND ${LIVE}`,
      [id],
    )
    if (!row) throw new HttpError(404, 'File not found.')
    if (row.gated && !validSignature(id, req.query.exp, req.query.sig)) {
      throw new HttpError(403, 'This download link has expired. Please request the file again.')
    }
    sendStoredFile(res, row, true)
  })

  r.get('/:type', async (req, res) => {
    const cat = await one('SELECT * FROM categories WHERE slug = ? AND visible = 1', [req.params.type])
    if (!cat) throw new HttpError(404, 'Not found.')
    if (cat.slug === 'glossary') {
      const terms = await query('SELECT term, definition AS def FROM glossary ORDER BY sort, id')
      return res.json({ category: category(cat), terms })
    }
    const items = await query(`SELECT * FROM resources r WHERE r.type = ? AND ${LIVE} ORDER BY r.featured DESC, r.published_at DESC, r.id DESC`, [cat.slug])
    res.json({ category: category(cat), items: items.map(card) })
  })

  r.get('/:type/:slug', async (req, res) => {
    const item = await one(`SELECT * FROM resources r WHERE r.type = ? AND r.slug = ? AND ${LIVE}`, [req.params.type, req.params.slug])
    if (!item) throw new HttpError(404, 'Not found.')
    const cat = await one('SELECT * FROM categories WHERE slug = ?', [item.type])
    const related = await query(`SELECT * FROM resources r WHERE r.type = ? AND r.id != ? AND ${LIVE} ORDER BY r.published_at DESC LIMIT 3`, [item.type, item.id])
    res.json({ category: category(cat), item: fullPublic(item), related: related.map(card) })
  })

  // Lead capture for gated PDFs: validates, records the lead, notifies the
  // team, then returns a short-lived signed download link.
  const unlockHits = new Map()
  r.post('/:type/:slug/unlock', async (req, res) => {
    const now = Date.now()
    const recent = (unlockHits.get(req.ip) || []).filter((t) => now - t < 10 * 60 * 1000)
    if (recent.length >= 10) throw new HttpError(429, 'Too many requests. Please try again in a few minutes.')
    recent.push(now)
    unlockHits.set(req.ip, recent)

    const item = await one(`SELECT * FROM resources r WHERE r.type = ? AND r.slug = ? AND ${LIVE} AND r.file_id IS NOT NULL`, [req.params.type, req.params.slug])
    if (!item) throw new HttpError(404, 'Not found.')
    if (!item.gated) return res.json({ url: downloadUrl(item.id) })
    if (req.body?.website) return res.json({ url: downloadUrl(item.id) }) // honeypot: let bots "succeed" without a lead

    const fields = validateLead('download', req.body)
    if (Object.keys(fields).length) throw new HttpError(400, 'Please fix the highlighted fields and try again.', fields)

    const lead = {
      name: str(req.body.name, 100),
      email: str(req.body.email, 254),
      company: str(req.body.company, 120),
      consent: true,
    }
    const attribution = {}
    for (const [k, v] of Object.entries(req.body.attribution || {})) {
      if (typeof v === 'string' && /^(utm_\w+|referrer|landingPage|pagePath)$/.test(k)) attribution[k] = v.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 300)
    }
    await query('INSERT INTO downloads (resource_id, resource_title, name, email, company, consent, attribution) VALUES (?, ?, ?, ?, ?, 1, ?)', [
      item.id,
      item.title,
      lead.name,
      lead.email,
      lead.company,
      JSON.stringify(attribution),
    ])
    notifyDownload?.({ ...lead, attribution, resource: { title: item.title, type: item.type, slug: item.slug } }).catch((err) =>
      console.error('[resources] download notification failed:', err.message),
    )
    res.json({ url: downloadUrl(item.id) })
  })

  setInterval(() => unlockHits.clear(), 10 * 60 * 1000).unref()
  r.use(handleErrors)
  return r
}

// ================= Admin router =================
const UPLOAD_TYPES = [
  { mime: 'image/png', ext: 'png', magic: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), max: 5 },
  { mime: 'image/jpeg', ext: 'jpg', magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff, max: 5 },
  { mime: 'image/webp', ext: 'webp', magic: (b) => b.subarray(0, 4).toString() === 'RIFF' && b.subarray(8, 12).toString() === 'WEBP', max: 5 },
  { mime: 'image/gif', ext: 'gif', magic: (b) => b.subarray(0, 4).toString() === 'GIF8', max: 5 },
  { mime: 'application/pdf', ext: 'pdf', magic: (b) => b.subarray(0, 5).toString() === '%PDF-', max: 25, private: true },
]

const RESOURCE_COLUMNS = ['type', 'slug', 'title', 'summary', 'body', 'cover_url', 'author', 'published_at', 'status', 'featured', 'tags', 'video_url', 'file_id', 'gated', 'meta']

export function adminRouter() {
  const r = express.Router()
  r.use(csrfGuard)
  r.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store')
    next()
  })

  // Uploads take a raw body; everything else is JSON.
  r.post('/uploads', requireAuth, express.raw({ type: () => true, limit: '25mb' }), async (req, res) => {
    const buf = req.body
    if (!Buffer.isBuffer(buf) || !buf.length) throw new HttpError(400, 'No file received.')
    const kind = UPLOAD_TYPES.find((t) => t.magic(buf))
    if (!kind) throw new HttpError(400, 'Only PNG, JPEG, WebP, GIF images and PDF files are allowed.')
    if (buf.length > kind.max * 1024 * 1024) throw new HttpError(413, `That file is over the ${kind.max} MB limit.`)
    let original = 'upload'
    try {
      original = str(decodeURIComponent(req.get('X-Filename') || 'upload'), 200).replace(/[\\/]/g, '_') || 'upload'
    } catch {}
    const stored = `${randomBytes(12).toString('hex')}.${kind.ext}`
    fs.writeFileSync(path.join(kind.private ? PRIVATE_UPLOAD_DIR : PUBLIC_UPLOAD_DIR, stored), buf)
    const result = await query('INSERT INTO uploads (stored_name, original_name, mime, size, private, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)', [
      stored,
      original,
      kind.mime,
      buf.length,
      kind.private ? 1 : 0,
      req.user.id,
    ])
    res.json({ id: result.insertId, name: original, size: buf.length, mime: kind.mime, url: kind.private ? null : `/uploads/${stored}` })
  })

  r.use(express.json({ limit: '1mb' }))

  // ---- Session ----
  r.post('/login', login)
  r.post('/logout', async (req, res) => {
    await destroySession(req, res)
    res.json({ ok: true })
  })

  r.use(requireAuth)

  r.get('/me', (req, res) => res.json({ user: publicUser(req.user) }))

  r.put('/me', async (req, res) => {
    const name = str(req.body?.name, 100)
    if (!name) throw new HttpError(400, 'Name is required.', { name: 'Name is required.' })
    const nextPw = typeof req.body?.newPassword === 'string' ? req.body.newPassword : ''
    if (nextPw) {
      if (!(await verifyPassword(String(req.body.currentPassword || ''), req.user.password_hash))) {
        throw new HttpError(400, 'Your current password is incorrect.', { currentPassword: 'Incorrect password.' })
      }
      if (nextPw.length < MIN_PASSWORD) throw new HttpError(400, `Use at least ${MIN_PASSWORD} characters.`, { newPassword: `At least ${MIN_PASSWORD} characters.` })
      await query('UPDATE users SET password_hash = ? WHERE id = ?', [await hashPassword(nextPw), req.user.id])
      await destroyUserSessions(req.user.id, req) // sign out other devices
    }
    await query('UPDATE users SET name = ? WHERE id = ?', [name, req.user.id])
    res.json({ user: publicUser(await one('SELECT * FROM users WHERE id = ?', [req.user.id])) })
  })

  // ---- Dashboard ----
  r.get('/stats', async (req, res) => {
    const byType = await query(
      `SELECT c.slug, c.label, c.icon,
         COALESCE(SUM(r.status = 'published'), 0) AS published,
         COALESCE(SUM(r.status = 'draft'), 0) AS drafts
       FROM categories c LEFT JOIN resources r ON r.type = c.slug
       GROUP BY c.slug, c.label, c.icon, c.sort ORDER BY c.sort`,
    )
    const { n: glossary } = await one('SELECT COUNT(*) AS n FROM glossary')
    const recent = await query('SELECT r.*, u.name AS updated_by_name FROM resources r LEFT JOIN users u ON u.id = r.updated_by ORDER BY r.updated_at DESC LIMIT 6')
    const { n: leads30 } = await one('SELECT COUNT(*) AS n FROM downloads WHERE created_at >= UTC_TIMESTAMP() - INTERVAL 30 DAY')
    res.json({
      byType: byType.map((t) => ({
        slug: t.slug,
        label: t.label,
        icon: t.icon,
        published: Number(t.slug === 'glossary' ? glossary : t.published),
        drafts: Number(t.drafts),
      })),
      recent: recent.map((x) => ({ ...card(x), status: x.status, updatedAt: x.updated_at, updatedBy: x.updated_by_name })),
      leads30: Number(leads30),
    })
  })

  // ---- Resources ----
  r.get('/resources', async (req, res) => {
    const where = []
    const args = []
    if (req.query.type) {
      where.push('r.type = ?')
      args.push(String(req.query.type))
    }
    if (req.query.status === 'draft' || req.query.status === 'published') {
      where.push('r.status = ?')
      args.push(req.query.status)
    }
    if (req.query.q) {
      where.push('(r.title LIKE ? OR r.summary LIKE ? OR r.slug LIKE ?)')
      const like = `%${String(req.query.q).slice(0, 100).replace(/[\\%_]/g, '\\$&')}%`
      args.push(like, like, like)
    }
    const rows = await query(
      `SELECT r.*, u.name AS updated_by_name FROM resources r LEFT JOIN users u ON u.id = r.updated_by
       ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY r.updated_at DESC`,
      args,
    )
    res.json({ items: rows.map((x) => ({ ...card(x), status: x.status, gated: !!x.gated, updatedAt: x.updated_at, updatedBy: x.updated_by_name })) })
  })

  const getAdminItem = (id) => one('SELECT r.*, u.name AS updated_by_name FROM resources r LEFT JOIN users u ON u.id = r.updated_by WHERE r.id = ?', [id])

  r.get('/resources/:id', async (req, res) => {
    const row = await getAdminItem(Number(req.params.id))
    if (!row) throw new HttpError(404, 'Resource not found.')
    res.json({ item: await fullAdmin(row) })
  })

  r.post('/resources', async (req, res) => {
    const d = await parseResourceInput(req.body || {})
    const result = await query(
      `INSERT INTO resources (${RESOURCE_COLUMNS.join(', ')}, updated_by) VALUES (${RESOURCE_COLUMNS.map(() => '?').join(', ')}, ?)`,
      [...RESOURCE_COLUMNS.map((c) => d[c]), req.user.id],
    )
    res.status(201).json({ item: await fullAdmin(await getAdminItem(result.insertId)) })
  })

  r.put('/resources/:id', async (req, res) => {
    const id = Number(req.params.id)
    if (!(await getAdminItem(id))) throw new HttpError(404, 'Resource not found.')
    const d = await parseResourceInput(req.body || {})
    await query(
      `UPDATE resources SET ${RESOURCE_COLUMNS.map((c) => `${c} = ?`).join(', ')}, updated_by = ?, updated_at = CURRENT_TIMESTAMP(3) WHERE id = ?`,
      [...RESOURCE_COLUMNS.map((c) => d[c]), req.user.id, id],
    )
    res.json({ item: await fullAdmin(await getAdminItem(id)) })
  })

  r.patch('/resources/:id/status', async (req, res) => {
    const id = Number(req.params.id)
    const status = req.body?.status === 'published' ? 'published' : 'draft'
    const result = await query(
      `UPDATE resources SET status = ?, published_at = COALESCE(published_at, IF(? = 'published', UTC_DATE(), NULL)),
         updated_by = ?, updated_at = CURRENT_TIMESTAMP(3) WHERE id = ?`,
      [status, status, req.user.id, id],
    )
    if (!result.affectedRows) throw new HttpError(404, 'Resource not found.')
    res.json({ item: await fullAdmin(await getAdminItem(id)) })
  })

  r.delete('/resources/:id', async (req, res) => {
    const result = await query('DELETE FROM resources WHERE id = ?', [Number(req.params.id)])
    if (!result.affectedRows) throw new HttpError(404, 'Resource not found.')
    res.json({ ok: true })
  })

  // Admin preview of a private PDF.
  r.get('/uploads/:id/file', async (req, res) => {
    const up = await one('SELECT * FROM uploads WHERE id = ?', [Number(req.params.id)])
    if (!up) throw new HttpError(404, 'File not found.')
    sendStoredFile(res, up, false)
  })

  // ---- Glossary ----
  const termInput = (b) => {
    const term = str(b?.term, 160)
    const def = str(b?.def, 1000)
    const fields = {}
    if (!term) fields.term = 'Term is required.'
    if (!def) fields.def = 'Definition is required.'
    if (Object.keys(fields).length) throw new HttpError(400, 'Please fill in both fields.', fields)
    return { term, def }
  }
  const allTerms = () => query('SELECT id, term, definition AS def, sort FROM glossary ORDER BY sort, id')

  r.get('/glossary', async (req, res) => res.json({ terms: await allTerms() }))
  r.post('/glossary', async (req, res) => {
    const { term, def } = termInput(req.body)
    const { n } = await one('SELECT COALESCE(MAX(sort), -1) + 1 AS n FROM glossary')
    await query('INSERT INTO glossary (term, definition, sort) VALUES (?, ?, ?)', [term, def, n])
    res.status(201).json({ terms: await allTerms() })
  })
  r.put('/glossary/:id', async (req, res) => {
    const { term, def } = termInput(req.body)
    const result = await query('UPDATE glossary SET term = ?, definition = ? WHERE id = ?', [term, def, Number(req.params.id)])
    if (!result.affectedRows) throw new HttpError(404, 'Term not found.')
    res.json({ terms: await allTerms() })
  })
  r.delete('/glossary/:id', async (req, res) => {
    await query('DELETE FROM glossary WHERE id = ?', [Number(req.params.id)])
    res.json({ terms: await allTerms() })
  })
  r.put('/glossary-order', async (req, res) => {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(Number) : []
    await transaction(async (tx) => {
      for (const [i, id] of ids.entries()) await tx.query('UPDATE glossary SET sort = ? WHERE id = ?', [i, id])
    })
    res.json({ terms: await allTerms() })
  })

  // ---- Categories (fixed set of slugs; label/description/icon/order/visibility editable) ----
  const allCats = async () => (await query('SELECT * FROM categories ORDER BY sort, label')).map(category)
  r.get('/categories', async (req, res) => res.json({ categories: await allCats(), icons: ICONS }))
  r.put('/categories/:slug', async (req, res) => {
    const label = str(req.body?.label, 60)
    const description = str(req.body?.description, 300)
    const icon = ICONS.includes(req.body?.icon) ? req.body.icon : null
    const fields = {}
    if (!label) fields.label = 'Label is required.'
    if (!icon) fields.icon = 'Choose an icon.'
    if (Object.keys(fields).length) throw new HttpError(400, 'Please fix the highlighted fields.', fields)
    const result = await query('UPDATE categories SET label = ?, description = ?, icon = ?, visible = ? WHERE slug = ?', [
      label,
      description,
      icon,
      req.body?.visible === false ? 0 : 1,
      req.params.slug,
    ])
    if (!result.affectedRows) throw new HttpError(404, 'Category not found.')
    res.json({ categories: await allCats() })
  })
  r.put('/categories-order', async (req, res) => {
    const slugs = Array.isArray(req.body?.slugs) ? req.body.slugs.map(String) : []
    await transaction(async (tx) => {
      for (const [i, s] of slugs.entries()) await tx.query('UPDATE categories SET sort = ? WHERE slug = ?', [i, s])
    })
    res.json({ categories: await allCats() })
  })

  // ---- Page copy ----
  r.get('/settings', async (req, res) => res.json({ hub: await getSetting('hub'), teaser: await getSetting('teaser'), defaults: DEFAULT_SETTINGS }))
  r.put('/settings/:key', async (req, res) => {
    const key = req.params.key
    const shape = DEFAULT_SETTINGS[key]
    if (!shape) throw new HttpError(404, 'Unknown settings group.')
    const value = {}
    for (const k of Object.keys(shape)) value[k] = str(req.body?.[k], 600) || shape[k]
    await setSetting(key, value)
    res.json({ [key]: value })
  })

  // ---- Download leads ----
  r.get('/downloads', async (req, res) => {
    const rows = await query('SELECT * FROM downloads ORDER BY created_at DESC LIMIT 500')
    res.json({ leads: rows.map((d) => ({ ...d, consent: !!d.consent, attribution: json(d.attribution, {}) })) })
  })
  r.get('/downloads.csv', async (req, res) => {
    const rows = await query('SELECT * FROM downloads ORDER BY created_at DESC')
    // Prefix cells that a spreadsheet would treat as formulas.
    const cell = (v) => {
      let s = v instanceof Date ? v.toISOString() : String(v ?? '')
      if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`
      return `"${s.replace(/"/g, '""')}"`
    }
    const head = ['Date', 'Name', 'Email', 'Company', 'Resource', 'Consent', 'UTM source', 'UTM campaign', 'Referrer']
    const lines = rows.map((d) => {
      const a = json(d.attribution, {})
      return [d.created_at, d.name, d.email, d.company, d.resource_title, d.consent ? 'yes' : 'no', a.utm_source, a.utm_campaign, a.referrer].map(cell).join(',')
    })
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="teemly-download-leads-${today()}.csv"`)
    res.send([head.map(cell).join(','), ...lines].join('\r\n'))
  })

  // ---- Users (admins only) ----
  const allUsers = async () => (await query('SELECT * FROM users ORDER BY created_at')).map(publicUser)
  const activeAdmins = async () => Number((await one("SELECT COUNT(*) AS n FROM users WHERE role = 'admin' AND active = 1")).n)

  r.get('/users', requireAdmin, async (req, res) => res.json({ users: await allUsers() }))

  r.post('/users', requireAdmin, async (req, res) => {
    const email = str(req.body?.email, 254).toLowerCase()
    const name = str(req.body?.name, 100)
    const role = ROLES.includes(req.body?.role) ? req.body.role : 'editor'
    const password = typeof req.body?.password === 'string' ? req.body.password : ''
    const fields = {}
    if (!EMAIL_RE.test(email)) fields.email = 'Enter a valid email.'
    if (!name) fields.name = 'Name is required.'
    if (password.length < MIN_PASSWORD) fields.password = `At least ${MIN_PASSWORD} characters.`
    if (Object.keys(fields).length) throw new HttpError(400, 'Please fix the highlighted fields.', fields)
    await query('INSERT INTO users (email, name, role, password_hash) VALUES (?, ?, ?, ?)', [email, name, role, await hashPassword(password)])
    res.status(201).json({ users: await allUsers() })
  })

  r.put('/users/:id', requireAdmin, async (req, res) => {
    const id = Number(req.params.id)
    const user = await one('SELECT * FROM users WHERE id = ?', [id])
    if (!user) throw new HttpError(404, 'User not found.')
    const name = str(req.body?.name, 100) || user.name
    const role = ROLES.includes(req.body?.role) ? req.body.role : user.role
    const active = req.body?.active === undefined ? !!user.active : !!req.body.active
    const losesAdmin = user.role === 'admin' && user.active && (role !== 'admin' || !active)
    if (losesAdmin && id === req.user.id) throw new HttpError(400, "You can't remove your own admin access.")
    if (losesAdmin && (await activeAdmins()) <= 1) throw new HttpError(400, 'There must be at least one active admin.')
    const password = typeof req.body?.password === 'string' ? req.body.password : ''
    if (password && password.length < MIN_PASSWORD) throw new HttpError(400, `Use at least ${MIN_PASSWORD} characters.`, { password: `At least ${MIN_PASSWORD} characters.` })

    await query('UPDATE users SET name = ?, role = ?, active = ? WHERE id = ?', [name, role, active ? 1 : 0, id])
    if (password) await query('UPDATE users SET password_hash = ? WHERE id = ?', [await hashPassword(password), id])
    if (password || !active) await destroyUserSessions(id, id === req.user.id ? req : null)
    res.json({ users: await allUsers() })
  })

  r.delete('/users/:id', requireAdmin, async (req, res) => {
    const id = Number(req.params.id)
    if (id === req.user.id) throw new HttpError(400, "You can't delete your own account.")
    const user = await one('SELECT * FROM users WHERE id = ?', [id])
    if (!user) throw new HttpError(404, 'User not found.')
    if (user.role === 'admin' && user.active && (await activeAdmins()) <= 1) throw new HttpError(400, 'There must be at least one active admin.')
    await query('DELETE FROM users WHERE id = ?', [id])
    res.json({ users: await allUsers() })
  })

  r.use(handleErrors)
  return r
}
