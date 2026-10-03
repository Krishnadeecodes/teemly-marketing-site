import { chromium } from 'playwright';

const URL = 'http://localhost:5180/';
const shotsDir = 'C:\\Users\\DELL\\AppData\\Local\\Temp\\claude\\C--Users-DELL\\ba125211-2a3d-4430-8008-92aa76da9d37\\scratchpad';

function isDark(rgb) {
  // rgb(r,g,b) or rgba(r,g,b,a)
  const m = rgb.match(/rgba?\(([^)]+)\)/);
  if (!m) return false;
  const parts = m[1].split(',').map((s) => parseFloat(s.trim()));
  const [r, g, b, a] = parts;
  if (a === 0) return false;
  // "dark navy" heuristic: low luminance AND blue-dominant/neutral-dark (the old --h-bg family: #050b2e,#070f3a,#0b1445,#101b57)
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum < 40 && b >= r; // very dark and not a warm dark (ink text #0B1442 on text elements is fine, we filter by area below)
}

const results = { consoleErrors: [], darkBgElements: [], overflow: null, sections: {} };

const browser = await chromium.launch();

// ---- Desktop pass ----
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('console', (msg) => {
    if (msg.type() === 'error') results.consoleErrors.push(`[desktop] ${msg.text()}`);
  });
  page.on('pageerror', (err) => results.consoleErrors.push(`[desktop pageerror] ${err.message}`));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Scroll through the whole page slowly to trigger reveals, check background colors of large elements
  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < scrollHeight; y += 400) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(500);

  // Check every element with a sizeable box for dark-navy backgrounds
  const darkEls = await page.evaluate(() => {
    const out = [];
    const all = document.querySelectorAll('.home-v2 *');
    for (const el of all) {
      const rect = el.getBoundingClientRect();
      if (rect.width < 80 || rect.height < 40) continue;
      const bg = getComputedStyle(el).backgroundColor;
      const m = bg.match(/rgba?\(([^)]+)\)/);
      if (!m) continue;
      const parts = m[1].split(',').map((s) => parseFloat(s.trim()));
      const [r, g, b, a] = parts;
      if (a === 0 || isNaN(a) && parts.length === 3 ? false : (a !== undefined && a === 0)) continue;
      const alpha = parts.length === 4 ? parts[3] : 1;
      if (alpha === 0) continue;
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (lum < 45) {
        out.push({
          tag: el.tagName,
          cls: el.className?.toString().slice(0, 80),
          bg,
          w: Math.round(rect.width),
          h: Math.round(rect.height),
        });
      }
    }
    return out;
  });
  results.darkBgElements = darkEls;

  // Section presence check
  results.sections.trust = await page.evaluate(() => !!document.querySelector('.trust-band, [class*="trust"]'));
  results.sections.pricing = await page.evaluate(() => !!document.querySelector('[class*="pricing"]'));
  results.sections.resources = await page.evaluate(() => !!document.querySelector('[class*="resource"]'));
  results.sections.finalCta = await page.evaluate(() => !!document.querySelector('[class*="final-cta"], [class*="finalCta"], [class*="h-cta"]'));

  await page.screenshot({ path: `${shotsDir}\\verify-desktop-full.png`, fullPage: true });
  await page.close();
}

// ---- Mobile pass (390px) ----
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  page.on('console', (msg) => {
    if (msg.type() === 'error') results.consoleErrors.push(`[mobile] ${msg.text()}`);
  });
  page.on('pageerror', (err) => results.consoleErrors.push(`[mobile pageerror] ${err.message}`));

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
  const overflowOffenders = [];
  for (let y = 0; y < scrollHeight; y += 300) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(80);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    const cw = await page.evaluate(() => document.documentElement.clientWidth);
    if (sw > cw + 2) {
      const culprits = await page.evaluate((viewportWidth) => {
        const found = [];
        document.querySelectorAll('.home-v2 *').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.right > viewportWidth + 2 || r.left < -2) {
            found.push({ tag: el.tagName, cls: el.className?.toString().slice(0, 60), right: Math.round(r.right), left: Math.round(r.left) });
          }
        });
        return found.slice(0, 10);
      }, 390);
      overflowOffenders.push({ y, scrollWidth: sw, clientWidth: cw, culprits });
    }
  }
  results.overflow = overflowOffenders;

  await page.screenshot({ path: `${shotsDir}\\verify-mobile-full.png`, fullPage: true });
  await page.close();
}

await browser.close();

console.log(JSON.stringify(results, null, 2));
