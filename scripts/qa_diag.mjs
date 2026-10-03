import { chromium } from 'playwright'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()
const logs = []
page.on('pageerror', (e) => logs.push('PAGEERROR: ' + String(e)))
page.on('console', (m) => logs.push(m.type().toUpperCase() + ': ' + m.text()))
await page.goto('http://localhost:5173/', { waitUntil: 'load' })
await page.waitForTimeout(1500)

const info = await page.evaluate(() => {
  const track = document.querySelector('.h-track')
  const pins = document.querySelectorAll('.gsap-pin, [style*="pin-spacer"]')
  return {
    scrollHeight: document.documentElement.scrollHeight,
    trackScrollWidth: track ? track.scrollWidth : null,
    trackClientWidth: track ? track.clientWidth : null,
    windowInnerWidth: window.innerWidth,
    pinSpacerCount: document.querySelectorAll('.pin-spacer').length,
    bodyHTMLLength: document.body.innerHTML.length,
  }
})
console.log('INFO', JSON.stringify(info, null, 2))
console.log('LOGS:', JSON.stringify(logs, null, 2))
await browser.close()
