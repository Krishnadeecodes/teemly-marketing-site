import { chromium } from 'playwright'

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
const page = await ctx.newPage()
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.click('.mobile-toggle')
await page.waitForTimeout(300)
await page.screenshot({ path: 'D:/teemly/scripts/shots/mobile-nav-open-viewport.png' })
await browser.close()
console.log('done')
