import { chromium } from 'playwright'

const browser = await chromium.launch()
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
const errors = []
page.on('pageerror', (e) => errors.push(String(e)))
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })

for (const route of ['/', '/product', '/pricing', '/security', '/about', '/contact']) {
  await page.goto(`http://localhost:5173${route}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(200)

  // Product dropdown: click to open
  await page.click('button:has-text("Product")')
  await page.waitForTimeout(200)
  const productOpen = await page.isVisible('.mega-panel')
  // click a link inside it
  let navigated = false
  try {
    await page.click('text=Dashboard & Insights', { timeout: 2000 })
    await page.waitForTimeout(200)
    navigated = page.url().includes('/product#dashboard')
  } catch (e) {
    navigated = `FAILED: ${e.message}`
  }
  console.log(`[${route}] Product dropdown open=${productOpen} clickWorked=${navigated}`)

  // go back, test Company dropdown + outside click closes it
  await page.goto(`http://localhost:5173${route}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(200)
  await page.click('button:has-text("Company")')
  await page.waitForTimeout(200)
  const companyOpen = await page.isVisible('.mega-panel')
  await page.mouse.click(50, 500)
  await page.waitForTimeout(200)
  const companyClosedAfterOutsideClick = !(await page.isVisible('.mega-panel'))
  console.log(`[${route}] Company dropdown open=${companyOpen} closesOnOutsideClick=${companyClosedAfterOutsideClick}`)
}

console.log('console errors total:', errors.length, errors.slice(0, 15))
await browser.close()
