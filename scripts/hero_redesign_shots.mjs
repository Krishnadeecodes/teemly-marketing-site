import { chromium } from 'playwright';

const browser = await chromium.launch();

const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await desktop.goto('http://localhost:5180/', { waitUntil: 'networkidle' });
await desktop.waitForTimeout(3200); // let the intro timeline + delayed floating badges finish
await desktop.screenshot({ path: 'scripts/shots/hero-redesign-desktop.png' });
await desktop.close();

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto('http://localhost:5180/', { waitUntil: 'networkidle' });
await mobile.waitForTimeout(3200);
await mobile.screenshot({ path: 'scripts/shots/hero-redesign-mobile.png' });
await mobile.close();

// reduced motion check
const reduced = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await reduced.emulateMedia({ reducedMotion: 'reduce' });
await reduced.goto('http://localhost:5180/', { waitUntil: 'networkidle' });
await reduced.waitForTimeout(600);
await reduced.screenshot({ path: 'scripts/shots/hero-redesign-reducedmotion.png' });
await reduced.close();

await browser.close();
console.log('done');
