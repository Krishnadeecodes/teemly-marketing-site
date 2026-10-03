import { chromium } from 'playwright';

const URL = 'http://localhost:5180/';
const shotsDir = 'D:\\teemly\\scripts\\shots';

const targets = [
  { name: 'SolutionsTeaser cards', sel: '.h-sol-card, [class*="sol-card"]' },
  { name: 'ProductExplorer panel', sel: '[class*="explorer"] [class*="panel"], [class*="h-ex-panel"]' },
  { name: 'TeemlyAISection console', sel: '.h-console' },
  { name: 'BusinessOutcomes cards', sel: '.h-oc' },
  { name: 'IntegrationsTeaser orbit', sel: '[class*="orbit"]' },
  { name: 'IntegrationsTeaser copy column', sel: '[class*="integ"] p, [class*="integrations"] p' },
  { name: 'Footer big wordmark', sel: '.foot-big' },
  { name: 'Trust cards', sel: '.trust-card' },
  { name: 'ROITeaser pills', sel: '[class*="h-pill"]' },
  { name: 'PlatformTeaser step body', sel: '[class*="h-step"]' },
  { name: 'ResourcesTeaser body', sel: 'section[class*="resource"] p, [class*="h-resource"] p' },
  { name: 'FinalCTA body', sel: '.h-final p, .h-final-inner p' },
  { name: 'TeemlyModel description', sel: '.h-model-note, [class*="model"] p' },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const consoleErrors = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);

// Scroll through the whole page slowly (real wheel-like increments) to let every ScrollTrigger fire
const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < scrollHeight; y += 250) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(120);
}
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(800);

const report = {};
for (const t of targets) {
  const res = await page.evaluate((sel) => {
    const els = Array.from(document.querySelectorAll(sel));
    if (els.length === 0) return { found: 0 };
    const opacities = els.slice(0, 6).map((el) => parseFloat(getComputedStyle(el).opacity));
    return { found: els.length, opacities, anyZero: opacities.some((o) => o < 0.05) };
  }, t.sel);
  report[t.name] = res;
}

// Click through 3 ProductExplorer tabs and confirm distinct content each time
let explorerTabsCheck = null;
try {
  const tabButtons = await page.$$('[class*="h-ex-tab"], [class*="explorer"] button');
  if (tabButtons.length >= 3) {
    const texts = [];
    for (let i = 0; i < 3; i++) {
      await tabButtons[i].click();
      await page.waitForTimeout(400);
      const bodyText = await page.evaluate(() => {
        const panel = document.querySelector('[class*="h-ex-panel"], [class*="explorer"] [class*="panel"]');
        return panel ? panel.innerText.slice(0, 80) : null;
      });
      texts.push(bodyText);
    }
    explorerTabsCheck = texts;
  } else {
    explorerTabsCheck = `only found ${tabButtons.length} tab buttons`;
  }
} catch (e) {
  explorerTabsCheck = 'error: ' + e.message;
}

// Reload hero 4x and capture geometry each time to confirm stability
const heroGeoms = [];
for (let i = 0; i < 4; i++) {
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const geom = await page.evaluate(() => {
    const canvas = document.querySelector('.h-hero canvas, [class*="particle"]');
    if (!canvas) return null;
    const r = canvas.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top), left: Math.round(r.left) };
  });
  heroGeoms.push(geom);
}

await page.screenshot({ path: `${shotsDir}\\independent-verify-desktop.png`, fullPage: true });
await page.close();

// Mobile overflow re-check
const mpage = await browser.newPage({ viewport: { width: 390, height: 844 } });
const mobileErrors = [];
mpage.on('console', (m) => { if (m.type() === 'error') mobileErrors.push(m.text()); });
await mpage.goto(URL, { waitUntil: 'networkidle' });
const sh = await mpage.evaluate(() => document.body.scrollHeight);
let overflowHit = false;
for (let y = 0; y < sh; y += 300) {
  await mpage.evaluate((yy) => window.scrollTo(0, yy), y);
  await mpage.waitForTimeout(60);
  const sw = await mpage.evaluate(() => document.documentElement.scrollWidth);
  const cw = await mpage.evaluate(() => document.documentElement.clientWidth);
  if (sw > cw + 2) overflowHit = true;
}
await mpage.screenshot({ path: `${shotsDir}\\independent-verify-mobile.png`, fullPage: true });
await mpage.close();

await browser.close();

console.log(JSON.stringify({ report, explorerTabsCheck, heroGeoms, consoleErrors, mobileErrors, mobileOverflow: overflowHit }, null, 2));
