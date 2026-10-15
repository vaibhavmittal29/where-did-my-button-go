import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch({ headless: true });

  // 1. Mobile 390x844
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:5173/?screen=kit');
    await page.waitForTimeout(1000);
    const mobilePath = 'C:/Users/vaibh/.gemini/antigravity/brain/d3c251cc-b9ea-4484-982e-138020751b92/phase3-kit-mobile.png';
    await page.screenshot({ path: mobilePath, fullPage: true });
    console.log('Mobile screenshot saved to:', mobilePath);
    await context.close();
  }

  // 2. Desktop width
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 1200 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();
    await page.goto('http://localhost:5173/?screen=kit');
    await page.waitForTimeout(1000);
    const desktopPath = 'C:/Users/vaibh/.gemini/antigravity/brain/d3c251cc-b9ea-4484-982e-138020751b92/phase3-kit-desktop.png';
    await page.screenshot({ path: desktopPath });
    console.log('Desktop screenshot saved to:', desktopPath);
    await context.close();
  }

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
