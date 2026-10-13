// Teemly website server: serves the built Vite site (dist/) and handles the
// Contact + Book a Demo form submissions by emailing them via Gmail SMTP.
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'
import nodemailer from 'nodemailer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Load .env from the project root (Node 20.12+). Real env vars take precedence.
try {
  process.loadEnvFile(path.join(ROOT, '.env'))
} catch {
  // No .env file — rely on the process environment.
}

const { SMTP_USER, SMTP_PASS, MAIL_TO, PORT = 3001 } = process.env
// Public site URL for links in auto-reply emails (optional, no trailing slash)
const SITE_URL = (process.env.SITE_URL || '').replace(/\/+$/, '')

if (!SMTP_USER || !SMTP_PASS || !MAIL_TO) {
  console.error('Missing SMTP_USER, SMTP_PASS or MAIL_TO. Copy .env.example to .env and fill it in.')
  process.exit(1)
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
})

// ---- Form definitions: which fields each form accepts, in email order ----
const FORMS = {
  contact: {
    title: 'Contact / Sales enquiry',
    required: ['name', 'email'],
    fields: {
      name: 'Full name',
      email: 'Work email',
      company: 'Company',
      seats: 'Team size',
      message: 'What are you hoping to solve?',
    },
    subject: (d) => `New contact enquiry — ${d.name}${d.company ? ` (${d.company})` : ''}`,
    autoReply: {
      subject: 'Thanks for contacting Teemly — we’ve got your message',
      firstName: (d) => d.name.split(/\s+/)[0],
      paragraphs: [
        'Thanks for reaching out to Teemly. Your message has reached our team, and a real person — not a bot — will get back to you within one business day.',
        'If you mentioned your team size, we’ll come prepared with the plan and setup that fits. Enterprise enquiries are routed straight to our team for a custom quote.',
      ],
      summary: ['company', 'seats'],
      links: [
        { label: 'See pricing', path: '/pricing' },
        { label: 'Security & privacy', path: '/security' },
      ],
    },
  },
  demo: {
    title: 'Book a Demo request',
    required: ['firstName', 'lastName', 'email', 'company', 'country', 'companySize', 'role', 'problem'],
    fields: {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Work email',
      company: 'Company',
      jobTitle: 'Job title',
      country: 'Country',
      companySize: 'Company size',
      role: 'Role',
      problem: 'Primary problem',
      message: 'What would you like to discuss?',
    },
    subject: (d) => `New demo request — ${d.firstName} ${d.lastName} (${d.company})`,
    autoReply: {
      subject: 'Your Teemly demo request is confirmed',
      firstName: (d) => d.firstName,
      paragraphs: [
        'Thanks for requesting a Teemly demo. We’ve received your details, and our team will email you within one business day with a few time slots to choose from.',
        'On the call we’ll walk through the real-time dashboard, our own lightweight desktop agent, and the privacy controls — tailored to the problem you told us about. Feel free to bring your questions and anyone from your team.',
      ],
      summary: ['company', 'companySize', 'role', 'problem'],
      links: [
        { label: 'Explore the platform', path: '/platform' },
        { label: 'Calculate your ROI', path: '/roi-calculator' },
      ],
    },
  },
}

const MAX_LEN = 5000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

// Keep only known fields, coerce to trimmed strings, cap length.
function clean(body, def) {
  const data = {}
  for (const key of Object.keys(def.fields)) {
    const v = body?.[key]
    data[key] = typeof v === 'string' ? v.trim().slice(0, MAX_LEN) : ''
  }
  return data
}

function buildEmail(def, data) {
  const rows = Object.entries(def.fields)
  const text = rows.map(([k, label]) => `${label}: ${data[k] || '-'}`).join('\n')
  const html = `
    <h2 style="font-family:sans-serif;color:#09124b">${escapeHtml(def.title)}</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
      ${rows
        .map(
          ([k, label]) => `<tr>
            <td style="padding:6px 16px 6px 0;color:#6b7093;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td>
            <td style="padding:6px 0;color:#0a1140;white-space:pre-wrap">${escapeHtml(data[k] || '-')}</td>
          </tr>`,
        )
        .join('')}
    </table>`
  return { text, html }
}

// Confirmation email to the person who submitted the form. Deliberately only
// echoes short structured fields (never the free-text message) so the form
// can't be abused to relay arbitrary content to a third party's inbox.
function buildAutoReply(def, data) {
  const reply = def.autoReply
  const name = reply.firstName(data).slice(0, 40)
  const summary = reply.summary.filter((k) => data[k]).map((k) => [def.fields[k], data[k].slice(0, 100)])
  const links = SITE_URL ? reply.links.map((l) => ({ label: l.label, url: SITE_URL + l.path })) : []

  const text = [
    `Hi ${name},`,
    '',
    ...reply.paragraphs.flatMap((p) => [p, '']),
    ...(summary.length ? ['What you shared with us:', ...summary.map(([l, v]) => `  ${l}: ${v}`), ''] : []),
    ...(links.length ? ['While you wait:', ...links.map((l) => `  ${l.label}: ${l.url}`), ''] : []),
    'Just reply to this email if you have anything to add.',
    '',
    'Best,',
    'The Teemly team',
  ].join('\n')

  const font = 'font-family:Inter,Segoe UI,Arial,sans-serif'
  const html = `
<div style="background:#f6f7fc;padding:32px 16px;${font}">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e6e7f2">
    <div style="height:4px;background:linear-gradient(90deg,#0aa1e8,#04dcd9,#6a2cc7,#f52998)"></div>
    <div style="padding:32px">
      <div style="font-size:22px;font-weight:800;color:#09124b;letter-spacing:-0.5px;margin-bottom:24px">Teemly</div>
      <p style="font-size:16px;color:#0a1140;margin:0 0 16px">Hi ${escapeHtml(name)},</p>
      ${reply.paragraphs
        .map((p) => `<p style="font-size:15px;line-height:1.6;color:#3d4266;margin:0 0 16px">${escapeHtml(p)}</p>`)
        .join('')}
      ${
        summary.length
          ? `<div style="background:#f6f7fc;border-radius:12px;padding:16px 20px;margin:24px 0">
        <div style="font-size:12px;font-weight:700;color:#6b7093;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:8px">What you shared with us</div>
        <table style="font-size:14px;border-collapse:collapse">
          ${summary
            .map(
              ([l, v]) => `<tr>
            <td style="padding:4px 16px 4px 0;color:#6b7093;white-space:nowrap">${escapeHtml(l)}</td>
            <td style="padding:4px 0;color:#0a1140;font-weight:600">${escapeHtml(v)}</td>
          </tr>`,
            )
            .join('')}
        </table>
      </div>`
          : ''
      }
      ${
        links.length
          ? `<p style="font-size:14px;color:#3d4266;margin:0 0 12px">While you wait:</p>
      <p style="margin:0 0 24px">${links
        .map(
          (l) =>
            `<a href="${escapeHtml(l.url)}" style="display:inline-block;margin:0 8px 8px 0;padding:10px 18px;border-radius:999px;background:#09124b;color:#fff;text-decoration:none;font-size:14px;font-weight:600">${escapeHtml(l.label)} →</a>`,
        )
        .join('')}</p>`
          : ''
      }
      <p style="font-size:15px;line-height:1.6;color:#3d4266;margin:0 0 16px">Just reply to this email if you have anything to add.</p>
      <p style="font-size:15px;color:#0a1140;margin:0">Best,<br><strong>The Teemly team</strong></p>
    </div>
  </div>
  <p style="max-width:560px;margin:16px auto 0;font-size:12px;color:#9297b3;text-align:center">
    You’re receiving this because this email address was submitted on the Teemly website. If that wasn’t you, you can safely ignore it.
  </p>
</div>`
  return { subject: reply.subject, text, html }
}

// ---- Simple in-memory rate limit: 5 submissions / 10 min per IP ----
const WINDOW_MS = 10 * 60 * 1000
const MAX_HITS = 5
const hits = new Map()

function rateLimit(req, res, next) {
  const now = Date.now()
  const recent = (hits.get(req.ip) || []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_HITS) {
    return res.status(429).json({ error: 'Too many submissions. Please try again in a few minutes.' })
  }
  recent.push(now)
  hits.set(req.ip, recent)
  next()
}

setInterval(() => {
  const now = Date.now()
  for (const [ip, times] of hits) {
    if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(ip)
  }
}, WINDOW_MS).unref()

// ---- App ----
const app = express()
app.set('trust proxy', 1) // behind Nginx: use X-Forwarded-For for req.ip
app.use(express.json({ limit: '50kb' }))

app.post('/api/forms/:type', rateLimit, async (req, res) => {
  const def = FORMS[req.params.type]
  if (!def) return res.status(404).json({ error: 'Unknown form' })

  // Honeypot: real users never see or fill this field.
  if (req.body?.website) {
    console.warn(`[forms/${req.params.type}] honeypot filled — submission dropped`)
    return res.json({ ok: true })
  }

  const data = clean(req.body, def)
  const missing = def.required.filter((k) => !data[k])
  if (missing.length) return res.status(400).json({ error: 'Please fill in all required fields.' })
  if (!EMAIL_RE.test(data.email)) return res.status(400).json({ error: 'Please enter a valid email address.' })

  const { text, html } = buildEmail(def, data)

  try {
    await transporter.sendMail({
      from: `"Teemly Website" <${SMTP_USER}>`,
      to: MAIL_TO,
      replyTo: data.email,
      subject: def.subject(data).replace(/[\r\n]+/g, ' '),
      text,
      html,
    })
    console.log(`[forms/${req.params.type}] lead emailed to ${MAIL_TO}`)
  } catch (err) {
    console.error(`[forms/${req.params.type}] sendMail failed:`, err)
    return res.status(500).json({ error: 'Sorry, we could not send your message. Please try again or email us directly.' })
  }

  // The lead reached us, so the submission is a success regardless of the
  // auto-reply. Send the confirmation in the background and only log failures.
  res.json({ ok: true })

  const reply = buildAutoReply(def, data)
  transporter
    .sendMail({
      from: `"Teemly" <${SMTP_USER}>`,
      to: data.email,
      replyTo: MAIL_TO,
      subject: reply.subject,
      text: reply.text,
      html: reply.html,
    })
    .then(() => console.log(`[forms/${req.params.type}] auto-reply sent to ${data.email}`))
    .catch((err) => console.error(`[forms/${req.params.type}] auto-reply to submitter failed:`, err.message))
})

// ---- Serve the built site with SPA fallback ----
const DIST = path.join(ROOT, 'dist')
app.use(express.static(DIST))
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) return next()
  res.sendFile(path.join(DIST, 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Teemly server listening on http://localhost:${PORT}`)
})
