import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 969 } });
await page.goto('http://localhost:5180/', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);

// Header screenshot
await page.screenshot({ path: 'scripts/shots/header-reordered.png', clip: { x: 0, y: 0, width: 1440, height: 90 } });

// Scroll to mid-pin of TeemlyModel
const modelTop = await page.evaluate(() => document.querySelector('.h-model').getBoundingClientRect().top + window.scrollY);
let y = 0;
while (y < modelTop + 400) {
  await page.mouse.wheel(0, 200);
  y += 200;
  await page.waitForTimeout(25);
}
await page.waitForTimeout(600);
await page.screenshot({ path: 'scripts/shots/model-fixed.png' });

// AI section with bars visible
const aiSection = await page.$('.h-ai');
await aiSection.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
const buttons = await page.$$('.h-prompts button');
if (buttons[1]) await buttons[1].click();
await page.waitForTimeout(2200);
await page.screenshot({ path: 'scripts/shots/ai-bars-fixed.png' });

await browser.close();
console.log('done');
