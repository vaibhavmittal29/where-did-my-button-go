import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ensureServer } from './server-helper.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_DIR = path.resolve(__dirname, '..');
const TEST_RESULTS_DIR = path.join(PROJECT_DIR, 'test-results');
const DEFAULT_BRAIN = 'C:/Users/vaibh/.gemini/antigravity/brain/d3c251cc-b9ea-4484-982e-138020751b92';
const BRAIN_DIR = process.env.BRAIN_DIR || (fs.existsSync(DEFAULT_BRAIN) ? DEFAULT_BRAIN : null);

if (!fs.existsSync(TEST_RESULTS_DIR)) {
  fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true });
}

async function testReducedMotion() {
  console.log('Testing Phase 6 Prefers-Reduced-Motion Compliance...');
  const serverProcess = await ensureServer(5173);
  let browser;

  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1200, height: 950 },
      reducedMotion: 'reduce', // Emulate prefers-reduced-motion: reduce
    });
    const page = await context.newPage();

    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
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

    // Verify stepped percentage value (0, 33, 66, or 100%)
    const ariaValueNow = await lockRing.getAttribute('aria-valuenow');
    const validSteps = ['0', '33', '66', '100'];
    console.log(`LockRing aria-valuenow under reduced motion: ${ariaValueNow}%`);
    if (!validSteps.includes(ariaValueNow || '')) {
      throw new Error(`LockRing progress ${ariaValueNow}% is not one of expected discrete steps: ${validSteps.join(', ')}`);
    }

    const localPath = path.join(TEST_RESULTS_DIR, 'phase6-reduced-motion.png');
    await page.screenshot({ path: localPath });
    if (BRAIN_DIR && fs.existsSync(BRAIN_DIR)) {
      try {
        fs.copyFileSync(localPath, path.join(BRAIN_DIR, 'phase6-reduced-motion.png'));
      } catch {
        // ignore copy errors
      }
    }

    // Wait for full capture -> Moment Strip review under reduced motion
    await page.waitForTimeout(800);
    const bodyText = await page.textContent('body');
    if (!bodyText.includes('Pick your favourite moment')) {
      throw new Error('Capture did not complete under reduced motion mode');
    }
    console.log('✓ Reduced motion test passed (stepped ring + capture -> review)!');
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
    if (serverProcess) {
      serverProcess.kill();
    }
  }
  process.exit(0);
}

testReducedMotion().catch((err) => {
  console.error('Reduced motion test failed:', err);
  process.exit(1);
});
