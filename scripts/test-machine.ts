import assert from 'node:assert';
import {
  cameraReducer,
  initialCameraState,
  getEffectiveHoldTime,
} from '../src/state/cameraMachine';
import {
  HOLD_TIME_MS,
  HOLD_TIME_MIN_MS,
  HOLD_TIME_MAX_MS,
  CANDIDATE_FRAMES,
  LOW_LIGHT_MULTIPLIER,
} from '../src/state/constants';

console.log('--- RUNNING CAMERA STATE MACHINE SANITY TESTS ---\n');

// SCENARIO 1: Normal Capture Flow
{
  console.log('Test 1: Normal Capture Flow');
  let state = initialCameraState;
  assert.strictEqual(state.status, 'IDLE');

  // Step 1: User taps subject
  state = cameraReducer(state, { type: 'TAP_SUBJECT', x: 50, y: 45 });
  assert.strictEqual(state.status, 'FOCUSED');
  assert.deepStrictEqual(state.focusPoint, { x: 50, y: 45 });
  assert.strictEqual(state.progress, 0);

  // Step 2: Steady detected
  state = cameraReducer(state, { type: 'STEADY_OK' });
  assert.strictEqual(state.status, 'LOCKING');

  // Step 3: Steady ticks accumulate progress (clamped to max 100ms per tick)
  for (let i = 0; i < 4; i++) {
    state = cameraReducer(state, { type: 'STEADY_TICK', dt: 100 });
  }
  assert.strictEqual(state.status, 'LOCKING');
  assert.strictEqual(state.progress, 400 / HOLD_TIME_MS);

  // Step 4: Completing hold time triggers CAPTURED
  for (let i = 0; i < 4; i++) {
    state = cameraReducer(state, { type: 'STEADY_TICK', dt: 100 });
  }
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
  state = cameraReducer(state, { type: 'TAP_SUBJECT', x: 40, y: 60 });
  state = cameraReducer(state, { type: 'STEADY_OK' });
  for (let i = 0; i < 3; i++) {
    state = cameraReducer(state, { type: 'STEADY_TICK', dt: 100 });
  }
  assert.strictEqual(state.status, 'LOCKING');

  // Device movement detected mid-lock
  state = cameraReducer(state, { type: 'UNSTEADY' });
  assert.strictEqual(state.status, 'CANCELLED');
  assert.strictEqual(state.statusMessage, 'Too much movement — hold still');

  // When drain animation completes, returns to FOCUSED with pin preserved
  state = cameraReducer(state, { type: 'ANIM_DONE' });
  assert.strictEqual(state.status, 'FOCUSED');
  assert.deepStrictEqual(state.focusPoint, { x: 40, y: 60 });
  assert.strictEqual(state.progress, 0);

  console.log('✔ Test 2 Passed: Lock cancellation retains focus pin for immediate retry.\n');
}

// SCENARIO 3: Undo Reversal Flow
{
  console.log('Test 3: Undo Reversal Flow');
  let state = initialCameraState;
  state = cameraReducer(state, { type: 'TAP_SUBJECT', x: 50, y: 50 });
  state = cameraReducer(state, { type: 'STEADY_OK' });
  for (let i = 0; i < 8; i++) {
    state = cameraReducer(state, { type: 'STEADY_TICK', dt: 100 });
  }
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
  state = cameraReducer(state, { type: 'TAP_SUBJECT', x: 50, y: 50 });
  state = cameraReducer(state, { type: 'STEADY_OK' });
  assert.strictEqual(state.statusMessage, 'Low light — hold a bit longer');

  // At 800ms in low-light, progress is only 800/1200 = 66.6%
  for (let i = 0; i < 8; i++) {
    state = cameraReducer(state, { type: 'STEADY_TICK', dt: 100 });
  }
  assert.strictEqual(state.status, 'LOCKING');
  assert.ok(Math.abs(state.progress - (800 / 1200)) < 0.001);

  // Needs remaining 400ms to complete
  for (let i = 0; i < 4; i++) {
    state = cameraReducer(state, { type: 'STEADY_TICK', dt: 100 });
  }
  assert.strictEqual(state.status, 'CAPTURED');
  assert.strictEqual(state.progress, 1);

  console.log('✔ Test 4 Passed: Low light accurately extends hold time by 1.5x.\n');
}

// SCENARIO 5: Voice Trigger Phrase Validation & Unsteady Guard
{
  console.log('Test 5: Voice Trigger Validation');
  let state = initialCameraState;

  // Unsupported phrase rejected
  state = cameraReducer(state, { type: 'VOICE_TRIGGER', phrase: 'shoot now' });
  assert.strictEqual(state.status, 'IDLE');
  assert.ok(state.statusMessage?.includes('Voice command ignored'));

  // Unsteady rejection
  state = cameraReducer(state, { type: 'VOICE_TRIGGER', phrase: 'Cheese', isSteady: false });
  assert.strictEqual(state.status, 'IDLE');
  assert.ok(state.statusMessage?.includes('Device moving'));

  // Missing/undefined isSteady must also be rejected (P0-05)
  state = cameraReducer(state, { type: 'VOICE_TRIGGER', phrase: 'Cheese' });
  assert.strictEqual(state.status, 'IDLE');
  assert.ok(state.statusMessage?.includes('Device moving'));

  // Valid phrase while steady captures
  state = cameraReducer(state, { type: 'VOICE_TRIGGER', phrase: 'Cheese', isSteady: true });
  assert.strictEqual(state.status, 'CAPTURED');
  assert.strictEqual(state.progress, 1);
  assert.ok(state.statusMessage?.includes('Voice capture'));

  console.log('✔ Test 5 Passed: Voice trigger enforces supported phrase and stillness.\n');
}

// SCENARIO 6: Volume Key Accessibility Fallback & Guards
{
  console.log('Test 6: Volume Key Accessibility Fallback');
  let state = initialCameraState;

  // Volume key while unsteady rejected
  state = cameraReducer(state, { type: 'VOLUME_KEY', isSteady: false });
  assert.strictEqual(state.status, 'IDLE');
  assert.ok(state.statusMessage?.includes('Device moving'));

  // Volume key with undefined isSteady rejected (P0-05)
  state = cameraReducer(state, { type: 'VOLUME_KEY' });
  assert.strictEqual(state.status, 'IDLE');
  assert.ok(state.statusMessage?.includes('Device moving'));

  // Volume key while steady captures
  state = cameraReducer(state, { type: 'VOLUME_KEY', isSteady: true });
  assert.strictEqual(state.status, 'CAPTURED');
  assert.strictEqual(state.progress, 1);

  // Volume key while in REVIEW ignored
  state = cameraReducer(state, { type: 'ANIM_DONE' });
  assert.strictEqual(state.status, 'REVIEW');
  const reviewState = cameraReducer(state, { type: 'VOLUME_KEY', isSteady: true });
  assert.strictEqual(reviewState.status, 'REVIEW');

  console.log('✔ Test 6 Passed: Volume key accessibility fallback verified with guards.\n');
}

// SCENARIO 7: Group Mode Readiness Guards & PROGRESS_COMPLETE restrictions
{
  console.log('Test 7: Group Mode Readiness Guards');
  let state: typeof initialCameraState = {
    ...initialCameraState,
    mode: 'group',
    groupReadyCount: 3,
    groupTotalCount: 4,
  };

  // When only 3 of 4 are ready, PROGRESS_COMPLETE must be rejected
  state = cameraReducer(state, { type: 'PROGRESS_COMPLETE' });
  assert.strictEqual(state.status, 'IDLE'); // Not captured!

  // In Group Mode, VOICE_TRIGGER and VOLUME_KEY must also be blocked when group is not ready (P0-05)
  const blockedVoice = cameraReducer(state, { type: 'VOICE_TRIGGER', phrase: 'Cheese', isSteady: true });
  assert.strictEqual(blockedVoice.status, 'IDLE');
  assert.ok(blockedVoice.statusMessage?.includes('Group not ready'));

  const blockedVol = cameraReducer(state, { type: 'VOLUME_KEY', isSteady: true });
  assert.strictEqual(blockedVol.status, 'IDLE');
  assert.ok(blockedVol.statusMessage?.includes('Group not ready'));

  // In Still Mode, PROGRESS_COMPLETE from IDLE or FOCUSED must be rejected (P0-06)
  let stillState = initialCameraState;
  stillState = cameraReducer(stillState, { type: 'PROGRESS_COMPLETE' });
  assert.strictEqual(stillState.status, 'IDLE'); // Must not capture!

  stillState = cameraReducer(stillState, { type: 'TAP_SUBJECT', x: 50, y: 50 });
  assert.strictEqual(stillState.status, 'FOCUSED');
  stillState = cameraReducer(stillState, { type: 'PROGRESS_COMPLETE' });
  assert.strictEqual(stillState.status, 'FOCUSED'); // Must not capture from FOCUSED in still mode!

  // When 4 of 4 are ready in group mode, PROGRESS_COMPLETE triggers capture
  state = cameraReducer(state, { type: 'SET_GROUP_READY', count: 4 });
  assert.strictEqual(state.groupReadyCount, 4);
  state = cameraReducer(state, { type: 'PROGRESS_COMPLETE' });
  assert.strictEqual(state.status, 'CAPTURED');

  console.log('✔ Test 7 Passed: Group mode requires all faces ready before capture.\n');
}

// SCENARIO 8: Tunable Stillness Sensitivity (Hold Time)
{
  console.log('Test 8: Tunable Hold Time Setting');
  let state = initialCameraState;
  assert.strictEqual(state.baseHoldTime, 800);

  // Custom hold time setting (e.g. 500 ms)
  state = cameraReducer(state, { type: 'SET_HOLD_TIME', holdTimeMs: 500 });
  assert.strictEqual(state.baseHoldTime, 500);

  // Clamped at min (400 ms) and max (1500 ms)
  state = cameraReducer(state, { type: 'SET_HOLD_TIME', holdTimeMs: 200 });
  assert.strictEqual(state.baseHoldTime, 400);

  state = cameraReducer(state, { type: 'SET_HOLD_TIME', holdTimeMs: 2500 });
  assert.strictEqual(state.baseHoldTime, 1500);

  // Preserved across RESET
  state = cameraReducer(state, { type: 'RESET' });
  assert.strictEqual(state.baseHoldTime, 1500);

  console.log('✔ Test 8 Passed: Tunable hold time clamps and persists correctly.\n');
}

// SCENARIO 9: Tap Isolation (Tap NEVER captures alone)
{
  console.log('Test 9: Tap Isolation');
  let state = initialCameraState;
  state = cameraReducer(state, { type: 'TAP_SUBJECT', x: 50, y: 50 });
  assert.strictEqual(state.status, 'FOCUSED');
  assert.strictEqual(state.progress, 0);

  // Additional taps update position but never capture
  state = cameraReducer(state, { type: 'TAP_SUBJECT', x: 80, y: 20 });
  assert.strictEqual(state.status, 'FOCUSED');
  assert.deepStrictEqual(state.focusPoint, { x: 80, y: 20 });
  assert.strictEqual(state.progress, 0);

  console.log('✔ Test 9 Passed: Tap subject exclusively focuses and never triggers capture.\n');
}

// SCENARIO 10: Group Mode Steady Hold Guard (P0-01)
{
  console.log('Test 10: Group Mode Steady Hold & Dynamic Lock Guard');
  let state: typeof initialCameraState = {
    ...initialCameraState,
    mode: 'group',
    groupReadyCount: 3,
    groupTotalCount: 4,
  };

  state = cameraReducer(state, { type: 'TAP_SUBJECT', x: 50, y: 50 });
  assert.strictEqual(state.status, 'FOCUSED');

  // STEADY_OK while group is at 3/4 must be rejected
  state = cameraReducer(state, { type: 'STEADY_OK' });
  assert.strictEqual(state.status, 'FOCUSED');
  assert.ok(state.statusMessage?.includes('Group not ready'));

  // If somehow in LOCKING, STEADY_TICK while group is at 3/4 transitions to CANCELLED
  const lockingState: typeof initialCameraState = {
    ...state,
    status: 'LOCKING',
    progress: 0.5,
  };
  const cancelledOnTick = cameraReducer(lockingState, { type: 'STEADY_TICK', dt: 100 });
  assert.strictEqual(cancelledOnTick.status, 'CANCELLED');

  // Losing group readiness mid-lock transitions to CANCELLED
  const lockingReady: typeof initialCameraState = {
    ...state,
    status: 'LOCKING',
    groupReadyCount: 4,
    progress: 0.5,
  };
  const cancelledOnUnready = cameraReducer(lockingReady, { type: 'SET_GROUP_READY', count: 3 });
  assert.strictEqual(cancelledOnUnready.status, 'CANCELLED');

  // With all 4 ready, STEADY_OK enters LOCKING and STEADY_TICK completes to CAPTURED
  let fullReadyState: typeof initialCameraState = {
    ...initialCameraState,
    mode: 'group',
    groupReadyCount: 4,
    groupTotalCount: 4,
  };
  fullReadyState = cameraReducer(fullReadyState, { type: 'TAP_SUBJECT', x: 50, y: 50 });
  fullReadyState = cameraReducer(fullReadyState, { type: 'STEADY_OK' });
  assert.strictEqual(fullReadyState.status, 'LOCKING');

  // Advance ticks until capture (baseHoldTime = 800ms)
  for (let i = 0; i < 8; i++) {
    fullReadyState = cameraReducer(fullReadyState, { type: 'STEADY_TICK', dt: 100 });
  }
  assert.strictEqual(fullReadyState.status, 'CAPTURED');
  assert.strictEqual(fullReadyState.progress, 1);

  console.log('✔ Test 10 Passed: Group mode steady hold and lock guards verified.\n');
}

// SCENARIO 11: Delta Time Validation in STEADY_TICK (P2-02)
{
  console.log('Test 11: STEADY_TICK Delta Time Validation');
  let state = initialCameraState;
  state = cameraReducer(state, { type: 'TAP_SUBJECT', x: 50, y: 50 });
  state = cameraReducer(state, { type: 'STEADY_OK' });
  assert.strictEqual(state.status, 'LOCKING');
  assert.strictEqual(state.progress, 0);

  // Negative dt must be ignored
  state = cameraReducer(state, { type: 'STEADY_TICK', dt: -100 });
  assert.strictEqual(state.progress, 0);

  // Zero dt must be ignored
  state = cameraReducer(state, { type: 'STEADY_TICK', dt: 0 });
  assert.strictEqual(state.progress, 0);

  // NaN dt must be ignored
  state = cameraReducer(state, { type: 'STEADY_TICK', dt: NaN });
  assert.strictEqual(state.progress, 0);

  // Infinity dt must be ignored
  state = cameraReducer(state, { type: 'STEADY_TICK', dt: Infinity });
  assert.strictEqual(state.progress, 0);

  // Valid positive dt advances progress (clamped to max 100ms per tick)
  state = cameraReducer(state, { type: 'STEADY_TICK', dt: 100 });
  assert.strictEqual(state.progress, 100 / HOLD_TIME_MS);

  // Massive dt (e.g. 5000ms from background tab resume) clamped to max 100ms (100 / 800 = 0.125)
  const resetLock = cameraReducer(initialCameraState, { type: 'TAP_SUBJECT', x: 50, y: 50 });
  const lockFresh = cameraReducer(resetLock, { type: 'STEADY_OK' });
  assert.strictEqual(lockFresh.progress, 0);
  const clampedState = cameraReducer(lockFresh, { type: 'STEADY_TICK', dt: 5000 });
  assert.strictEqual(clampedState.progress, 100 / 800);
  assert.strictEqual(clampedState.status, 'LOCKING');

  console.log('✔ Test 11 Passed: STEADY_TICK invalid dt rejected and massive dt clamped to 100ms.\n');
}

// SCENARIO 12: Comprehensive State Verification
{
  console.log('Test 12: Comprehensive State Machine Invariants');
  let state = initialCameraState;
  assert.strictEqual(state.status, 'IDLE');
  assert.strictEqual(state.progress, 0);

  // Unhandled action returns identical state reference
  const unchanged = cameraReducer(state, { type: 'UNKNOWN_ACTION' as any });
  assert.strictEqual(unchanged, state);

  console.log('✔ Test 12 Passed: Invariants and reference stability verified.\n');
}

// SCENARIO 13: Group Auto-Capture Epoch & Undo Disarm (P1-01 / Phase 1.1)
{
  console.log('Test 13: Group Auto-Capture Epoch & Undo Disarm');
  let state: typeof initialCameraState = {
    ...initialCameraState,
    mode: 'group',
    groupReadyCount: 3,
    groupTotalCount: 4,
  };
  assert.strictEqual(state.groupAutoCaptureArmed, false);

  // Arming epoch: setting count to 4 arms auto-capture
  state = cameraReducer(state, { type: 'SET_GROUP_READY', count: 4 });
  assert.strictEqual(state.groupReadyCount, 4);
  assert.strictEqual(state.groupAutoCaptureArmed, true);

  // Capture completes -> disarms auto-capture
  state = cameraReducer(state, { type: 'PROGRESS_COMPLETE' });
  assert.strictEqual(state.status, 'CAPTURED');
  assert.strictEqual(state.groupAutoCaptureArmed, false);

  // Review -> Saved -> Undo
  state = cameraReducer(state, { type: 'ANIM_DONE' });
  assert.strictEqual(state.status, 'REVIEW');
  state = cameraReducer(state, { type: 'TIMEOUT_REVIEW' });
  assert.strictEqual(state.status, 'SAVED');

  state = cameraReducer(state, { type: 'UNDO' });
  assert.strictEqual(state.status, 'IDLE');
  assert.strictEqual(state.groupAutoCaptureArmed, false);

  // Attempting auto-capture immediately after Undo must be blocked!
  const reCaptureBlocked = cameraReducer(state, { type: 'PROGRESS_COMPLETE' });
  assert.strictEqual(reCaptureBlocked.status, 'IDLE'); // Must remain IDLE, not re-capture!
  assert.strictEqual(reCaptureBlocked.groupAutoCaptureArmed, false);

  // Epoch reset: user changing readiness to 3 keeps it disarmed
  state = cameraReducer(state, { type: 'SET_GROUP_READY', count: 3 });
  assert.strictEqual(state.groupAutoCaptureArmed, false);

  // New readiness epoch: user sets count to 4 re-arms auto-capture
  state = cameraReducer(state, { type: 'SET_GROUP_READY', count: 4 });
  assert.strictEqual(state.groupAutoCaptureArmed, true);
  state = cameraReducer(state, { type: 'PROGRESS_COMPLETE' });
  assert.strictEqual(state.status, 'CAPTURED');

  console.log('✔ Test 13 Passed: Group auto-capture epoch disarmed on capture and through Undo.\n');
}

// SCENARIO 14: MODE_CHANGE during CAPTURED and SAVED is guarded (F1)
{
  console.log('Test 14: Guard MODE_CHANGE during CAPTURED and SAVED');
  let state = initialCameraState;
  state = cameraReducer(state, { type: 'TAP_SUBJECT', x: 50, y: 50 });
  state = cameraReducer(state, { type: 'STEADY_OK' });
  state = cameraReducer(state, { type: 'PROGRESS_COMPLETE' });
  assert.strictEqual(state.status, 'CAPTURED');

  // Attempt MODE_CHANGE during CAPTURED -> must be ignored!
  const stateDuringCaptured = cameraReducer(state, { type: 'MODE_CHANGE', mode: 'group' });
  assert.strictEqual(stateDuringCaptured.status, 'CAPTURED');
  assert.strictEqual(stateDuringCaptured.mode, 'still');
  assert.strictEqual(stateDuringCaptured, state);

  // Transition to REVIEW then SAVED
  state = cameraReducer(state, { type: 'ANIM_DONE' });
  assert.strictEqual(state.status, 'REVIEW');
  state = cameraReducer(state, { type: 'TIMEOUT_REVIEW' });
  assert.strictEqual(state.status, 'SAVED');

  // Attempt MODE_CHANGE during SAVED -> must be ignored!
  const stateDuringSaved = cameraReducer(state, { type: 'MODE_CHANGE', mode: 'doc' });
  assert.strictEqual(stateDuringSaved.status, 'SAVED');
  assert.strictEqual(stateDuringSaved.mode, 'still');
  assert.strictEqual(stateDuringSaved, state);

  // When reset back to IDLE, MODE_CHANGE works as normal
  state = cameraReducer(state, { type: 'RESET' });
  assert.strictEqual(state.status, 'IDLE');
  state = cameraReducer(state, { type: 'MODE_CHANGE', mode: 'group' });
  assert.strictEqual(state.mode, 'group');

  console.log('✔ Test 14 Passed: MODE_CHANGE ignored in CAPTURED and SAVED states.\n');
}

// SCENARIO 15: Payload Validation and Clamping Guards (F19)
{
  console.log('Test 15: Strict Payload Validation and Clamping Guards');
  let state = initialCameraState;

  // 1. TAP_SUBJECT payload validation
  // Non-number, NaN, Infinity must be rejected
  const tapNaN = cameraReducer(state, { type: 'TAP_SUBJECT', x: NaN, y: 50 });
  assert.strictEqual(tapNaN, state);

  const tapInf = cameraReducer(state, { type: 'TAP_SUBJECT', x: 50, y: Infinity });
  assert.strictEqual(tapInf, state);

  const tapStr = cameraReducer(state, { type: 'TAP_SUBJECT', x: '50' as any, y: 50 });
  assert.strictEqual(tapStr, state);

  // Negative and > 100 coordinates clamped to 0..100
  const tapClampedMin = cameraReducer(state, { type: 'TAP_SUBJECT', x: -25, y: -10 });
  assert.deepStrictEqual(tapClampedMin.focusPoint, { x: 0, y: 0 });

  const tapClampedMax = cameraReducer(state, { type: 'TAP_SUBJECT', x: 150, y: 200 });
  assert.deepStrictEqual(tapClampedMax.focusPoint, { x: 100, y: 100 });

  // 2. SET_HOLD_TIME payload validation
  const holdNaN = cameraReducer(state, { type: 'SET_HOLD_TIME', holdTimeMs: NaN });
  assert.strictEqual(holdNaN, state);

  const holdInf = cameraReducer(state, { type: 'SET_HOLD_TIME', holdTimeMs: Infinity });
  assert.strictEqual(holdInf, state);

  const holdLow = cameraReducer(state, { type: 'SET_HOLD_TIME', holdTimeMs: 100 });
  assert.strictEqual(holdLow.baseHoldTime, HOLD_TIME_MIN_MS);

  const holdHigh = cameraReducer(state, { type: 'SET_HOLD_TIME', holdTimeMs: 5000 });
  assert.strictEqual(holdHigh.baseHoldTime, HOLD_TIME_MAX_MS);

  const holdFloat = cameraReducer(state, { type: 'SET_HOLD_TIME', holdTimeMs: 850.4 });
  assert.strictEqual(holdFloat.baseHoldTime, 850);

  // 3. SET_GROUP_READY payload validation
  const groupNaN = cameraReducer(state, { type: 'SET_GROUP_READY', count: NaN });
  assert.strictEqual(groupNaN, state);

  const groupInf = cameraReducer(state, { type: 'SET_GROUP_READY', count: Infinity });
  assert.strictEqual(groupInf, state);

  const groupLow = cameraReducer(state, { type: 'SET_GROUP_READY', count: -5 });
  assert.strictEqual(groupLow.groupReadyCount, 0);

  const groupHigh = cameraReducer(state, { type: 'SET_GROUP_READY', count: 10 });
  assert.strictEqual(groupHigh.groupReadyCount, state.groupTotalCount);

  const groupFloat = cameraReducer(state, { type: 'SET_GROUP_READY', count: 2.7 });
  assert.strictEqual(groupFloat.groupReadyCount, 3);

  // 4. PICK_FRAME payload validation
  // In non-REVIEW state, ignored
  const pickIdle = cameraReducer(state, { type: 'PICK_FRAME', index: 2 });
  assert.strictEqual(pickIdle, state);

  // Transition to REVIEW state
  let reviewState = cameraReducer(state, { type: 'TAP_SUBJECT', x: 50, y: 50 });
  reviewState = cameraReducer(reviewState, { type: 'STEADY_OK' });
  reviewState = cameraReducer(reviewState, { type: 'PROGRESS_COMPLETE' });
  reviewState = cameraReducer(reviewState, { type: 'ANIM_DONE' });
  assert.strictEqual(reviewState.status, 'REVIEW');

  const pickNaN = cameraReducer(reviewState, { type: 'PICK_FRAME', index: NaN });
  assert.strictEqual(pickNaN, reviewState);

  const pickInf = cameraReducer(reviewState, { type: 'PICK_FRAME', index: Infinity });
  assert.strictEqual(pickInf, reviewState);

  const pickLow = cameraReducer(reviewState, { type: 'PICK_FRAME', index: -3 });
  assert.strictEqual(pickLow.selectedFrameIndex, 0);

  const pickHigh = cameraReducer(reviewState, { type: 'PICK_FRAME', index: 20 });
  assert.strictEqual(pickHigh.selectedFrameIndex, CANDIDATE_FRAMES - 1);

  const pickFloat = cameraReducer(reviewState, { type: 'PICK_FRAME', index: 4.8 });
  assert.strictEqual(pickFloat.selectedFrameIndex, 5);

  console.log('✔ Test 15 Passed: Strict payload validation and clamping guards verified.\n');
}

console.log('ALL 15 STATE MACHINE TESTS PASSED SUCCESSFULLY! 🎉');
