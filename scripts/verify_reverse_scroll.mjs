import { chromium } from 'playwright';

const URL = 'http://localhost:5180/';
const browser = await chromium.launch();
const results = {};

// ---- Test 1: TeemlyAI section approached ONLY from below (never scrolled down through it) ----
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const consoleErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push(e.message));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  // Jump straight to the bottom first (simulates landing below the AI section without ever scrolling down through it)
  const h = await page.evaluate(() => document.body.scrollHeight);
  await page.evaluate((yy) => window.scrollTo(0, yy), h);
  await page.waitForTimeout(500);
  // Now scroll UP in small increments back to the AI section
  const aiTop = await page.evaluate(() => document.querySelector('.h-ai')?.getBoundingClientRect().top + window.scrollY);
  let y = h;
  while (y > aiTop - 200) {
    y -= 200;
    await page.evaluate((yy) => window.scrollTo(0, Math.max(0, yy)), y);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(1500);
  const aiState = await page.evaluate(() => ({
    msgUText: document.querySelector('.h-msg-u')?.textContent || 'MISSING',
    msgAExists: !!document.querySelector('.h-msg-a'),
  }));
  results.aiApproachedFromBelow = aiState;
  results.consoleErrorsTest1 = consoleErrors;
  await page.close();
}

// ---- Test 2: TeemlyModel reverse scroll (scroll all the way down first, then back up through it) ----
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const h = await page.evaluate(() => document.body.scrollHeight);
  // forward pass
  for (let yy = 0; yy < h; yy += 300) {
    await page.evaluate((v) => window.scrollTo(0, v), yy);
    await page.waitForTimeout(40);
  }
  await page.waitForTimeout(500);
  // reverse pass back to top, pausing specifically around TeemlyModel
  const modelRect = await page.evaluate(() => {
    const el = document.querySelector('.h-model');
    const r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
  });
  for (let yy = h; yy > 0; yy -= 300) {
    await page.evaluate((v) => window.scrollTo(0, Math.max(0, v)), yy);
    await page.waitForTimeout(40);
  }
  // land exactly mid-way through the model section on the way up
  await page.evaluate((v) => window.scrollTo(0, v), Math.round((modelRect.top + modelRect.bottom) / 2) - 400);
  await page.waitForTimeout(800);
  const modelState = await page.evaluate(() => {
    const note = document.querySelector('.h-model-note');
    const panels = Array.from(document.querySelectorAll('.h-panel'));
    const track = document.querySelector('.h-track');
    const noteR = note?.getBoundingClientRect();
    return {
      noteVisible: noteR ? (noteR.top < window.innerHeight && noteR.bottom > 0) : false,
      noteOpacity: note ? getComputedStyle(note).opacity : 'MISSING',
      panelOpacities: panels.map((p) => getComputedStyle(p).opacity),
      panelCount: panels.length,
      trackTransform: track ? getComputedStyle(track).transform : 'MISSING',
      scrollY: window.scrollY,
    };
  });
  results.modelReverseScroll = modelState;
  await page.close();
}

// ---- Test 3: Hero particle loop survives leaving and re-entering viewport ----
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  // scroll hero out of view
  await page.evaluate(() => window.scrollTo(0, 3000));
  await page.waitForTimeout(500);
  // scroll back to hero
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  // sample canvas pixels twice, 300ms apart; if the loop is alive, particle positions should differ
  const sample1 = await page.evaluate(() => {
    const c = document.querySelector('.h-particle-canvas');
    const ctx = c.getContext('2d');
    return Array.from(ctx.getImageData(0, 0, Math.min(50, c.width), Math.min(50, c.height)).data.slice(0, 400));
  });
  await page.waitForTimeout(400);
  const sample2 = await page.evaluate(() => {
    const c = document.querySelector('.h-particle-canvas');
    const ctx = c.getContext('2d');
    return Array.from(ctx.getImageData(0, 0, Math.min(50, c.width), Math.min(50, c.height)).data.slice(0, 400));
  });
  const identical = JSON.stringify(sample1) === JSON.stringify(sample2);
  results.heroLoopFrozenAfterReentry = identical; // true = BAD (frozen), false = GOOD (animating)
  await page.close();
}

console.log(JSON.stringify(results, null, 2));
await browser.close();
