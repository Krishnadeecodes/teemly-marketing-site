// Writes every static logo file from src/brand/logo.js, so there is only one
// source for the logo. Run after changing the logo: `npm run brand`.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { logoSvg } from '../src/brand/logo.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = (...p) => path.join(root, 'public', ...p)
fs.mkdirSync(pub('brand'), { recursive: true })

const files = {
  'favicon.svg': logoSvg({ full: false }),
  'brand/teemly-mark.svg': logoSvg({ full: false }),
  'brand/teemly-logo.svg': logoSvg({ full: true }),
  'brand/teemly-logo-light.svg': logoSvg({ full: true, tone: 'light' }),
}
for (const [name, svg] of Object.entries(files)) fs.writeFileSync(pub(name), svg)

// PNGs for places that can't show SVG: email clients, social previews, iOS home screen.
const font = "'Bricolage Grotesque', 'Space Grotesk', system-ui, sans-serif"
const pngs = [
  // 2x size, cropped to the artwork (shown at 32px tall in emails)
  { name: 'brand/teemly-logo.png', w: 679, h: 200, html: logoSvg().replace('<svg ', '<svg style="display:block;height:200px;width:auto" '), transparent: true },
  { name: 'brand/apple-touch-icon.png', w: 180, h: 180, html: `<div style="display:grid;place-items:center;height:100%;background:#fff">${logoSvg({ full: false }).replace('<svg ', '<svg style="height:132px;width:auto" ')}</div>` },
  {
    name: 'brand/og-image.png',
    w: 1200,
    h: 630,
    html: `<div style="height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:36px;background:#fff;position:relative;font-family:${font}">
      <div style="position:absolute;inset:0 0 auto;height:10px;background:linear-gradient(90deg,#0187E0,#07D7D9 35%,#6A3BD8 62%,#F62DA0 82%,#E91E63)"></div>
      ${logoSvg().replace('<svg ', '<svg style="height:150px;width:auto" ')}
      <div style="font-size:40px;font-weight:600;color:#0B1442;letter-spacing:-0.02em">Organizational Intelligence Platform</div>
    </div>`,
  },
]

const browser = await chromium.launch()
for (const p of pngs) {
  const page = await browser.newPage({ viewport: { width: p.w, height: p.h } })
  await page.setContent(
    `<html><head><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600&display=swap" rel="stylesheet"></head><body style="margin:0;width:${p.w}px;height:${p.h}px;background:transparent">${p.html}</body></html>`,
    { waitUntil: 'networkidle' },
  )
  await page.screenshot({ path: pub(p.name), omitBackground: !!p.transparent })
  await page.close()
}
await browser.close()
console.log('Wrote', [...Object.keys(files), ...pngs.map((p) => p.name)].join(', '))
