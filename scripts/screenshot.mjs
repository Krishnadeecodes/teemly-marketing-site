import { chromium } from 'playwright'
import fs from 'node:fs'

const outDir = 'D:/teemly/scripts/shots'
fs.mkdirSync(outDir, { recursive: true })

const pages = ['/', '/product', '/pricing', '/security', '/about', '/contact']
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

const browser = await chromium.launch()

for (const vp of viewports) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })

  for (const route of pages) {
    const url = `http://localhost:5173${route}`
    await page.goto(url, { waitUntil: 'networkidle' })
    await page.waitForTimeout(300)
    const slug = route === '/' ? 'home' : route.replace('/', '')
    await page.screenshot({ path: `${outDir}/${vp.name}-${slug}.png`, fullPage: true })
    console.log(`shot: ${vp.name}-${slug}`)
  }
  await context.close()
  if (errors.length) {
    console.log(`Console errors on ${vp.name}:`, errors.slice(0, 10))
  }
}

// Header dropdown + mobile menu interaction check
const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const dpage = await dctx.newPage()
await dpage.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await dpage.hover('text=Product')
await dpage.waitForTimeout(250)
await dpage.screenshot({ path: `${outDir}/desktop-nav-dropdown.png` })
await dctx.close()

const mctx = await browser.newContext({ viewport: { width: 390, height: 844 } })
const mpage = await mctx.newPage()
await mpage.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await mpage.click('.mobile-toggle')
await mpage.waitForTimeout(250)
await mpage.screenshot({ path: `${outDir}/mobile-nav-open.png`, fullPage: true })
await mctx.close()

await browser.close()
console.log('done')
