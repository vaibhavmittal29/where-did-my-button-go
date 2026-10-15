import { chromium } from 'playwright';
import path from 'node:path';

const SCREENS = [
  { name: 'screen-01-onboarding', url: 'http://localhost:5173/?screen=onboarding' },
  { name: 'screen-02-idle', url: 'http://localhost:5173/?screen=idle' },
  { name: 'screen-03-locking', url: 'http://localhost:5173/?screen=locking&progress=0.6' },
  { name: 'screen-04-moments', url: 'http://localhost:5173/?screen=moments&selected=3' },
  { name: 'screen-05-group', url: 'http://localhost:5173/?screen=group&ready=3' },
];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });

  const brainDir = 'C:/Users/vaibh/.gemini/antigravity/brain/d3c251cc-b9ea-4484-982e-138020751b92';

  for (const screen of SCREENS) {
    const page = await context.newPage();
    await page.goto(screen.url);
    await page.waitForTimeout(1000);
    const savePath = path.join(brainDir, `${screen.name}.png`);
    await page.screenshot({ path: savePath });
    console.log(`Saved: ${savePath}`);
    await page.close();
  }

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
