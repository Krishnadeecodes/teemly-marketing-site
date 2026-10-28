// Checks the chat assistant: the first question is answered only after a
// quick sign-in (name and email), later ones straight away; visitors signed
// in for the tour are never asked; and scrolling inside the chat never
// scrolls the page.
// The sign-in request is mocked, so no lead is saved and no email is sent.
// Usage: node scripts/qa_chat_gate.mjs [baseUrl] [screenshotDir]
import { chromium } from 'playwright'

const BASE = process.argv[2] || 'http://localhost:3001'
const SHOTS = process.argv[3] || ''
const failures = []
const check = (ok, msg) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`)
  if (!ok) failures.push(msg)
}

const browser = await chromium.launch()

async function newPage(viewport, signedIn = false, path = '/pricing') {
  const context = await browser.newContext({ viewport })
  if (signedIn) await context.addInitScript(() => localStorage.setItem('teemly_tour_unlocked', JSON.stringify({ at: Date.now() })))
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  let posted = null
  await page.route('**/api/tour/unlock', async (route) => {
    posted = route.request().postDataJSON()
    await route.fulfill({ json: { ok: true } })
  })
  await page.goto(BASE + path, { waitUntil: 'networkidle' })
  // the chat button appears once the page is idle
  await page.locator('.chatbot-fab').waitFor({ timeout: 10000 })
  await page.locator('.chatbot-fab').click()
  await page.locator('.chatbot-panel').waitFor()
  return { context, page, errors, posted: () => posted }
}

async function ask(page, text) {
  await page.locator('.chatbot-input input').fill(text)
  await page.locator('.chatbot-input button[type=submit]').click()
  await page.waitForTimeout(900)
}

const botTexts = (page) => page.locator('.chatbot-msg.bot:not(.chatbot-gate) .chatbot-bubble').allInnerTexts()

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  const label = `${viewport.width}px`
  const { context, page, errors, posted } = await newPage(viewport)
  const before = (await botTexts(page)).length

  await ask(page, 'How much does Professional cost?')
  const gate = page.locator('.chatbot-gate')
  check(await gate.isVisible(), `${label}: asking a question shows the sign-in`)
  check((await botTexts(page)).length === before, `${label}: no answer before signing in`)
  check(await page.locator('.chatbot-input input').isDisabled(), `${label}: the question box waits while signing in`)
  if (SHOTS) await page.locator('.chatbot-panel').screenshot({ path: `${SHOTS}/chat-gate-${viewport.width}.png` })

  await page.waitForTimeout(1600) // the server drops forms filled faster than a person could
  check((await gate.locator('input:not([tabindex="-1"])').count()) === 2, `${label}: the chat asks only for a name and email`)
  await gate.locator('button[type=submit]').click()
  check((await gate.locator('.field-error').count()) === 2, `${label}: empty submit shows both field errors`)
  await gate.locator('#name').fill('Jane Doe')
  await gate.locator('#email').fill('jane@gmail.com')
  await gate.locator('button[type=submit]').click()
  check(/work email/i.test(await page.locator('#email-error').innerText()), `${label}: personal email is refused`)
  await gate.locator('#email').fill('jane@acme-corp.com')
  await gate.locator('button[type=submit]').click()
  await page.waitForTimeout(600)

  check((await page.locator('.chatbot-gate').count()) === 0, `${label}: the sign-in goes away after signing in`)
  const answers = await botTexts(page)
  check(answers.length >= before + 2 && /signed in/i.test(answers[answers.length - 2]), `${label}: the answer arrives after signing in`)
  check(posted()?.form === 'chat' && posted()?.source === 'chatbot' && posted()?.question === 'How much does Professional cost?', `${label}: the sign-in is sent with the source and the question`)
  check(await page.evaluate(() => !localStorage.getItem('teemly_tour_unlocked')), `${label}: the chat sign-in does not unlock the tour (it needs the full form)`)

  const n = (await botTexts(page)).length
  await ask(page, 'Is there a free trial?')
  check((await botTexts(page)).length === n + 1 && (await page.locator('.chatbot-gate').count()) === 0, `${label}: later questions are answered straight away`)
  if (SHOTS) await page.locator('.chatbot-panel').screenshot({ path: `${SHOTS}/chat-after-${viewport.width}.png` })
  check(errors.length === 0, `${label}: no page errors${errors.length ? ': ' + errors.join(' | ') : ''}`)
  await context.close()
}

// already signed in (e.g. on the tour): never asked
{
  const { context, page } = await newPage({ width: 1440, height: 900 }, true)
  const before = (await botTexts(page)).length
  await ask(page, 'How much does Professional cost?')
  check((await page.locator('.chatbot-gate').count()) === 0 && (await botTexts(page)).length === before + 1, 'signed-in visitors get answers without being asked')
  await context.close()
}

// scrolling inside the chat moves the messages, not the page (home page,
// where smooth scrolling runs)
{
  const { context, page } = await newPage({ width: 1440, height: 900 }, true, '/')
  for (const q of ['How much does it cost?', 'Is there a free trial?', 'How does the desktop agent work?']) await ask(page, q)
  const list = page.locator('.chatbot-messages')
  await list.evaluate((el) => (el.scrollTop = 0))
  const before = await page.evaluate(() => ({ page: window.scrollY, list: document.querySelector('.chatbot-messages').scrollTop }))
  const box = await list.boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.wheel(0, 400)
  await page.waitForTimeout(800)
  const after = await page.evaluate(() => ({ page: window.scrollY, list: document.querySelector('.chatbot-messages').scrollTop }))
  check(after.list > before.list, `wheel over the chat scrolls the messages (${before.list} → ${after.list})`)
  check(after.page === before.page, `wheel over the chat leaves the page still (${before.page} → ${after.page})`)
  await context.close()
}

await browser.close()
console.log(failures.length ? `\n${failures.length} check(s) failed` : '\nAll checks passed')
process.exit(failures.length ? 1 : 0)
