// MySQL storage for the Resource Center and the admin panel (mysql2 pool).
// Connection settings come from .env (MYSQL_*). On startup `ready` creates the
// database + tables if missing and seeds them from src/data/resourcesMeta.js.
// Uploaded files are kept on disk under server/data/uploads (or DATA_DIR).
import fs from 'node:fs'
import path from 'node:path'
import { randomBytes } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'
import { resourceTypes, glossaryTerms, DEFAULT_SETTINGS } from '../src/data/resourcesMeta.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// Load .env here too so `npm run admin:create` works on its own.
try {
  process.loadEnvFile(path.join(ROOT, '.env'))
} catch {}

export const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(__dirname, 'data')
export const PUBLIC_UPLOAD_DIR = path.join(DATA_DIR, 'uploads', 'public')
export const PRIVATE_UPLOAD_DIR = path.join(DATA_DIR, 'uploads', 'private')
for (const dir of [PUBLIC_UPLOAD_DIR, PRIVATE_UPLOAD_DIR]) fs.mkdirSync(dir, { recursive: true })

export { DEFAULT_SETTINGS }

const { MYSQL_HOST = '127.0.0.1', MYSQL_PORT = '3306', MYSQL_USER = 'root', MYSQL_PASSWORD = '', MYSQL_DATABASE = 'teemly' } = process.env
if (!/^\w+$/.test(MYSQL_DATABASE)) throw new Error('MYSQL_DATABASE may only contain letters, numbers and underscores.')

const connection = {
  host: MYSQL_HOST,
  port: Number(MYSQL_PORT),
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  charset: 'utf8mb4',
  timezone: 'Z', // DATETIMEs are stored and read as UTC
  dateStrings: ['DATE'], // publish dates stay plain 'YYYY-MM-DD' strings
}

export const pool = mysql.createPool({ ...connection, database: MYSQL_DATABASE, connectionLimit: 10 })
// Make NOW()/CURRENT_TIMESTAMP UTC on every pooled connection.
pool.pool.on('connection', (conn) => conn.query("SET time_zone = '+00:00'"))

// ---- Query helpers ----
export async function query(sql, params) {
  const [rows] = await pool.query(sql, params)
  return rows
}

export async function one(sql, params) {
  return (await query(sql, params))[0]
}

// Runs fn(conn) inside a transaction; conn has the same query()/one() helpers.
export async function transaction(fn) {
  const conn = await pool.getConnection()
  const tx = {
    query: async (sql, params) => (await conn.query(sql, params))[0],
    one: async (sql, params) => (await conn.query(sql, params))[0][0],
  }
  try {
    await conn.beginTransaction()
    const result = await fn(tx)
    await conn.commit()
    return result
  } catch (err) {
    await conn.rollback()
    throw err
  } finally {
    conn.release()
  }
}

// JSON columns come back parsed from MySQL, but tolerate strings (e.g. MariaDB).
export function json(v, fallback) {
  if (v == null) return fallback
  if (typeof v === 'string') {
    try {
      return JSON.parse(v)
    } catch {
      return fallback
    }
  }
  return v
}

export async function getSetting(name) {
  const row = await one('SELECT value FROM settings WHERE name = ?', [name])
  return row ? json(row.value, DEFAULT_SETTINGS[name]) : DEFAULT_SETTINGS[name]
}

export async function setSetting(name, value) {
  await query('INSERT INTO settings (name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)', [name, JSON.stringify(value)])
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(254) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'editor') NOT NULL DEFAULT 'editor',
    password_hash VARCHAR(255) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    last_login_at DATETIME(3) NULL
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    token_hash CHAR(64) PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    expires_at BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (expires_at)
  )`,
  `CREATE TABLE IF NOT EXISTS categories (
    slug VARCHAR(60) PRIMARY KEY,
    label VARCHAR(60) NOT NULL,
    description VARCHAR(300) NOT NULL DEFAULT '',
    icon VARCHAR(40) NOT NULL DEFAULT 'book',
    template VARCHAR(40) NOT NULL DEFAULT '',
    sort INT NOT NULL DEFAULT 0,
    visible TINYINT(1) NOT NULL DEFAULT 1
  )`,
  `CREATE TABLE IF NOT EXISTS uploads (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    stored_name VARCHAR(64) NOT NULL UNIQUE,
    original_name VARCHAR(200) NOT NULL,
    mime VARCHAR(60) NOT NULL,
    size INT UNSIGNED NOT NULL,
    private TINYINT(1) NOT NULL DEFAULT 0,
    uploaded_by INT UNSIGNED NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
  )`,
  `CREATE TABLE IF NOT EXISTS resources (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(60) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    title VARCHAR(200) NOT NULL,
    summary VARCHAR(400) NOT NULL DEFAULT '',
    body MEDIUMTEXT NOT NULL,
    cover_url VARCHAR(500) NOT NULL DEFAULT '',
    author VARCHAR(100) NOT NULL DEFAULT '',
    published_at DATE NULL,
    status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
    featured TINYINT(1) NOT NULL DEFAULT 0,
    tags JSON NOT NULL,
    video_url VARCHAR(500) NOT NULL DEFAULT '',
    file_id INT UNSIGNED NULL,
    gated TINYINT(1) NOT NULL DEFAULT 0,
    meta JSON NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updated_by INT UNSIGNED NULL,
    UNIQUE KEY type_slug (type, slug),
    INDEX type_status (type, status),
    FOREIGN KEY (type) REFERENCES categories(slug) ON UPDATE CASCADE,
    FOREIGN KEY (file_id) REFERENCES uploads(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
  )`,
  `CREATE TABLE IF NOT EXISTS glossary (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    term VARCHAR(160) NOT NULL,
    definition VARCHAR(1000) NOT NULL,
    sort INT NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS settings (
    name VARCHAR(60) PRIMARY KEY,
    value JSON NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS downloads (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    resource_id INT UNSIGNED NULL,
    resource_title VARCHAR(200) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(254) NOT NULL,
    company VARCHAR(120) NOT NULL DEFAULT '',
    consent TINYINT(1) NOT NULL DEFAULT 0,
    attribution JSON NOT NULL,
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    INDEX (created_at),
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE SET NULL
  )`,
]

export let SIGNING_SECRET = ''

async function init() {
  // Create the database itself if this MySQL user is allowed to.
  const admin = await mysql.createConnection(connection)
  try {
    await admin.query(`CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci`)
  } catch (err) {
    if (err.code !== 'ER_DBACCESS_DENIED_ERROR') throw err
  } finally {
    await admin.end()
  }

  for (const sql of SCHEMA) await query(`${sql} ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)

  // Columns added after the first release.
  const hasColumn = (table, column) =>
    one('SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?', [table, column])
  if (!(await hasColumn('categories', 'template'))) {
    await query("ALTER TABLE categories ADD COLUMN template VARCHAR(40) NOT NULL DEFAULT '' AFTER icon")
  }

  if (!(await one('SELECT 1 FROM categories LIMIT 1'))) {
    await transaction(async (tx) => {
      for (const [i, r] of resourceTypes.entries()) {
        await tx.query('INSERT INTO categories (slug, label, description, icon, sort) VALUES (?, ?, ?, ?, ?)', [r.slug, r.label, r.description, r.icon, i])
      }
      for (const [i, g] of glossaryTerms.entries()) {
        await tx.query('INSERT INTO glossary (term, definition, sort) VALUES (?, ?, ?)', [g.term, g.def, i])
      }
    })
    console.log('[db] seeded categories and glossary from src/data/resourcesMeta.js')
  }

  // Server-side secret for signing gated download links (never sent to clients).
  let secret = await getSetting('_signingSecret')
  if (!secret) {
    secret = randomBytes(32).toString('hex')
    await setSetting('_signingSecret', secret)
  }
  SIGNING_SECRET = secret
}

// Resolves once the schema is in place; the server waits on it before listening.
export const ready = init()
ready.catch(() => {}) // callers await `ready` and handle the error themselves
