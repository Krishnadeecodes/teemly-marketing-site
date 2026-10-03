import { chromium } from 'playwright'
import fs from 'node:fs'
const outDir = 'D:/teemly/scripts/shots'
fs.mkdirSync(outDir, { recursive: true })

const samples = [
  '/',
  '/platform',
  '/platform/architecture',
  '/solutions',
  '/solutions/hr',
  '/industries/healthcare',
  '/why-teemly/roi',
  '/roi-calculator',
  '/take-a-tour',
  '/book-a-demo',
  '/security',
  '/security/compliance',
  '/trust-center',
  '/resources',
  '/resources/glossary',
  '/customers',
  '/support',
  '/legal/privacy',
]

const browser = await chromium.launch()
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]

for (const vp of viewports) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
  const page = await ctx.newPage()
  for (const route of samples) {
    await page.goto(`http://localhost:5173${route}`, { waitUntil: 'load' })
    await page.waitForTimeout(250)
    const slug = route === '/' ? 'home' : route.replace(/\//g, '_').replace(/^_/, '')
    await page.screenshot({ path: `${outDir}/sample-${vp.name}-${slug}.png`, fullPage: true })
  }
  await ctx.close()
}
await browser.close()
console.log('done')
