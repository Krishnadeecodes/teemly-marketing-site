import { chromium } from 'playwright'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e)))
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()) })
await page.goto('http://localhost:5173/', { waitUntil: 'load' })
await page.waitForTimeout(1500)
await page.screenshot({ path: 'D:/teemly/scripts/shots/v2-top.png' })

for (const [name, y] of [['quickfacts', 950], ['problem-mid', 1600], ['problem-end', 2600]]) {
  await page.evaluate((py) => window.scrollTo(0, py), y)
  await page.waitForTimeout(600)
  await page.screenshot({ path: `D:/teemly/scripts/shots/v2-${name}.png` })
}
console.log('errors:', JSON.stringify(errors, null, 2))
await browser.close()
