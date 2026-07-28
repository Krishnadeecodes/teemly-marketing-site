import { chromium } from 'playwright'

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1200 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/product', { waitUntil: 'networkidle' })
await page.waitForTimeout(300)

const frames = await page.$$('.mock-frame')
console.log('found frames:', frames.length)
for (let i = 0; i < frames.length; i++) {
  await frames[i].scrollIntoViewIfNeeded()
  await page.waitForTimeout(100)
  await frames[i].screenshot({ path: `D:/teemly/scripts/shots/mock-${i}.png` })
}

await browser.close()
console.log('done')
