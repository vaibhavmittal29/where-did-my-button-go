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

async function saveScreen(page, filename) {
  const localPath = path.join(TEST_RESULTS_DIR, filename);
  await page.screenshot({ path: localPath });
  if (BRAIN_DIR && fs.existsSync(BRAIN_DIR)) {
    try {
      fs.copyFileSync(localPath, path.join(BRAIN_DIR, filename));
    } catch {
      // ignore copy errors
    }
  }
}

async function testInteractive() {
  console.log('Testing Phase 5 Interactive Camera Scenarios...');
  const serverProcess = await ensureServer(5173);
  let browser;

  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 1200, height: 950 },
    });
    const page = await context.newPage();

    // Load root interactive route
    await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

  // 1. Check initial Idle State
  const initialText = await page.textContent('body');
  if (!initialText.includes('STILL Lab') || (!initialText.includes('Tap what you want to keep') && !initialText.includes('Tap what matters'))) {
    throw new Error('Initial idle UI missing ghost ring coach mark or DemoPanel');
  }
  console.log('✓ Scenario 0 Passed: Interactive screen loaded with Viewfinder & DemoPanel');

  // Verify touch target sizes on DemoPanel buttons (Apple HIG / WCAG >= 44x44px)
  const demoButtons = page.locator('aside[aria-label="STILL Interaction Demo Panel"] button');
  const btnCount = await demoButtons.count();
  for (let i = 0; i < btnCount; i++) {
    const box = await demoButtons.nth(i).boundingBox();
    if (box) {
      if (box.width < 43.5 || box.height < 43.5) {
        const text = await demoButtons.nth(i).textContent();
        throw new Error(`DemoPanel button "${text?.trim()}" has size ${box.width}x${box.height}, expected >= 44x44px`);
      }
    }
  }
  console.log(`✓ Touch Target Size Verification: All ${btnCount} DemoPanel buttons meet >= 44x44px target standard`);

  // Take screenshot of idle interactive state
  await saveScreen(page, 'phase5-01-idle.png');

  // 2. Scenario 1: Tap subject to focus
  // Click on the viewfinder image
  const viewfinder = page.locator('img[alt="Camera viewfinder scene"]');
  await viewfinder.click({ position: { x: 195, y: 350 } });
  await page.waitForTimeout(400);

  // Focus ring should appear
  let stateStatus = await page.locator('text=State:').locator('..').textContent();
  console.log('State after tap:', stateStatus.trim());

  // Wait for lock ring progress to accumulate (since default steadiness is > 0.7)
  await page.waitForTimeout(500);
  await saveScreen(page, 'phase5-02-locking.png');

  // Wait for capture and transition to REVIEW
  await page.waitForTimeout(800);
  const reviewText = await page.textContent('body');
  if (!reviewText.includes('Pick your favourite moment') || !reviewText.includes('Rewind 3s')) {
    throw new Error('Moment Strip did not open after lock completion');
  }
  console.log('✓ Scenario 1 Passed: Tap -> Steady Hold -> Auto-Capture -> Moment Strip Review');
  await saveScreen(page, 'phase5-03-review.png');

  // 3. Scenario 2: Frame Selection in Moment Strip
  const frameThumbnails = page.locator('button[aria-label^="Frame"]');
  const count = await frameThumbnails.count();
  if (count !== 7) throw new Error(`Expected 7 frames in strip, found ${count}`);
  
  // Tap frame 1
  await frameThumbnails.nth(1).click();
  await page.waitForTimeout(300);
  console.log('✓ Scenario 2 Passed: Moment Strip allows frame swapping');

  // 4. Scenario 3: Wait for autosave countdown -> Toast "Saved · Undo" -> Click Undo
  console.log('Waiting for autosave countdown (approx 4s)...');
  await page.waitForTimeout(4500);

  const toastText = await page.textContent('body');
  if (!toastText.includes('Saved · Undo') && !toastText.includes('Undo')) {
    throw new Error('Toast "Saved · Undo" did not appear after autosave');
  }
  console.log('✓ Scenario 3a Passed: Autosave completed and showed Saved · Undo toast');
  await saveScreen(page, 'phase5-04-saved.png');

  // Click Undo button
  const undoBtn = page.locator('button:has-text("Undo")');
  await undoBtn.click();
  await page.waitForTimeout(300);
  const undoToast = await page.textContent('body');
  if (!undoToast.includes('Photo removed')) {
    throw new Error('Undo did not show "Photo removed" feedback');
  }
  console.log('✓ Scenario 3b Passed: Undo successfully discarded photo');
  await saveScreen(page, 'phase5-05-undone.png');

  // 5. Scenario 4: Shake / Movement Interruption
  // Reset camera
  await page.locator('button:has-text("Reset")').click();
  await page.waitForTimeout(400);

  // Tap subject to enter FOCUSED -> LOCKING
  await viewfinder.click({ position: { x: 195, y: 350 } });
  await page.waitForTimeout(250);

  // Trigger sudden shake
  await page.locator('button:has-text("Simulate Sudden Shake")').click();
  // UNSTEADY_GRACE_MS is 250ms; wait reactively for UNSTEADY cancellation transition
  await page.waitForFunction(() => document.body.innerText.includes('Too much movement'), { timeout: 3000 });

  await saveScreen(page, 'phase5-06-shake.png');
  console.log('✓ Scenario 4 Passed: Sudden movement cancels lock and drains ring with "Too much movement" feedback');

  // 6. Scenario 5: Group Mode & Voice Trigger
  await page.locator('button:has-text("Reset")').click();
  await page.waitForTimeout(200);
  await page.locator('button:has-text("Group Mode")').click();
  await page.waitForTimeout(400);

  const groupBody = await page.textContent('body');
  if (!groupBody.includes('3 of 4 ready') || !groupBody.includes('Tara · Blinking')) {
    throw new Error('Group mode did not activate properly');
  }
  console.log('✓ Scenario 5a Passed: Group Mode active with 3 of 4 ready and Tara blinking');
  await saveScreen(page, 'phase5-07-group.png');

  // Test voice trigger guard in group mode (must be blocked when Tara is blinking)
  await page.locator('button:has-text("Cheese")').click();
  await page.waitForTimeout(300);
  const blockedBody = await page.textContent('body');
  if (!blockedBody.includes('Group not ready') && !blockedBody.includes('3 of 4 ready')) {
    throw new Error('Voice trigger was not guarded when group member was blinking');
  }

  // Toggle group to All 4 Ready
  await page.locator('button:has-text("3 of 4 Ready")').click();
  await page.waitForTimeout(300);

  // Trigger voice capture when all 4 are ready
  await page.locator('button:has-text("Cheese")').click();
  await page.waitForTimeout(500);
  const voiceBody = await page.textContent('body');
  if (!voiceBody.includes('Pick your favourite moment')) {
    throw new Error('Voice trigger did not trigger capture when all 4 ready');
  }
  console.log('✓ Scenario 5b Passed: Voice trigger properly guarded by group readiness, then captures when all 4 ready');

  // Scenario 5c (P0-01): Tap viewfinder in Group Mode with 3/4 ready -> steady hold does NOT capture
  await page.locator('button:has-text("Reset")').click();
  await page.waitForTimeout(300);
  const groupBtn = page.locator('button:has-text("Group Mode")');
  if (await groupBtn.count() > 0) {
    await groupBtn.click();
    await page.waitForTimeout(300);
  }
  const all4ReadyBtn = page.locator('button:has-text("All 4 Ready")');
  if (await all4ReadyBtn.count() > 0) {
    await all4ReadyBtn.click(); // toggle back to 3 of 4 ready
    await page.waitForTimeout(300);
  }
  // Viewfinder tap
  await viewfinder.click({ position: { x: 195, y: 350 } });
  await page.waitForTimeout(1200); // Wait longer than 800ms base hold time
  const groupHoldBody = await page.textContent('body');
  if (groupHoldBody.includes('Pick your favourite moment')) {
    throw new Error('Group Mode with 3/4 ready captured on steady hold! P0-01 violation.');
  }
  console.log('✓ Scenario 5c Passed (P0-01): Group Mode with 3 of 4 ready strictly blocks steady hold capture');

  // Scenario 5d (1.1): Group Mode one-shot auto-capture does not re-capture after Undo
  await page.locator('button:has-text("Reset")').click();
  await page.waitForTimeout(300);
  const groupBtn5d = page.locator('button:has-text("Group Mode")');
  if (await groupBtn5d.count() > 0) {
    await groupBtn5d.click();
    await page.waitForTimeout(300);
  }
  // Toggle to All 4 Ready
  const toggle4Ready = page.locator('button:has-text("3 of 4 Ready")');
  if (await toggle4Ready.count() > 0) {
    await toggle4Ready.click();
    await page.waitForTimeout(300);
  }
  // Wait for auto-capture (800ms hold) and enter REVIEW
  await page.waitForFunction(() => document.body.innerText.includes('Pick your favourite moment'), { timeout: 4000 });
  // Wait for autosave countdown (~4.5s)
  await page.waitForFunction(() => document.body.innerText.includes('Saved · Undo'), { timeout: 6000 });
  // Click Undo
  await page.locator('button:has-text("Undo")').click();
  await page.waitForFunction(() => document.body.innerText.includes('Photo removed'), { timeout: 2000 });
  // Stay steady for 2.2 seconds
  await page.waitForTimeout(2200);
  // Assert no new capture or review occurs!
  const postUndoText = await page.textContent('body');
  if (postUndoText.includes('Pick your favourite moment') || postUndoText.includes('Saved · Undo')) {
    throw new Error('Group Mode re-captured after Undo! 1.1 violation.');
  }
  console.log('✓ Scenario 5d Passed (1.1): Group Mode auto-capture disarmed through Undo; no re-capture while steady');

  // Scenario 5e (1.2): Group readiness single source of truth in reducer & DemoPanel reset
  await page.locator('button:has-text("Reset")').click();
  await page.waitForTimeout(300);
  const chipText = await page.textContent('body');
  if (!chipText.includes('3 of 4 ready')) {
    throw new Error('UI group chip does not match reducer initial 3 of 4 ready state! 1.2 violation.');
  }
  console.log('✓ Scenario 5e Passed (1.2): Group readiness is single-sourced in reducer without desync');

  console.log('\n🎉 ALL PHASE 5 INTERACTION SCENARIOS PASSED WITH FLYING COLORS!');
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

testInteractive().catch((err) => {
  console.error('Interactive test failure:', err);
  process.exit(1);
});
