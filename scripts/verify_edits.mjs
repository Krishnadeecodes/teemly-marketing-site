import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })

const routes = ['/', '/about', '/contact', '/product', '/product/dashboard', '/product/teams']
for (const r of routes) {
  await page.goto(`http://localhost:5173${r}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(150)
  const bodyText = await page.evaluate(() => document.body.innerText)
  const hasDeecodes = bodyText.includes('Deecodes')
  const hasModuleNum = /Module\s*0\d/.test(bodyText)
  console.log(`[${r}] Deecodes present=${hasDeecodes}  ModuleNumber present=${hasModuleNum}`)
}

await page.goto('http://localhost:5173/about', { waitUntil: 'networkidle' })
await page.screenshot({ path: 'D:/teemly/scripts/shots/about-updated.png', fullPage: true })

await page.goto('http://localhost:5173/product/dashboard', { waitUntil: 'networkidle' })
await page.screenshot({ path: 'D:/teemly/scripts/shots/module-dashboard-updated.png', fullPage: true })

console.log('console errors:', errors)
await browser.close()
