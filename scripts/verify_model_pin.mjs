import { chromium } from 'playwright';

const URL = 'http://localhost:5180/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

const modelTop = await page.evaluate(() => document.querySelector('.h-model').getBoundingClientRect().top + window.scrollY);

// Real wheel-scroll down to just before the model section
let y = 0;
while (y < modelTop - 300) {
  await page.mouse.wheel(0, 200);
  y += 200;
  await page.waitForTimeout(25);
}
await page.waitForTimeout(400);

const samples = [];
for (let i = 0; i < 14; i++) {
  const s = await page.evaluate(() => {
    const section = document.querySelector('.h-model');
    const track = document.querySelector('.h-track');
    const note = document.querySelector('.h-model-note');
    const head = document.querySelector('.h-model-head');
    const sr = section.getBoundingClientRect();
    const nr = note.getBoundingClientRect();
    const hr = head.getBoundingClientRect();
    return {
      sectionPosition: getComputedStyle(section).position,
      sectionTop: Math.round(sr.top),
      trackTransform: getComputedStyle(track).transform,
      noteTop: Math.round(nr.top),
      noteInViewport: nr.top < window.innerHeight && nr.bottom > 0,
      headInViewport: hr.top < window.innerHeight && hr.bottom > 0,
      scrollY: Math.round(window.scrollY),
    };
  });
  samples.push(s);
  await page.mouse.wheel(0, 250);
  await page.waitForTimeout(90);
}

console.log(JSON.stringify(samples, null, 2));
await browser.close();
