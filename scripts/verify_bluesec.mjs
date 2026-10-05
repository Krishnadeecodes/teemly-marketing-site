import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://localhost:5180/', { waitUntil: 'networkidle' });
await page.waitForTimeout(900);

// hero visual opacity immediately after load (StrictMode double-invoke bug check)
const heroVisual = await page.evaluate(() => {
  const el = document.querySelector('.h-hero-visual, [class*="h-hv"]');
  return el ? parseFloat(getComputedStyle(el).opacity) : null;
});

const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 300) { await page.evaluate((yy) => window.scrollTo(0, yy), y); await page.waitForTimeout(90); }
await page.waitForTimeout(500);

const heroVisualAfterScroll = await page.evaluate(() => {
  const el = document.querySelector('.h-hero-visual, [class*="h-hv"]');
  return el ? parseFloat(getComputedStyle(el).opacity) : null;
});

const blueSections = await page.evaluate(() => {
  const out = {};
  document.querySelectorAll('.h-sec-blue').forEach((sec) => {
    const bg = getComputedStyle(sec).backgroundImage || getComputedStyle(sec).backgroundColor;
    const whiteCards = Array.from(sec.querySelectorAll('.h-panel, .h-console, .h-policy, .h-trust-pr')).slice(0, 2);
    const cardInfo = whiteCards.map((c) => ({
      bg: getComputedStyle(c).backgroundColor,
      textColor: getComputedStyle(c.querySelector('h3,strong,b,p') || c).color,
    }));
    out[sec.className] = { sectionBg: bg.slice(0, 80), cards: cardInfo };
  });
  return out;
});

const footer = await page.evaluate(() => {
  const f = document.querySelector('footer');
  return f ? { bg: getComputedStyle(f).backgroundImage.slice(0, 100) || getComputedStyle(f).backgroundColor } : null;
});

// mobile overflow
const mpage = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mpage.goto('http://localhost:5180/', { waitUntil: 'networkidle' });
const mh = await mpage.evaluate(() => document.body.scrollHeight);
let overflow = false;
for (let y = 0; y < mh; y += 300) {
  await mpage.evaluate((yy) => window.scrollTo(0, yy), y);
  await mpage.waitForTimeout(60);
  const sw = await mpage.evaluate(() => document.documentElement.scrollWidth);
  const cw = await mpage.evaluate(() => document.documentElement.clientWidth);
  if (sw > cw + 2) overflow = true;
}
await mpage.screenshot({ path: 'D:/teemly/scripts/shots/bluesec-mobile.png', fullPage: true });
await mpage.close();

await page.screenshot({ path: 'D:/teemly/scripts/shots/bluesec-desktop.png', fullPage: true });
await browser.close();
console.log(JSON.stringify({ heroVisual, heroVisualAfterScroll, blueSections, footer, overflow, errors }, null, 2));
