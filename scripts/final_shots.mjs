import { chromium } from 'playwright';

const browser = await chromium.launch();
const d = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
await d.goto('http://localhost:5180/', { waitUntil: 'networkidle' });
await d.waitForTimeout(800);
const trust = await d.$('.h-trust');
await trust.scrollIntoViewIfNeeded();
await d.waitForTimeout(1200);
await d.screenshot({ path: 'scripts/shots/trust-redesign.png', clip: await trust.boundingBox() });
const h = await d.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 250) {
  await d.evaluate((yy) => window.scrollTo(0, yy), y);
  await d.waitForTimeout(45);
}
await d.waitForTimeout(500);
await d.screenshot({ path: 'scripts/shots/round3-final-desktop.png', fullPage: true });
await d.close();
await browser.close();
console.log('done');
