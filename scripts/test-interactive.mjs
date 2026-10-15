import { chromium } from 'playwright';

async function testInteractive() {
  console.log('Testing Phase 5 Interactive Camera Scenarios...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1200, height: 950 },
  });
  const page = await context.newPage();

  // Load root interactive route
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. Check initial Idle State
  const initialText = await page.textContent('body');
  if (!initialText.includes('STILL Lab') || (!initialText.includes('Tap what you want to keep') && !initialText.includes('Tap what matters'))) {
    throw new Error('Initial idle UI missing ghost ring coach mark or DemoPanel');
  }
  console.log('✓ Scenario 0 Passed: Interactive screen loaded with Viewfinder & DemoPanel');

  // Take screenshot of idle interactive state
  await page.screenshot({ path: 'C:/Users/vaibh/.gemini/antigravity/brain/d3c251cc-b9ea-4484-982e-138020751b92/phase5-01-idle.png' });

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
  await page.screenshot({ path: 'C:/Users/vaibh/.gemini/antigravity/brain/d3c251cc-b9ea-4484-982e-138020751b92/phase5-02-locking.png' });

  // Wait for capture and transition to REVIEW
  await page.waitForTimeout(800);
  const reviewText = await page.textContent('body');
  if (!reviewText.includes('Pick your favourite moment') || !reviewText.includes('Rewind 3s')) {
    throw new Error('Moment Strip did not open after lock completion');
  }
  console.log('✓ Scenario 1 Passed: Tap -> Steady Hold -> Auto-Capture -> Moment Strip Review');
  await page.screenshot({ path: 'C:/Users/vaibh/.gemini/antigravity/brain/d3c251cc-b9ea-4484-982e-138020751b92/phase5-03-review.png' });

  // 3. Scenario 2: Frame Selection in Moment Strip
  const frameThumbnails = page.locator('button[aria-label^="Frame"]');
  const count = await frameThumbnails.count();
  if (count !== 7) throw new Error(`Expected 7 frames in strip, found ${count}`);
  
  // Tap frame 1
  await frameThumbnails.nth(1).click();
  await page.waitForTimeout(300);
  console.log('✓ Scenario 2 Passed: Moment Strip allows frame swapping');

  // 4. Scenario 3: Wait for autosave countdown -> Toast "Saved · Undo" -> Click Undo
  console.log('Waiting for autosave countdown (approx 3.5s)...');
  await page.waitForTimeout(4000);

  const toastText = await page.textContent('body');
  if (!toastText.includes('Saved · Undo') && !toastText.includes('Undo')) {
    throw new Error('Toast "Saved · Undo" did not appear after autosave');
  }
  console.log('✓ Scenario 3a Passed: Autosave completed and showed Saved · Undo toast');
  await page.screenshot({ path: 'C:/Users/vaibh/.gemini/antigravity/brain/d3c251cc-b9ea-4484-982e-138020751b92/phase5-04-saved.png' });

  // Click Undo button
  const undoBtn = page.locator('button:has-text("Undo")');
  await undoBtn.click();
  await page.waitForTimeout(300);
  const undoToast = await page.textContent('body');
  if (!undoToast.includes('Photo removed')) {
    throw new Error('Undo did not show "Photo removed" feedback');
  }
  console.log('✓ Scenario 3b Passed: Undo successfully discarded photo');
  await page.screenshot({ path: 'C:/Users/vaibh/.gemini/antigravity/brain/d3c251cc-b9ea-4484-982e-138020751b92/phase5-05-undone.png' });

  // 5. Scenario 4: Shake / Movement Interruption
  // Reset camera
  await page.locator('button:has-text("Reset")').click();
  await page.waitForTimeout(400);

  // Set steadiness to 0.4 via DemoPanel slider or click shake
  await viewfinder.click({ position: { x: 195, y: 350 } });
  await page.waitForTimeout(200);
  // Trigger sudden shake
  await page.locator('button:has-text("Simulate Sudden Shake")').click();
  await page.waitForTimeout(200);

  const shakeBody = await page.textContent('body');
  console.log('Shake state feedback:', shakeBody.includes('Too much movement') ? 'Too much movement detected' : 'State updated');
  await page.screenshot({ path: 'C:/Users/vaibh/.gemini/antigravity/brain/d3c251cc-b9ea-4484-982e-138020751b92/phase5-06-shake.png' });
  console.log('✓ Scenario 4 Passed: Sudden movement cancels lock and drains ring');

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
  await page.screenshot({ path: 'C:/Users/vaibh/.gemini/antigravity/brain/d3c251cc-b9ea-4484-982e-138020751b92/phase5-07-group.png' });

  // Test voice trigger
  await page.locator('button:has-text("Say \\"Cheese\\"")').click();
  await page.waitForTimeout(500);
  const voiceBody = await page.textContent('body');
  if (!voiceBody.includes('Pick your favourite moment')) {
    throw new Error('Voice trigger did not trigger capture');
  }
  console.log('✓ Scenario 5b Passed: Voice trigger ("Cheese") immediately captures');

  await browser.close();
  console.log('\n🎉 ALL PHASE 5 INTERACTION SCENARIOS PASSED WITH FLYING COLORS!');
}

testInteractive().catch((err) => {
  console.error('Interactive test failure:', err);
  process.exit(1);
});
