import { chromium } from 'playwright';

const pages = [
  '/', '/company/about', '/company/careers', '/company/news', '/company/partners',
  '/customers', '/industries', '/industries/technology', '/legal/privacy',
  '/product', '/platform', '/platform/organizational-intelligence',
  '/pricing', '/resources', '/roi-calculator', '/security', '/security/data-privacy',
  '/solutions', '/support', '/take-a-tour', '/trust-center', '/why-teemly',
];

const browser = await chromium.launch();
const results = {};

for (const path of pages) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push(e.message));
  try {
    await page.goto(`http://localhost:5180${path}`, { waitUntil: 'networkidle', timeout: 15000 });
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 400) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(40);
    }
    await page.waitForTimeout(500);
    const check = await page.evaluate(() => {
      const btn = document.querySelector('.h-final-ctas .h-btn-primary');
      const fb = document.querySelector('.foot-big');
      return {
        hasFinalCta: !!btn,
        finalBtnBg: btn ? getComputedStyle(btn).backgroundColor : null,
        finalBtnPadding: btn ? getComputedStyle(btn).padding : null,
        footBigOpacity: fb ? getComputedStyle(fb).opacity : 'MISSING',
      };
    });
    results[path] = { ok: true, consoleErrors, ...check };
  } catch (e) {
    results[path] = { ok: false, error: e.message };
  }
  await page.close();
}

console.log(JSON.stringify(results, null, 2));
await browser.close();
