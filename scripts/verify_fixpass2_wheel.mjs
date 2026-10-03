import { chromium } from 'playwright';

const URL = 'http://localhost:5180/';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const consoleErrors = [];
page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
page.on('pageerror', (err) => consoleErrors.push(err.message));

await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// Real wheel events, many small increments, so Lenis + ScrollTrigger get continuous updates.
const scrollHeight = await page.evaluate(() => document.body.scrollHeight);
let scrolled = 0;
while (scrolled < scrollHeight) {
  await page.mouse.wheel(0, 180);
  scrolled += 180;
  await page.waitForTimeout(40);
}
// settle + a bit of extra wheel to make sure Lenis eases to the bottom
for (let i = 0; i < 20; i++) {
  await page.mouse.wheel(0, 180);
  await page.waitForTimeout(40);
}
await page.waitForTimeout(800);

const check = await page.evaluate(() => {
  function opacityOf(sel) {
    const el = document.querySelector(sel);
    if (!el) return 'MISSING';
    return getComputedStyle(el).opacity;
  }
  return {
    solutionsCardOpacities: Array.from(document.querySelectorAll('.h-sol-card')).map((el) => getComputedStyle(el).opacity),
    outcomesCardOpacities: Array.from(document.querySelectorAll('.h-oc')).map((el) => getComputedStyle(el).opacity),
    explorerCardOpacity: opacityOf('.h-explorer-card'),
    integOrbitOpacity: opacityOf('.h-orbit'),
    footBigOpacity: opacityOf('.foot-big'),
    roiPillsOpacity: opacityOf('.h-roi-pills'),
    scrollY: window.scrollY,
    bodyScrollHeight: document.body.scrollHeight,
  };
});

console.log(JSON.stringify({ check, consoleErrors }, null, 2));
await browser.close();
