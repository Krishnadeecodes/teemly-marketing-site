import { chromium } from 'playwright'

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 500 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(300)
await page.screenshot({ path: 'D:/teemly/scripts/shots/header-top.png' })

await page.evaluate(() => window.scrollTo(0, 900))
await page.waitForTimeout(400)
await page.screenshot({ path: 'D:/teemly/scripts/shots/header-scrolled.png' })

await browser.close()
console.log('done')
