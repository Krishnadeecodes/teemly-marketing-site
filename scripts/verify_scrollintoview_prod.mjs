import { chromium } from 'playwright';

const URL = 'http://localhost:5181/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

async function checkAfterScrollTo(sel) {
  await page.evaluate((s) => {
    document.querySelector(s)?.scrollIntoView({ block: 'center' });
  }, sel);
  await page.waitForTimeout(1200);
  return page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return 'MISSING';
    const r = el.getBoundingClientRect();
    return { opacity: getComputedStyle(el).opacity, top: Math.round(r.top), bottom: Math.round(r.bottom), viewportH: window.innerHeight, scrollY: Math.round(window.scrollY) };
  }, sel);
}

const out = {};
out.solutionsRail = await checkAfterScrollTo('.h-sol-rail');
out.solutionsCard0 = await checkAfterScrollTo('.h-sol-card');
out.outcomesSection = await checkAfterScrollTo('.h-outcomes');
out.outcomesCard = await checkAfterScrollTo('.h-oc');
out.explorerCard = await checkAfterScrollTo('.h-explorer-card');
out.integOrbit = await checkAfterScrollTo('.h-orbit');
out.footBig = await checkAfterScrollTo('.foot-big');

console.log(JSON.stringify(out, null, 2));
await browser.close();
