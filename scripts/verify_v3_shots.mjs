import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:5180/', { waitUntil: 'networkidle' });
await page.waitForTimeout(3200);
await page.screenshot({ path: 'scripts/shots/v3-hero.png' });

const h = await page.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 300) {
  await page.evaluate((yy) => window.scrollTo(0, yy), y);
  await page.waitForTimeout(45);
}
await page.waitForTimeout(500);
await page.screenshot({ path: 'scripts/shots/v3-full.png', fullPage: true });

const model = await page.$('.h-model');
if (model) { await model.scrollIntoViewIfNeeded(); await page.waitForTimeout(500); await page.screenshot({ path: 'scripts/shots/v3-model-blue.png' }); }

const ai = await page.$('.h-ai');
if (ai) { await ai.scrollIntoViewIfNeeded(); await page.waitForTimeout(500); await page.screenshot({ path: 'scripts/shots/v3-ai-blue.png' }); }

const trust = await page.$('.h-trust');
if (trust) { await trust.scrollIntoViewIfNeeded(); await page.waitForTimeout(500); await page.screenshot({ path: 'scripts/shots/v3-trust-blue.png' }); }

const footer = await page.$('.site-footer');
if (footer) { await footer.scrollIntoViewIfNeeded(); await page.waitForTimeout(500); await page.screenshot({ path: 'scripts/shots/v3-footer.png' }); }

await page.close();

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto('http://localhost:5180/', { waitUntil: 'networkidle' });
await mobile.waitForTimeout(3200);
await mobile.screenshot({ path: 'scripts/shots/v3-hero-mobile.png' });
await mobile.close();

await browser.close();
console.log('done');
