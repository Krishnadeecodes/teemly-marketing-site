import { chromium } from 'playwright'
const browser = await chromium.launch()
for (const vp of [{ n: 'desktop', w: 1440, h: 1200 }, { n: 'mobile', w: 390, h: 1200 }]) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h } })
  const page = await ctx.newPage()
  await page.goto('http://localhost:5173/', { waitUntil: 'load' })
  await page.waitForTimeout(500)
  await page.screenshot({ path: `D:/teemly/scripts/shots/light-${vp.n}-top.png` })
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel(0, 400)
    await page.waitForTimeout(80)
  }
  await page.waitForTimeout(500)
  await page.screenshot({ path: `D:/teemly/scripts/shots/light-${vp.n}-mid.png` })
  for (let i = 0; i < 60; i++) {
    await page.mouse.wheel(0, 500)
    await page.waitForTimeout(60)
  }
  await page.waitForTimeout(600)
  await page.screenshot({ path: `D:/teemly/scripts/shots/light-${vp.n}-bottom.png` })
}
await browser.close()
console.log('done')
