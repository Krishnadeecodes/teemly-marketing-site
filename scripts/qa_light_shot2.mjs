import { chromium } from 'playwright'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/', { waitUntil: 'load' })
await page.waitForTimeout(500)

const targets = ['.h-pricing', '.h-resources', '.h-roi', '.h-integ']
for (const sel of targets) {
  await page.evaluate((s) => {
    const el = document.querySelector(s)
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' })
  }, sel)
  // nudge with real wheel events so Lenis/ScrollTrigger settle and reveals fire
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, 10)
    await page.waitForTimeout(150)
  }
  await page.waitForTimeout(700)
  const slug = sel.replace(/[.\s]/g, '')
  await page.screenshot({ path: `D:/teemly/scripts/shots/light-check-${slug}.png` })
}
await browser.close()
console.log('done')
