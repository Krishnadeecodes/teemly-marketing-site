import { chromium } from 'playwright';

const URL = 'http://localhost:5180/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

async function sumCanvas() {
  return page.evaluate(() => {
    const c = document.querySelector('.h-particle-canvas');
    const ctx = c.getContext('2d');
    const data = ctx.getImageData(0, 0, c.width, c.height).data;
    let sum = 0;
    for (let i = 0; i < data.length; i += 97) sum += data[i]; // coarse checksum, sampled stride for speed
    return sum;
  });
}

// Baseline while hero is in view
const base1 = await sumCanvas();
await page.waitForTimeout(300);
const base2 = await sumCanvas();

// Leave viewport
await page.evaluate(() => window.scrollTo(0, 3000));
await page.waitForTimeout(600);

// Re-enter viewport
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(600);

const after1 = await sumCanvas();
await page.waitForTimeout(350);
const after2 = await sumCanvas();
await page.waitForTimeout(350);
const after3 = await sumCanvas();

console.log(JSON.stringify({
  baselineAnimating: base1 !== base2,
  afterReentryFrame1: after1,
  afterReentryFrame2: after2,
  afterReentryFrame3: after3,
  afterReentryAnimating: after1 !== after2 || after2 !== after3,
}, null, 2));

await browser.close();
