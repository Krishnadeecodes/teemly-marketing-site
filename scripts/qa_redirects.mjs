import { chromium } from 'playwright'
const browser = await chromium.launch()
const ctx = await browser.newContext()
const page = await ctx.newPage()
for (const route of ['/about', '/contact']) {
  await page.goto(`http://localhost:5173${route}`, { waitUntil: 'load' })
  await page.waitForTimeout(500)
  console.log(route, '->', page.url())
}
await ctx.close()
await browser.close()
