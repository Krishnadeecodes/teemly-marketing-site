import { chromium } from 'playwright'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e)))
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text()) })
await page.goto('http://localhost:5173/', { waitUntil: 'load' })
await page.waitForTimeout(1000)

// Scroll down gradually via mouse wheel so Lenis/ScrollTrigger pins engage naturally
for (let i = 0; i < 40; i++) {
  await page.mouse.wheel(0, 250)
  await page.waitForTimeout(80)
}
await page.waitForTimeout(500)
await page.screenshot({ path: 'D:/teemly/scripts/shots/v2-model.png' })

for (let i = 0; i < 40; i++) {
  await page.mouse.wheel(0, 250)
  await page.waitForTimeout(80)
}
await page.waitForTimeout(500)
await page.screenshot({ path: 'D:/teemly/scripts/shots/v2-platform.png' })

console.log('errors:', JSON.stringify(errors, null, 2))
await browser.close()
