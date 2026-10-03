import { chromium } from 'playwright';

const pages = [
  '/pricing',
  '/platform',
  '/platform/organizational-intelligence',
  '/solutions',
  '/why-teemly',
  '/resources',
  '/security',
  '/trust-center',
  '/company/about',
  '/company/contact',
  '/support',
  '/customers',
  '/take-a-tour',
  '/book-a-demo',
  '/roi-calculator',
  '/industries',
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
    await page.waitForTimeout(700);
    const heroCheck = await page.evaluate(() => {
      const h1 = document.querySelector('.page-hero h1');
      const desc = document.querySelector('.page-hero-inner p');
      return {
        h1Text: h1 ? h1.textContent.slice(0, 60) : 'MISSING',
        h1Opacity: h1 ? getComputedStyle(h1).opacity : 'N/A',
        descOpacity: desc ? getComputedStyle(desc).opacity : 'N/A',
      };
    });
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    const cw = await page.evaluate(() => document.documentElement.clientWidth);
    results[path] = { ok: true, consoleErrors, heroCheck, overflow: sw > cw + 2 };
  } catch (e) {
    results[path] = { ok: false, error: e.message };
  }
  await page.close();
}

console.log(JSON.stringify(results, null, 2));
await browser.close();
