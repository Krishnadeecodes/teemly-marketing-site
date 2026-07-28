import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await (await browser.newContext({ viewport: { width: 1440, height: 700 } })).newPage()
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(200)
await page.screenshot({ path: 'D:/teemly/scripts/shots/particles-t0.png' })
await page.waitForTimeout(2500)
await page.screenshot({ path: 'D:/teemly/scripts/shots/particles-t1.png' })
await browser.close()
console.log('done')
