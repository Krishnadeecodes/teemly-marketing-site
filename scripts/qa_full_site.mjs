import { chromium } from 'playwright'
import fs from 'node:fs'

const outDir = 'D:/teemly/scripts/shots'
fs.mkdirSync(outDir, { recursive: true })

const routes = [
  '/',
  '/platform', '/platform/organizational-intelligence', '/platform/workforce-intelligence',
  '/platform/work-intelligence', '/platform/workflow-intelligence', '/platform/ai-intelligence',
  '/platform/data-platform', '/platform/integrations', '/platform/architecture',
  '/solutions', '/solutions/executives', '/solutions/hr', '/solutions/managers', '/solutions/operations',
  '/solutions/it', '/solutions/finance', '/solutions/productivity', '/solutions/workforce',
  '/solutions/workflow', '/solutions/ai', '/solutions/employee-experience',
  '/industries', '/industries/technology', '/industries/financial-services', '/industries/healthcare',
  '/industries/manufacturing', '/industries/professional-services', '/industries/enterprise',
  '/why-teemly', '/why-teemly/problem', '/why-teemly/difference', '/why-teemly/business-impact', '/why-teemly/roi',
  '/roi-calculator', '/take-a-tour', '/book-a-demo',
  '/product', '/product/dashboard', '/product/teams', '/product/screenshots', '/product/video-recording',
  '/product/location-tracking', '/product/attendance', '/product/reports', '/product/settings',
  '/pricing',
  '/security', '/security/data-privacy', '/security/encryption', '/security/access-control',
  '/security/governance', '/security/compliance', '/security/infrastructure', '/security/ai-security',
  '/trust-center',
  '/resources', '/resources/research', '/resources/reports', '/resources/guides', '/resources/case-studies',
  '/resources/blog', '/resources/webinars', '/resources/videos', '/resources/glossary',
  '/customers',
  '/company/about', '/company/contact', '/company/careers', '/company/partners', '/company/news',
  '/about', '/contact',
  '/support',
  '/legal/privacy', '/legal/terms', '/legal/cookie-policy', '/legal/dpa', '/legal/acceptable-use',
  '/this-route-does-not-exist',
]

const browser = await chromium.launch()
const errors = []
const results = []

let ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
let page = await ctx.newPage()
page.on('pageerror', (e) => errors.push(`PAGEERROR ${page.url()}: ${e}`))
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`CONSOLE ${page.url()}: ${msg.text()}`)
})

for (let i = 0; i < routes.length; i++) {
  const route = routes[i]
  // Recycle the context every 10 navigations to avoid piling up Vite HMR websocket connections.
  if (i > 0 && i % 10 === 0) {
    await ctx.close()
    ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } })
    page = await ctx.newPage()
    page.on('pageerror', (e) => errors.push(`PAGEERROR ${page.url()}: ${e}`))
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(`CONSOLE ${page.url()}: ${msg.text()}`)
    })
  }
  const resp = await page.goto(`http://localhost:5173${route}`, { waitUntil: 'load', timeout: 15000 }).catch((e) => {
    errors.push(`NAV FAILED ${route}: ${e.message}`)
    return null
  })
  await page.waitForTimeout(150)
  const status = resp ? resp.status() : 'NO_RESPONSE'
  const finalUrl = page.url()
  const title = await page.title().catch(() => '')
  results.push({ route, status, finalUrl, title })
}

await ctx.close()
await browser.close()

console.log('--- ROUTE RESULTS ---')
for (const r of results) {
  const flag = r.status !== 200 ? ' <<< NON-200' : ''
  console.log(`${r.route} -> ${r.status}${flag}`)
}

console.log('\n--- ERRORS ---')
if (errors.length === 0) {
  console.log('none')
} else {
  errors.forEach((e) => console.log(e))
}
console.log(`\nTotal routes checked: ${results.length}`)
console.log(`Total errors: ${errors.length}`)
