import { chromium } from 'playwright'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/', { waitUntil: 'load' })
await page.waitForTimeout(400)

const targets = ['.h-pricing', '.h-trust', '.h-outcomes']
for (const sel of targets) {
  await page.evaluate((s) => {
    const el = document.querySelector(s)
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
  }, sel)
  await page.waitForTimeout(300)
  const slug = sel.replace(/[.\s]/g, '')
  await page.screenshot({ path: `D:/teemly/scripts/shots/reduced-${slug}.png` })
}
await browser.close()
console.log('done')
