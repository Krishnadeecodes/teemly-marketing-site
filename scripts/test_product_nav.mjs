import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })

await page.goto('http://localhost:5173/product', { waitUntil: 'networkidle' })
await page.waitForTimeout(300)

// try hover on Product nav
await page.hover('text=Product')
await page.waitForTimeout(300)
await page.screenshot({ path: 'D:/teemly/scripts/shots/product-page-nav-hover.png' })

// check if mega-panel is visible / try clicking a link inside it
const megaVisible = await page.isVisible('.mega-panel')
console.log('mega panel visible on /product:', megaVisible)

if (megaVisible) {
  try {
    await page.click('text=Dashboard & Insights', { timeout: 3000 })
    console.log('click succeeded')
    await page.waitForTimeout(300)
    console.log('url after click:', page.url())
  } catch (e) {
    console.log('click FAILED:', e.message)
  }
}

// check z-index / bounding boxes of header vs module-nav-strip
const headerBox = await page.evaluate(() => {
  const h = document.querySelector('.site-header')
  const r = h.getBoundingClientRect()
  const cs = getComputedStyle(h)
  return { top: r.top, bottom: r.bottom, zIndex: cs.zIndex, position: cs.position }
})
console.log('header box:', headerBox)

const stripBox = await page.evaluate(() => {
  const s = document.querySelector('.module-nav-strip')
  if (!s) return null
  const r = s.getBoundingClientRect()
  const cs = getComputedStyle(s.closest('section'))
  return { top: r.top, bottom: r.bottom, zIndex: cs.zIndex, position: cs.position }
})
console.log('module-nav-strip section box:', stripBox)

console.log('console errors:', errors)

await browser.close()
