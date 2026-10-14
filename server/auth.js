// Admin accounts + sessions. Passwords are hashed with scrypt; sessions are
// random tokens kept in an httpOnly, SameSite=Strict cookie and stored hashed
// in MySQL, so a leaked database can't be used to hijack a live session.
import { createHash, randomBytes, scrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { query, one } from './db.js'

const scryptAsync = promisify(scrypt)

export const ROLES = ['admin', 'editor']
export const COOKIE = 'teemly_admin'
const SESSION_MS = 8 * 60 * 60 * 1000
export const MIN_PASSWORD = 10

export async function hashPassword(password) {
  const salt = randomBytes(16)
  const key = await scryptAsync(password, salt, 64)
  return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`
}

export async function verifyPassword(password, stored) {
  const [scheme, saltHex, keyHex] = String(stored).split('$')
  if (scheme !== 'scrypt' || !saltHex || !keyHex) return false
  const expected = Buffer.from(keyHex, 'hex')
  const key = await scryptAsync(password, Buffer.from(saltHex, 'hex'), expected.length)
  return timingSafeEqual(key, expected)
}

// Used when the email doesn't exist, so response time doesn't reveal which accounts exist.
const DUMMY_HASH = 'scrypt$' + '0'.repeat(32) + '$' + '0'.repeat(128)

const sha256 = (s) => createHash('sha256').update(s).digest('hex')

export function publicUser(u) {
  return u && { id: u.id, email: u.email, name: u.name, role: u.role, active: !!u.active, createdAt: u.created_at, lastLoginAt: u.last_login_at }
}

function parseCookies(header = '') {
  const out = {}
  for (const part of header.split(';')) {
    const i = part.indexOf('=')
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim())
  }
  return out
}

function cookieAttrs(req) {
  // Secure when served over HTTPS (directly or via the Nginx proxy).
  return `Path=/; HttpOnly; SameSite=Strict${req.secure ? '; Secure' : ''}`
}

export async function createSession(req, res, userId) {
  const token = randomBytes(32).toString('base64url')
  await query('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)', [sha256(token), userId, Date.now() + SESSION_MS])
  await query('UPDATE users SET last_login_at = CURRENT_TIMESTAMP(3) WHERE id = ?', [userId])
  res.setHeader('Set-Cookie', `${COOKIE}=${token}; ${cookieAttrs(req)}; Max-Age=${SESSION_MS / 1000}`)
}

export async function destroySession(req, res) {
  const token = parseCookies(req.headers.cookie)[COOKIE]
  if (token) await query('DELETE FROM sessions WHERE token_hash = ?', [sha256(token)])
  res.setHeader('Set-Cookie', `${COOKIE}=; ${cookieAttrs(req)}; Max-Age=0`)
}

export async function destroyUserSessions(userId, exceptReq) {
  const keep = exceptReq ? parseCookies(exceptReq.headers.cookie)[COOKIE] : null
  await query('DELETE FROM sessions WHERE user_id = ? AND token_hash != ?', [userId, keep ? sha256(keep) : ''])
}

// Attaches req.user when the session cookie is valid; responds 401 otherwise.
export async function requireAuth(req, res, next) {
  const token = parseCookies(req.headers.cookie)[COOKIE]
  if (token) {
    const row = await one(
      `SELECT u.*, s.expires_at FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = ? AND u.active = 1`,
      [sha256(token)],
    )
    if (row && row.expires_at > Date.now()) {
      req.user = row
      return next()
    }
  }
  res.status(401).json({ error: 'Please sign in.' })
}

export function requireAdmin(req, res, next) {
  if (req.user?.role === 'admin') return next()
  res.status(403).json({ error: 'Only admins can do that.' })
}

// Cookies are SameSite=Strict; additionally require a custom header on every
// state-changing request, which cross-site forms can't send.
export function csrfGuard(req, res, next) {
  if (req.method === 'GET' || req.method === 'HEAD' || req.get('X-Teemly-Admin') === '1') return next()
  res.status(403).json({ error: 'Missing admin request header.' })
}

// ---- Login throttle: 8 failed attempts / 15 min per IP + email ----
const LOGIN_WINDOW = 15 * 60 * 1000
const LOGIN_MAX = 8
const failures = new Map()

export async function login(req, res) {
  const email = String(req.body?.email || '').trim().toLowerCase().slice(0, 254)
  const password = String(req.body?.password || '').slice(0, 200)
  const key = `${req.ip}|${email}`
  const now = Date.now()
  const recent = (failures.get(key) || []).filter((t) => now - t < LOGIN_WINDOW)
  if (recent.length >= LOGIN_MAX) {
    return res.status(429).json({ error: 'Too many attempts. Please wait 15 minutes and try again.' })
  }

  const user = await one('SELECT * FROM users WHERE email = ?', [email])
  const ok = await verifyPassword(password, user?.password_hash || DUMMY_HASH)
  if (!user || !ok || !user.active) {
    recent.push(now)
    failures.set(key, recent)
    return res.status(401).json({ error: 'Incorrect email or password.' })
  }
  failures.delete(key)
  await createSession(req, res, user.id)
  res.json({ user: publicUser(user) })
}

setInterval(() => {
  query('DELETE FROM sessions WHERE expires_at < ?', [Date.now()]).catch((err) => console.error('[auth] session cleanup failed:', err.message))
  const now = Date.now()
  for (const [k, times] of failures) if (times.every((t) => now - t >= LOGIN_WINDOW)) failures.delete(k)
}, LOGIN_WINDOW).unref()
