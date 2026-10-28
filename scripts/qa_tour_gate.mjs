// Checks the product tour on /take-a-tour: locked behind the sign-up popup
// until it is filled in, then a playlist — the product overview, then each
// module (play one, step through it, "Next"), and open straight away on
// return visits.
// The unlock request is mocked, so no lead is saved and no email is sent.
// Usage: node scripts/qa_tour_gate.mjs [baseUrl] [screenshotDir]
import { chromium } from 'playwright'

const BASE = process.argv[2] || 'http://localhost:3001'
const SHOTS = process.argv[3] || ''
const failures = []
const check = (ok, msg) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`)
  if (!ok) failures.push(msg)
}

const browser = await chromium.launch()

async function newPage(viewport) {
  const context = await browser.newContext({ viewport })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  let posted = null
  await page.route('**/api/tour/unlock', async (route) => {
    posted = route.request().postDataJSON()
    await route.fulfill({ json: { ok: true } })
  })
  return { context, page, errors, posted: () => posted }
}

async function fill(scope, email = 'jane@acme-corp.com') {
  await scope.locator('#name').fill('Jane Doe')
  await scope.locator('#email').fill(email)
  await scope.locator('#role').selectOption('HR')
}

const nowPlaying = (page) => page.locator('.tp-info h3').innerText()
const listed = (page) => page.locator('.tp-item-head > button').allInnerTexts()

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const label = `${viewport.width}px`
  const { context, page, errors, posted } = await newPage(viewport)

  // ---- locked ----
  await page.goto(BASE + '/')
  const tourButton = viewport.width > 900 ? page.locator('header a[href="/take-a-tour"]').first() : page.locator('main a[href="/take-a-tour"]').first()
  await tourButton.click()
  await page.waitForURL('**/take-a-tour')
  check(true, `${label}: "Take a Tour" goes to the tour page`)
  const form = page.locator('#tour-gate')
  await form.waitFor()
  check(await page.locator('.tg-dialog').isVisible(), `${label}: sign-up popup opens over the tour`)
  check(await page.locator('.tp.is-locked .tp-frame').isVisible(), `${label}: the tour shows, locked, behind the popup`)
  check((await listed(page)).join('|') === 'Product Overview|Dashboard|Teams|Screenshot Intelligence|Attendance|Intelligence Reports|Settings & Controls', `${label}: the playlist is the overview, then all 6 modules`)
  check(await page.evaluate(() => document.querySelector('.tp').inert === true), `${label}: the tour can't be used while locked`)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  check(overflow <= 0, `${label}: no horizontal scroll (${overflow}px)`)
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/tour-locked-${viewport.width}.png` })

  check(await page.evaluate(() => !!document.activeElement?.closest('#tour-gate')), `${label}: focus starts in the form`)

  await page.waitForTimeout(1600) // the server drops forms filled faster than a person could
  await form.locator('button[type=submit]').click()
  check((await form.locator('.field-error').count()) === 3, `${label}: empty submit shows the three field errors`)
  await fill(form, 'jane@gmail.com')
  await form.locator('button[type=submit]').click()
  check(/work email/i.test(await page.locator('#email-error').innerText()), `${label}: personal email is refused`)
  await form.locator('#email').fill('jane@acme-corp.com')
  await form.locator('button[type=submit]').click()

  // ---- unlocked: the playlist ----
  await page.locator('.tg-backdrop').waitFor({ state: 'detached', timeout: 5000 }).catch(() => {})
  check((await page.locator('.tg-backdrop').count()) === 0, `${label}: popup closes after sign-up`)
  check((await page.locator('.tp.is-locked').count()) === 0, `${label}: the tour unlocks after sign-up`)
  check(posted()?.email === 'jane@acme-corp.com' && posted()?.role === 'HR', `${label}: sign-in details are sent to the server`)
  check((await nowPlaying(page)) === 'Product Overview', `${label}: the product overview plays first`)
  check(/Step 1 of 10/i.test(await page.locator('.tp-step-text [aria-live] .tp-step-meta').innerText()), `${label}: the overview walks through 10 steps`)

  await page.locator('.tp-actions button', { hasText: 'Next' }).click()
  check((await nowPlaying(page)) === 'Dashboard', `${label}: "Next" plays the next entry (Dashboard)`)
  check((await page.locator('.tp-item.on').innerText()).includes('Dashboard'), `${label}: the entry playing is highlighted in the list`)

  await page.locator('.tp-item-head > button', { hasText: 'Intelligence Reports' }).click()
  check((await nowPlaying(page)) === 'Intelligence Reports', `${label}: clicking a module in the list plays it`)
  check(/Step 1 of 3/i.test(await page.locator('.tp-step-text [aria-live] .tp-step-meta').innerText()), `${label}: the module starts at step 1`)
  await page.locator('.tp-round.primary').click()
  check(/Step 2 of 3/i.test(await page.locator('.tp-step-text [aria-live] .tp-step-meta').innerText()), `${label}: the arrow moves to the next step`)
  check(new URL(page.url()).searchParams.get('module') === 'reports', `${label}: the address follows the module playing`)
  if (SHOTS) await page.locator('.tp').screenshot({ path: `${SHOTS}/tour-open-${viewport.width}.png` })

  // ---- return visit ----
  await page.goto(BASE + '/take-a-tour')
  await page.locator('.tp-frame').waitFor({ timeout: 5000 }).catch(() => {})
  check((await page.locator('.tg-backdrop').count()) === 0, `${label}: return visit opens the tour without the popup`)
  check(errors.length === 0, `${label}: no page errors${errors.length ? ': ' + errors.join(' | ') : ''}`)
  await context.close()
}

// ---- closing the popup leaves the tour page ----
{
  const { context, page } = await newPage({ width: 1440, height: 900 })
  await page.goto(BASE + '/')
  await page.locator('header a[href="/take-a-tour"]').first().click()
  await page.locator('.tg-dialog').waitFor()
  await page.locator('.tg-close').click()
  await page.waitForTimeout(500)
  check(new URL(page.url()).pathname === '/', 'closing the popup goes back to the previous page')
  await context.close()
}

await browser.close()
console.log(failures.length ? `\n${failures.length} check(s) failed` : '\nAll checks passed')
process.exit(failures.length ? 1 : 0)
