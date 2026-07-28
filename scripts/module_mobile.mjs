import { chromium } from 'playwright'
const browser = await chromium.launch()
const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage()
await page.goto('http://localhost:5173/product/reports', { waitUntil: 'networkidle' })
await page.waitForTimeout(200)
await page.screenshot({ path: 'D:/teemly/scripts/shots/module-reports-mobile.png', fullPage: true })
await browser.close()
console.log('done')
