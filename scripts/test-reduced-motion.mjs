import { chromium } from 'playwright';

async function testReducedMotion() {
  console.log('Testing Phase 6 Prefers-Reduced-Motion Compliance...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 950 },
    reducedMotion: 'reduce', // Emulate prefers-reduced-motion: reduce
  });
  const page = await context.newPage();

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Tap subject to focus & lock
  const viewfinder = page.locator('img[alt="Camera viewfinder scene"]');
  await viewfinder.click({ position: { x: 195, y: 350 } });
  await page.waitForTimeout(300);

  // Check data-reduced-motion attribute on LockRing
  const lockRing = page.locator('div[role="progressbar"]');
  const isReduced = await lockRing.getAttribute('data-reduced-motion');
  console.log('LockRing data-reduced-motion:', isReduced);
  if (isReduced !== 'true') {
    throw new Error('LockRing did not detect reduced motion mode');
  }

  await page.screenshot({ path: 'C:/Users/vaibh/.gemini/antigravity/brain/d3c251cc-b9ea-4484-982e-138020751b92/phase6-reduced-motion.png' });
  console.log('✓ Reduced motion test passed!');

  await browser.close();
}

testReducedMotion().catch((err) => {
  console.error('Reduced motion test failed:', err);
  process.exit(1);
});
