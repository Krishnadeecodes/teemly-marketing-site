import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 969 } });
await page.goto('http://localhost:5180/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

// --- TeemlyModel panel inspection ---
const modelTop = await page.evaluate(() => document.querySelector('.h-model').getBoundingClientRect().top + window.scrollY);
let y = 0;
while (y < modelTop + 400) {
  await page.mouse.wheel(0, 200);
  y += 200;
  await page.waitForTimeout(25);
}
await page.waitForTimeout(600);

const panelDiag = await page.evaluate(() => {
  const panels = Array.from(document.querySelectorAll('.h-panel'));
  return panels.map((p) => {
    const r = p.getBoundingClientRect();
    const desc = p.querySelector('p');
    const viz = p.querySelector('.h-panel-viz');
    const h3 = p.querySelector('h3');
    return {
      panelRect: { top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), w: Math.round(r.width) },
      panelComputedHeight: getComputedStyle(p).height,
      panelDisplay: getComputedStyle(p).display,
      h3Text: h3 ? h3.textContent : 'MISSING',
      descText: desc ? desc.textContent.slice(0, 40) : 'MISSING',
      descColor: desc ? getComputedStyle(desc).color : 'MISSING',
      descDisplay: desc ? getComputedStyle(desc).display : 'MISSING',
      vizExists: !!viz,
      vizRect: viz ? (() => { const vr = viz.getBoundingClientRect(); return { h: Math.round(vr.height), w: Math.round(vr.width) }; })() : null,
      vizBg: viz ? getComputedStyle(viz).background : 'MISSING',
    };
  });
});
const modelHeadRect = await page.evaluate(() => {
  const head = document.querySelector('.h-model-head');
  const r = head.getBoundingClientRect();
  return { top: Math.round(r.top), bottom: Math.round(r.bottom) };
});
const trackRect = await page.evaluate(() => {
  const t = document.querySelector('.h-track');
  const r = t.getBoundingClientRect();
  return { top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height) };
});
const sectionRect = await page.evaluate(() => {
  const s = document.querySelector('.h-model');
  const r = s.getBoundingClientRect();
  return { top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), position: getComputedStyle(s).position };
});

console.log('MODEL HEAD RECT', JSON.stringify(modelHeadRect));
console.log('TRACK RECT', JSON.stringify(trackRect));
console.log('SECTION RECT', JSON.stringify(sectionRect));
console.log('PANEL DIAG', JSON.stringify(panelDiag, null, 2));

await page.screenshot({ path: 'scripts/shots/diag-model-live.png' });

// --- TeemlyAI bars inspection ---
const colorVars = await page.evaluate(() => {
  const cs = getComputedStyle(document.querySelector('.home-v2'));
  return {
    hBg: cs.getPropertyValue('--h-bg'),
    hBgAlt: cs.getPropertyValue('--h-bg-alt'),
    hSurface: cs.getPropertyValue('--h-surface'),
    hSurfaceRaised: cs.getPropertyValue('--h-surface-raised'),
    hLine: cs.getPropertyValue('--h-line'),
  };
});
console.log('COLOR VARS', JSON.stringify(colorVars));

const aiSection = await page.$('.h-ai');
await aiSection.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
// click the 3rd prompt to get bars with data
const buttons = await page.$$('.h-prompts button');
if (buttons[2]) await buttons[2].click();
await page.waitForTimeout(2200); // wait past typing+thinking so bars appear and animate

const barDiag = await page.evaluate(() => {
  const rows = Array.from(document.querySelectorAll('.h-bar-row'));
  const barsA = document.querySelector('.h-bars-a');
  const barsARect = barsA ? barsA.getBoundingClientRect() : null;
  return {
    barsAExists: !!barsA,
    barsARect: barsARect ? { h: Math.round(barsARect.height), top: Math.round(barsARect.top) } : null,
    barsAGap: barsA ? getComputedStyle(barsA).gap : 'MISSING',
    barsADisplay: barsA ? getComputedStyle(barsA).display : 'MISSING',
    rowCount: rows.length,
    rows: rows.map((row) => {
      const r = row.getBoundingClientRect();
      const track = row.querySelector('.h-track');
      const fill = row.querySelector('.h-fill');
      const tr = track ? track.getBoundingClientRect() : null;
      const fr = fill ? fill.getBoundingClientRect() : null;
      return {
        rowRect: { top: Math.round(r.top), h: Math.round(r.height) },
        rowGridTemplate: getComputedStyle(row).gridTemplateColumns,
        trackExists: !!track,
        trackRect: tr ? { h: Math.round(tr.height), w: Math.round(tr.width) } : null,
        trackBg: track ? getComputedStyle(track).backgroundColor : 'MISSING',
        fillWidth: fill ? getComputedStyle(fill).width : 'MISSING',
        fillInlineWidth: fill ? fill.style.width : 'MISSING',
        fillBg: fill ? getComputedStyle(fill).background.slice(0, 60) : 'MISSING',
      };
    }),
  };
});
console.log('BAR DIAG', JSON.stringify(barDiag, null, 2));
await page.screenshot({ path: 'scripts/shots/diag-ai-live.png' });

await browser.close();
