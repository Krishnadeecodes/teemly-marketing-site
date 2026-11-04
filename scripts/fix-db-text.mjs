// One-time fix for website text stored in MySQL: American spelling, the
// Org Intelligence Score name, and the old free-trial line.
//
//   node --env-file=.env scripts/fix-db-text.mjs            preview only
//   node --env-file=.env scripts/fix-db-text.mjs --apply    back up, then write
//
// Only displayed text changes. Slugs, HTML tags and links are left alone, and
// published dates are kept. Safe to run twice: the second run finds nothing.
import fs from 'node:fs'
import path from 'node:path'
import mysql from 'mysql2/promise'

const apply = process.argv.includes('--apply')

const WORDS = [
  [/organis/g, 'organiz'], [/Organis/g, 'Organiz'],
  [/licence/g, 'license'], [/Licence/g, 'License'],
  [/utilis/g, 'utiliz'], [/Utilis/g, 'Utiliz'],
  [/summaris/g, 'summariz'], [/Summaris/g, 'Summariz'],
  [/minimis/g, 'minimiz'], [/recognise/g, 'recognize'],
  [/catalogue/g, 'catalog'], [/Catalogue/g, 'Catalog'],
  [/\bcentres\b/g, 'centers'],
  [/Org Productivity Score/g, 'Org Intelligence Score'],
  [/A free trial is available\./g, 'Book a demo to walk through the options.'],
]
const fixText = (s) => WORDS.reduce((t, [from, to]) => t.replace(from, to), s)
// In HTML, the odd pieces of the split are tags: keep those exactly as they are.
const fixHtml = (s) => s.split(/(<[^>]*>)/).map((part, i) => (i % 2 ? part : fixText(part))).join('')

const TARGETS = [
  { table: 'categories', key: 'slug', fields: { description: fixText } },
  // "analyses" is a verb only here; in the articles it is the plural noun
  { table: 'glossary', key: 'id', fields: { term: fixText, definition: (s) => fixText(s).replace(/\banalyses\b/g, 'analyzes') } },
  { table: 'resources', key: 'id', fields: { title: fixText, summary: fixText, body: fixHtml } },
]

const db = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
})

const changes = []
for (const { table, key, fields } of TARGETS) {
  const [rows] = await db.query(`SELECT ${key} AS id, ${Object.keys(fields).join(', ')} FROM ${table}`)
  for (const row of rows) {
    for (const [field, fix] of Object.entries(fields)) {
      const before = row[field] ?? ''
      const after = fix(before)
      if (after !== before) changes.push({ table, key, id: row.id, field, before, after })
    }
  }
}

const counts = {}
for (const c of changes) counts[`${c.table}.${c.field}`] = (counts[`${c.table}.${c.field}`] || 0) + 1
console.log(changes.length ? counts : 'Nothing to change.')

if (apply && changes.length) {
  const dir = path.resolve('server/data')
  fs.mkdirSync(dir, { recursive: true })
  const backup = path.join(dir, `db-text-backup-${Date.now()}.json`)
  fs.writeFileSync(backup, JSON.stringify(changes, null, 2))
  console.log(`Backup: ${backup}`)
  await db.beginTransaction()
  for (const c of changes) await db.query(`UPDATE ${c.table} SET ${c.field} = ? WHERE ${c.key} = ?`, [c.after, c.id])
  await db.commit()
  console.log(`Updated ${changes.length} fields.`)
} else if (changes.length) {
  console.log('Preview only. Add --apply to write.')
}
await db.end()
