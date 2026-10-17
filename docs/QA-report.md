# Quality Assurance & Accessibility Audit Report — STILL Camera

**Project:** STILL — "Hold still to capture. Rewind to choose."  
**Specification:** Round 1 UI/UX Subdomain — *Where did my button go? Rethink the Interaction*  
**Date:** October 2026  
**Auditor:** Automated Test Suite + Design System Spec Inspection  
**Standard:** Contrast Ratios evaluated against WCAG 2.2 Benchmarks (4.5:1 / 7:1), Touch Target Sizing (Apple HIG 44×44px)

---

## 1. Executive Summary

STILL replaces the discrete mechanical shutter button with continuous physical sensor intent (stillness detection) and a post-capture rewind buffer safety net. Removing the primary capture button introduces critical ergonomics, accessibility, and discoverability challenges. This QA report documents the verification performed across all 5 screens, base design components, state machine transitions, and edge cases to ensure the interaction model is calm, reliable, inclusive, and failsafe.

---

## 2. Touch Target & Sizing Audit (WCAG 2.2 2.5.5 / 2.5.8 & Apple HIG)

Every interactive element in STILL enforces a minimum bounding box of **44 × 44 CSS pixels**, designed to align with Apple Human Interface Guidelines and WCAG 2.2 target size guidelines (2.5.8 Level AA minimum 24×24 px, 2.5.5 enhanced 44×44 px; verified via automated Playwright bounding-box assertions across mobile and desktop viewports):

| Component | Target Element | Rendered Dimensions | Standard Applied | Status |
|---|---|---|---|---|
| **IconButton** | Flash, Settings, Lens Flip | 44 × 44 px | 44 × 44 px (Apple HIG) | **PASS** |
| **Gallery Thumbnail** | Recent capture preview | 44 × 44 px | 44 × 44 px (Apple HIG) | **PASS** |
| **Mode Carousel** | Mode Tabs (`Still`, `Group`, `Doc`) | 72 × 44 px min | 44 × 44 px (Apple HIG) | **PASS** |
| **Toast Undo Button** | "Undo" discard action | 56 × 44 px min | 44 × 44 px (Apple HIG) | **PASS** |
| **Moment Strip Cards** | 7 candidate frame buttons | 54 × 76 px | 44 × 44 px (Apple HIG) | **PASS** |
| **Onboarding CTA** | "Got it / Try STILL" button | 342 × 48 px | 44 × 44 px (Apple HIG) | **PASS** |
| **STILL Lab Controls** | Reset, Mute, Mode buttons | 140 × 44 px min | 44 × 44 px (Apple HIG) | **PASS** |

---

## 3. Contrast & Legibility Audit (WCAG 2.2 AA / AAA)

All colors are strictly governed by CSS variables defined in `src/styles/tokens.css`. Contrast ratios are mathematically computed against dark backdrops (`--bg: #0b0b0f`, `--surface-1: #15151c`):

| Token Pair | Foreground | Background | Contrast Ratio | Minimum Benchmark (4.5:1) | Enhanced Benchmark (7:1) |
|---|---|---|---|---|---|
| `--text` on `--bg` | `#F5F5F7` | `#0B0B0F` | **18.0 : 1** | PASS | PASS |
| `--text` on `--surface-1` | `#F5F5F7` | `#15151C` | **15.7 : 1** | PASS | PASS |
| `--accent` on `--bg` | `#FFB020` | `#0B0B0F` | **10.7 : 1** | PASS | PASS |
| `--accent` on `--surface-1` | `#FFB020` | `#15151C` | **9.3 : 1** | PASS | PASS |
| `--success` on `--bg` | `#3DDC97` | `#0B0B0F` | **11.1 : 1** | PASS | PASS |
| `--danger` on `--bg` | `#FF6B5E` | `#0B0B0F` | **7.0 : 1** | PASS | PASS (Large) / AA |
| `--text-dim` on `--bg` | `#A3A3B2` | `#0B0B0F` | **7.9 : 1** | PASS | PASS |
| `--text-dim` on `--surface-1` | `#A3A3B2` | `#15151C` | **6.9 : 1** | PASS | PASS (Large) / AA |

> **Vignette Protection:** Top and bottom photographic scrims (`rgba(11, 11, 15, 0.85)` gradient) ensure microcopy, mode carousel pills, and status chips remain legible across diverse photographic backdrops.

---

## 4. Keyboard Navigation & Assistive Technology (A11y)

### 4.1 Focus Indicators
- Every interactive element features an explicit `:focus-visible` rule in `src/styles/global.css`:
  ```css
  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
  ```
- Focus order follows a logical hierarchy: Top header controls → Viewfinder focal anchor → Mode carousel → Gallery & Lens switchers.

### 4.2 ARIA Live Region Announcements
To support screen reader users (VoiceOver, TalkBack, NVDA), a live status element (`aria-live="polite"`) announces camera state changes:
- `IDLE`: *"Camera ready. Tap viewfinder to focus and hold steady to capture."*
- `FOCUSED`: *"Subject focused. Hold phone steady to lock."*
- `LOCKING`: *"Locking capture. X percent."*
- `CAPTURED`: *"Photo captured. Reviewing suggested moment in Moment Strip."*
- `REVIEW`: *"Reviewing frame X of 7. Autosaving."*
- `SAVED`: *"Photo saved (simulated). Undo available."*
- `CANCELLED`: *"Too much movement — hold still."*

### 4.3 Lock Ring Semantics
The `LockRing` component implements standard progressbar semantics:
```html
<div role="progressbar" 
     aria-label="Capture stability progress" 
     aria-valuenow="60" 
     aria-valuemin="0" 
     aria-valuemax="100">
```

### 4.4 Reduced Motion Compliance (`prefers-reduced-motion`)
When the user has enabled reduced motion in their OS:
1. `useReducedMotion()` automatically detects the media query.
2. Continuous circular arc sweep animations are halted.
3. LockRing displays a discrete, high-contrast stepped percentage badge (`33%`, `66%`, `100%`).
4. Camera shake recoil and slide transitions are disabled in CSS (`animation-duration: 0.01ms`).

---

## 5. Edge Cases & Safety Net Verification Matrix

All failure modes were verified via unit state tests (`scripts/test-machine.ts`) and browser automation (`scripts/test-interactive.mjs`):

| Edge Case | User Condition | STILL System Response | User Microcopy | Verification |
|---|---|---|---|---|
| **1. Hand Jitter / Movement** | Phone shakes mid-lock | Ring drains, pin stays for instant retry | *"Too much movement — hold still"* | Verified in Playwright (Recoil + Drain) |
| **2. Low Light Scene** | Dim environment detected | Hold time dynamically increases 1.5× (1200ms) | *"Low light — hold a bit longer"* | Verified in STILL Lab panel |
| **3. Idle Dwell / Inaction** | User holds still without tapping | After 1.5s of stillness, subtle prompt guides intent | *"Tap subject to lock"* | Verified in Dwell timer test |
| **4. Accidental Tap** | Single tap on screen | Places focus pin; never captures without stillness | (Focus pin appears empty) | Verified in state machine |
| **5. High-Speed Movement** | Subject dashes across frame | 3s rolling buffer captures 7 frames; best frame preselected | *"Pick your favourite moment"* | Verified in Moment Strip |
| **6. Group Member Not Ready** | Someone blinks or looks away | Face chips show missing member; capture holds until ready | *"3 of 4 ready"* (Tara blinking) | Verified in Screen 5 & Interactive mode |
| **7. Alternate Triggers (Tap Tremor Fallback)** | User wants to trigger capture without touching screen | Physical key ('C' key in prototype) or voice trigger triggers capture after steady hold | *"Accessibility capture (Simulated volume key)"* | Verified via key listener & A11y trigger |
| **8. Unwanted Capture** | Photo auto-saved accidentally | 5s countdown toast provides 1-tap Undo deletion | *"Saved · Undo"* → *"Photo removed"* | Verified in Undo loop test |
| **9. Buttonless Discoverability** | First-time user opens camera | 3-card onboarding demo + pulsing ghost ring in idle | *"No shutter. Just stillness."* | Verified on `/` & `/?screen=onboarding` |

---

## 6. Real Automated Test Suite Execution Output

The automated test suite runs via `npm test` (`tsx scripts/test-machine.ts && node scripts/test-interactive.mjs && node scripts/test-reduced-motion.mjs && node scripts/test-figma.mjs && node scripts/sweep.cjs && node scripts/count-d4.mjs`):

```text
--- RUNNING CAMERA STATE MACHINE SANITY TESTS ---

Test 1: Normal Capture Flow
✔ Test 1 Passed: Complete normal capture lifecycle verified.

Test 2: Cancelled Lock Flow
✔ Test 2 Passed: Lock cancellation retains focus pin for immediate retry.

Test 3: Undo Reversal Flow
✔ Test 3 Passed: Saved photo successfully discarded by Undo.

Test 4: Low-Light Multiplier
✔ Test 4 Passed: Low light accurately extends hold time by 1.5x.

Test 5: Voice Trigger Validation
✔ Test 5 Passed: Voice trigger enforces supported phrase and stillness.

Test 6: Volume Key Accessibility Fallback
✔ Test 6 Passed: Volume key accessibility fallback verified with guards.

Test 7: Group Mode Readiness Guards
✔ Test 7 Passed: Group mode requires all faces ready before capture.

Test 8: Tunable Hold Time Setting
✔ Test 8 Passed: Tunable hold time clamps and persists correctly.

Test 9: Tap Isolation
✔ Test 9 Passed: Tap subject exclusively focuses and never triggers capture.

Test 10: Group Mode Steady Hold & Dynamic Lock Guard
✔ Test 10 Passed: Group mode steady hold and lock guards verified.

Test 11: STEADY_TICK Delta Time Validation
✔ Test 11 Passed: STEADY_TICK invalid dt rejected and massive dt clamped to 100ms.

Test 12: Comprehensive State Machine Invariants
✔ Test 12 Passed: Invariants and reference stability verified.

Test 13: Group Auto-Capture Epoch & Undo Disarm
✔ Test 13 Passed: Group auto-capture epoch disarmed on capture and through Undo.

Test 14: Guard MODE_CHANGE during CAPTURED and SAVED
✔ Test 14 Passed: MODE_CHANGE ignored in CAPTURED and SAVED states.

Test 15: Strict Payload Validation and Clamping Guards
✔ Test 15 Passed: Strict payload validation and clamping guards verified.

ALL 15 STATE MACHINE TESTS PASSED SUCCESSFULLY! 🎉
Testing Phase 5 Interactive Camera Scenarios...
Starting Vite local server on port 5173...
✓ Vite local server ready on port 5173
✓ Scenario 0 Passed: Interactive screen loaded with Viewfinder & DemoPanel
✓ Touch Target Size Verification: All 9 DemoPanel buttons meet >= 44x44px target standard
Auditing touch targets across routes (live, onboarding, idle, locking, moments, group, kit, settings dialog) at 390x844 and 1200x950...
✓ Comprehensive Touch Target Size Audit Passed across all routes, dialogs, and viewports (>= 44x44px)
State after tap: State:LOCKING
✓ Scenario 1 Passed: Tap -> Steady Hold -> Auto-Capture -> Moment Strip Review
✓ Scenario 2 Passed: Moment Strip allows frame swapping
Waiting for autosave countdown (approx 4s)...
✓ Scenario 3a Passed: Autosave completed, gallery updated, and showed Saved · Undo toast
✓ Scenario 3b Passed (F7): Undo successfully discarded photo and restored previous gallery thumbnail
✓ Scenario 4 Passed: Sudden movement cancels lock and drains ring with "Too much movement" feedback
✓ Scenario 5a Passed: Group Mode active with 3 of 4 ready and Tara blinking
✓ Scenario 5b Passed: Voice trigger properly guarded by group readiness, then captures when all 4 ready
✓ Scenario 5c Passed (P0-01): Group Mode with 3 of 4 ready strictly blocks steady hold capture
✓ Scenario 5d Passed (1.1 & F6): Group Mode auto-capture disarmed through Undo with distinct UI chip; no re-capture while steady
✓ Scenario 5e Passed (1.2): Group readiness is single-sourced in reducer without desync
✓ Scenario 5f Passed (F1): Mode carousel disabled during SAVED state; mode switch blocked and Undo succeeds
Running Scenario 6 (F16): Static route click sweep & console error monitoring...
✓ Scenario 6 Passed (F16): Static route click sweep verified with 0 console errors

🎉 ALL PHASE 5 INTERACTION SCENARIOS PASSED WITH FLYING COLORS!
Testing Phase 6 Prefers-Reduced-Motion Compliance...
Starting Vite local server on port 5173...
✓ Vite local server ready on port 5173
LockRing data-reduced-motion: true
LockRing aria-valuenow under reduced motion: 33%
✓ Reduced motion test passed (stepped ring + capture -> review)!
🧪 Running Figma Plugin Static Verification Suite...
  ✓ Files exist
  ✓ code.js passed Node.js JavaScript syntax check
  ✓ manifest.json is valid
  ✓ code.js uses correct millisecond timeout (timeout: 800)
  ✓ ui.html contains complete message protocol handlers
  ✓ code.js contains MomentStrip, font fallback hierarchy, and idempotent tagging
🎉 Figma plugin static verification PASSED!

Scanning 57 files for forbidden/unsupported claims (case-insensitive with unit fixtures)...

✔ 0 forbidden claims found! Repository documentation and source code are clean and truthful.
D4 word count: 180 words (Limit: <= 200 words)
✔ D4 word count verified within <= 200 words limit.
```

---

## 7. Conclusion & Deliverable Sign-Off

The STILL Camera application satisfies all functional and non-functional requirements. The prototype is accessible, responsive, contrast-verified, and resilient to real-world edge cases.

---

## 8. Prototype Limitations (Simulated vs Real)

This project is a browser-based UI/UX prototype created for the VinnovateIT design challenge. To maintain technical integrity, the following hardware/native capabilities are simulated in the browser:

- **Camera stream:** Browser simulation using an optimized high-resolution portrait image with dynamic CSS filters (not raw hardware sensor frames).
- **Steadiness sensor:** Web `DeviceMotionEvent` acceleration heuristic (filtered magnitude) or on-screen slider/keyboard simulator, not true multi-axis gyroscope angular velocity.
- **Moment Strip:** 7 transformed visual variations derived from a single portrait to demonstrate the rewind UI/UX pattern, not 7 distinct frames from a hardware circular ring buffer.
- **Group detection:** Simulated multi-face tracking bounding boxes and readiness state machine, not on-device computer vision or face-mesh ML models.
- **Speech recognition:** Simulated button triggers and keyword hooks, not the native Web Speech API.
- **Persistence:** In-memory reactive state and transient toast dismissal, not persistent disk or IndexedDB gallery photo storage.
