import assert from 'node:assert';
import {
  cameraReducer,
  initialCameraState,
  getEffectiveHoldTime,
} from '../src/state/cameraMachine';
import { HOLD_TIME_MS, LOW_LIGHT_MULTIPLIER } from '../src/state/constants';

console.log('--- RUNNING CAMERA STATE MACHINE SANITY TESTS ---\n');

// SCENARIO 1: Normal Capture Flow
{
  console.log('Test 1: Normal Capture Flow');
  let state = initialCameraState;
  assert.strictEqual(state.status, 'IDLE');

  // Step 1: User taps subject
  state = cameraReducer(state, { type: 'TAP_SUBJECT', x: 195, y: 400 });
  assert.strictEqual(state.status, 'FOCUSED');
  assert.deepStrictEqual(state.focusPoint, { x: 195, y: 400 });
  assert.strictEqual(state.progress, 0);

  // Step 2: Steady detected
  state = cameraReducer(state, { type: 'STEADY_OK' });
  assert.strictEqual(state.status, 'LOCKING');

  // Step 3: Steady ticks accumulate progress
  state = cameraReducer(state, { type: 'STEADY_TICK', dt: 400 });
  assert.strictEqual(state.status, 'LOCKING');
  assert.strictEqual(state.progress, 400 / HOLD_TIME_MS);

  // Step 4: Completing hold time triggers CAPTURED
  state = cameraReducer(state, { type: 'STEADY_TICK', dt: 400 });
  assert.strictEqual(state.status, 'CAPTURED');
  assert.strictEqual(state.progress, 1);

  // Step 5: Capture animation completes -> REVIEW with best frame pre-selected
  state = cameraReducer(state, { type: 'ANIM_DONE' });
  assert.strictEqual(state.status, 'REVIEW');
  assert.strictEqual(state.selectedFrameIndex, state.bestFrameIndex);

  // Step 6: User picks an alternate frame
  state = cameraReducer(state, { type: 'PICK_FRAME', index: 1 });
  assert.strictEqual(state.selectedFrameIndex, 1);

  // Step 7: 4s Autosave timeout triggers SAVED
  state = cameraReducer(state, { type: 'TIMEOUT_REVIEW' });
  assert.strictEqual(state.status, 'SAVED');
  assert.strictEqual(state.savedPhoto, true);
  assert.strictEqual(state.canUndo, true);

  console.log('✔ Test 1 Passed: Complete normal capture lifecycle verified.\n');
}

// SCENARIO 2: Cancelled Lock on Movement
{
  console.log('Test 2: Cancelled Lock Flow');
  let state = initialCameraState;
  state = cameraReducer(state, { type: 'TAP_SUBJECT', x: 100, y: 200 });
  state = cameraReducer(state, { type: 'STEADY_OK' });
  state = cameraReducer(state, { type: 'STEADY_TICK', dt: 300 });
  assert.strictEqual(state.status, 'LOCKING');

  // Device movement detected mid-lock
  state = cameraReducer(state, { type: 'UNSTEADY' });
  assert.strictEqual(state.status, 'CANCELLED');
  assert.strictEqual(state.statusMessage, 'Too much movement — hold still');

  // When drain animation completes, returns to FOCUSED with pin preserved
  state = cameraReducer(state, { type: 'ANIM_DONE' });
  assert.strictEqual(state.status, 'FOCUSED');
  assert.deepStrictEqual(state.focusPoint, { x: 100, y: 200 });
  assert.strictEqual(state.progress, 0);

  console.log('✔ Test 2 Passed: Lock cancellation retains focus pin for immediate retry.\n');
}

// SCENARIO 3: Undo Reversal Flow
{
  console.log('Test 3: Undo Reversal Flow');
  let state = initialCameraState;
  state = cameraReducer(state, { type: 'TAP_SUBJECT', x: 150, y: 300 });
  state = cameraReducer(state, { type: 'STEADY_OK' });
  state = cameraReducer(state, { type: 'STEADY_TICK', dt: HOLD_TIME_MS });
  assert.strictEqual(state.status, 'CAPTURED');
  state = cameraReducer(state, { type: 'ANIM_DONE' });
  state = cameraReducer(state, { type: 'TIMEOUT_REVIEW' });
  assert.strictEqual(state.status, 'SAVED');
  assert.strictEqual(state.savedPhoto, true);
  assert.strictEqual(state.canUndo, true);

  // Trigger Undo
  state = cameraReducer(state, { type: 'UNDO' });
  assert.strictEqual(state.status, 'IDLE');
  assert.strictEqual(state.savedPhoto, false);
  assert.strictEqual(state.canUndo, false);
  assert.strictEqual(state.statusMessage, 'Photo removed');

  console.log('✔ Test 3 Passed: Saved photo successfully discarded by Undo.\n');
}

// SCENARIO 4: Low-Light Multiplier
{
  console.log('Test 4: Low-Light Multiplier');
  const normalHoldTime = getEffectiveHoldTime(false);
  const lowLightHoldTime = getEffectiveHoldTime(true);

  assert.strictEqual(normalHoldTime, HOLD_TIME_MS);
  assert.strictEqual(lowLightHoldTime, HOLD_TIME_MS * LOW_LIGHT_MULTIPLIER);
  assert.strictEqual(lowLightHoldTime, 1200);

  let state = { ...initialCameraState, isLowLight: true };
  state = cameraReducer(state, { type: 'TAP_SUBJECT', x: 200, y: 200 });
  state = cameraReducer(state, { type: 'STEADY_OK' });
  assert.strictEqual(state.statusMessage, 'Low light — hold a bit longer');

  // At 800ms in low-light, progress is only 800/1200 = 66.6%
  state = cameraReducer(state, { type: 'STEADY_TICK', dt: 800 });
  assert.strictEqual(state.status, 'LOCKING');
  assert.ok(Math.abs(state.progress - (800 / 1200)) < 0.001);

  // Needs remaining 400ms to complete
  state = cameraReducer(state, { type: 'STEADY_TICK', dt: 400 });
  assert.strictEqual(state.status, 'CAPTURED');
  assert.strictEqual(state.progress, 1);

  console.log('✔ Test 4 Passed: Low light accurately extends hold time by 1.5x.\n');
}

console.log('ALL 4 STATE MACHINE SANITY TESTS PASSED SUCCESSFULLY! 🎉');
