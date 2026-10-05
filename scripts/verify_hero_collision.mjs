import { chromium } from 'playwright';

function overlap(a, b) {
  return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5180/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3200);

const rects = await page.evaluate(() => {
  const sel = (s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
  };
  return {
    hc1: sel('.h-hc1'),
    hc2: sel('.h-hc2'),
    live: sel('.h-hero-ai-live'),
    lastBarRow: Array.from(document.querySelectorAll('.h-hero-ai-bar-row')).map((el) => {
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom };
    }).pop(),
    illus: sel('.h-hero-ai-body .h-illus'),
    card: sel('.h-hero-ai-card'),
  };
});

const result = {
  hc2_overlaps_live: overlap(rects.hc2, rects.live),
  hc1_overlaps_lastBarRow: overlap(rects.hc1, rects.lastBarRow),
  hc1_overlaps_illus: overlap(rects.hc1, rects.illus),
  hc2_overlaps_card: overlap(rects.hc2, rects.card),
  hc1_overlaps_card: overlap(rects.hc1, rects.card),
  rects,
};
console.log(JSON.stringify(result, null, 2));
await page.screenshot({ path: 'scripts/shots/hero-redesign-desktop-v2.png' });
await browser.close();
