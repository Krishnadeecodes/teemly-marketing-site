// Create (or reset the password of) an admin-panel account from the command line.
//   npm run admin:create -- --email you@company.com --name "Your Name" [--role admin|editor]
// You'll be prompted for the password (or pass ADMIN_PASSWORD in the environment).
import readline from 'node:readline'
import { ready, pool, one, query } from './db.js'
import { hashPassword, MIN_PASSWORD, ROLES } from './auth.js'
import { EMAIL_RE } from '../src/lib/leadForms.js'

function arg(name) {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    rl._writeToOutput = (s) => rl.output.write(s.includes(question) ? s : '')
    rl.question(question, (answer) => {
      rl.close()
      process.stdout.write('\n')
      resolve(answer)
    })
  })
}

const email = (arg('email') || '').trim().toLowerCase()
const name = (arg('name') || '').trim()
const role = arg('role') || 'admin'

if (!EMAIL_RE.test(email) || !ROLES.includes(role)) {
  console.error('Usage: npm run admin:create -- --email you@company.com --name "Your Name" [--role admin|editor]')
  process.exit(1)
}

const password = process.env.ADMIN_PASSWORD || (await askHidden(`Password for ${email} (min ${MIN_PASSWORD} chars): `))
if (password.length < MIN_PASSWORD) {
  console.error(`Password must be at least ${MIN_PASSWORD} characters.`)
  process.exit(1)
}

await ready
const hash = await hashPassword(password)
const existing = await one('SELECT id FROM users WHERE email = ?', [email])
if (existing) {
  await query("UPDATE users SET password_hash = ?, role = ?, active = 1, name = COALESCE(NULLIF(?, ''), name) WHERE id = ?", [hash, role, name, existing.id])
  await query('DELETE FROM sessions WHERE user_id = ?', [existing.id])
  console.log(`Updated ${email} (${role}) — password reset and re-activated.`)
} else {
  await query('INSERT INTO users (email, name, role, password_hash) VALUES (?, ?, ?, ?)', [email, name || email.split('@')[0], role, hash])
  console.log(`Created ${role} account for ${email}. Sign in at /admin.`)
}
await pool.end()
