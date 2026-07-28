import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })

const slugs = ['dashboard', 'teams', 'screenshots', 'attendance', 'reports', 'settings']
for (const slug of slugs) {
  await page.goto(`http://localhost:5173/product/${slug}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(200)
  await page.screenshot({ path: `D:/teemly/scripts/shots/module-${slug}.png`, fullPage: true })
}

// verify a 404 fallback for unknown slug
await page.goto('http://localhost:5173/product/not-a-real-module', { waitUntil: 'networkidle' })
await page.waitForTimeout(200)
console.log('unknown slug redirected to:', page.url())

// verify header dropdown link navigates correctly
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.click('button:has-text("Product")')
await page.waitForTimeout(150)
await page.click('text=Screenshot Intelligence')
await page.waitForTimeout(300)
console.log('after clicking Screenshot Intelligence in menu, url =', page.url())

console.log('console errors:', errors)
await browser.close()
