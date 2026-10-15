# Quality Assurance & Accessibility Audit Report — STILL Camera

**Project:** STILL — "Hold still to capture. Rewind to choose."  
**Specification:** Round 1 UI/UX Subdomain — *Where did my button go? Rethink the Interaction*  
**Date:** October 2026  
**Auditor:** Automated Test Suite + Design System Spec Inspection  
**Standard:** WCAG 2.1 Level AA / AAA Compliance, Touch Target Sizing (WCAG 2.5.5 / 2.5.8)

---

## 1. Executive Summary

STILL replaces the discrete mechanical shutter button with continuous physical sensor intent (stillness detection) and a post-capture rolling buffer safety net. Removing the primary capture button introduces critical ergonomics, accessibility, and discoverability challenges. This QA report documents the rigorous verification performed across all 5 screens, base design components, state machine transitions, and edge cases to ensure the interaction model is calm, reliable, inclusive, and failsafe.

---

## 2. Touch Target & Sizing Audit (WCAG 2.5.5 / 2.5.8)

Every touch target in STILL has been audited to guarantee a minimum bounding box of **44 × 44 CSS pixels**, preventing mis-taps on handheld mobile viewports:

| Component | Target Element | Rendered Dimensions | Minimum Standard | Status |
|---|---|---|---|---|
| **IconButton** | Flash, Settings, Lens Flip | 44 × 44 px | 44 × 44 px | **PASS** (100%) |
| **Gallery Thumbnail** | Recent capture preview | 44 × 44 px | 44 × 44 px | **PASS** (100%) |
| **Mode Carousel** | Mode Tabs (`Still`, `Group`, `Doc`) | 72 × 44 px min | 44 × 44 px | **PASS** (100%) |
| **Toast Undo Button** | "Undo" discard action | 56 × 44 px min | 44 × 44 px | **PASS** (100%) |
| **Moment Strip Cards** | 7 candidate frame buttons | 54 × 76 px | 44 × 44 px | **PASS** (100%) |
| **Onboarding CTA** | "Got it / Try STILL" button | 342 × 48 px | 44 × 44 px | **PASS** (100%) |
| **STILL Lab Controls** | Reset, Mute, Mode buttons | 140 × 44 px min | 44 × 44 px | **PASS** (100%) |

---

## 3. Contrast & Legibility Audit (WCAG 2.1 AA / AAA)

All colors are strictly governed by CSS variables defined in `src/styles/tokens.css`. Contrast ratios were measured against deep dark backdrops (`--bg: #0b0b0f`, `--surface-1: #16161c`):

| Token Pair | Foreground | Background | Contrast Ratio | WCAG AA (4.5:1) | WCAG AAA (7:1) |
|---|---|---|---|---|---|
| `--text` on `--bg` | `#f5f5f7` | `#0b0b0f` | **17.8 : 1** | PASS | PASS |
| `--accent` on `--bg` | `#ffb020` | `#0b0b0f` | **10.4 : 1** | PASS | PASS |
| `--success` on `--bg` | `#3ddc97` | `#0b0b0f` | **12.2 : 1** | PASS | PASS |
| `--danger` on `--bg` | `#ff4d4d` | `#0b0b0f` | **5.4 : 1** | PASS | N/A (UI state) |
| `--text-muted` on `--surface-1` | `#8e8e93` | `#16161c` | **5.1 : 1** | PASS | AA Large |
| Glass chip over photos | `#f5f5f7` | Glass + Scrim | **> 12 : 1** | PASS | PASS |

> **Vignette Protection:** Top and bottom photographic scrims (`rgba(11, 11, 15, 0.85)` gradient) ensure microcopy, mode carousel pills, and battery/time indicators remain legible regardless of whether the camera is pointed at high-key whiteboards or low-key night scenes.

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
To support screen reader users (VoiceOver, TalkBack, NVDA), an assertive live status element continuously broadcasts camera state changes:
- `IDLE`: *"Camera ready. Tap viewfinder to focus and hold steady to capture."*
- `FOCUSED`: *"Subject focused. Hold phone steady to lock."*
- `LOCKING`: *"Locking capture. X percent."*
- `CAPTURED`: *"Photo captured. Reviewing best moment in Moment Strip."*
- `REVIEW`: *"Reviewing frame X of 7. Autosaving."*
- `SAVED`: *"Photo saved to gallery. Undo available."*
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

All 9 failure modes specified in PLAN.md Section 6.5 were verified via unit state tests (`scripts/test-machine.ts`) and browser automation (`scripts/test-interactive.mjs`):

| Edge Case | User Condition | STILL System Response | User Microcopy | Verification |
|---|---|---|---|---|
| **1. Hand Jitter / Movement** | Phone shakes mid-lock | Ring instantly drains, pin stays for instant retry | *"Too much movement — hold still"* | Verified in Playwright (Recoil + Drain) |
| **2. Low Light Scene** | Dim environment detected | Hold time dynamically increases 1.5× (1200ms) | *"Low light — hold a bit longer"* | Verified in STILL Lab panel |
| **3. Idle Dwell / Inaction** | User holds still without tapping | After 1.5s of stillness, subtle prompt guides intent | *"Tap what matters"* | Verified in Dwell timer test |
| **4. Accidental Tap** | Single tap on screen | Places focus pin; never captures without stillness | (Focus pin appears empty) | Verified in state machine |
| **5. High-Speed Movement (Pets/Kids)** | Subject dashes across frame | 3s rolling buffer captures 7 frames; AI picks sharpest | *"Pick your favourite moment"* | Verified in Moment Strip |
| **6. Group Member Not Ready** | Someone blinks or looks away | Face chips show missing member; capture holds until ready | *"3 of 4 ready"* (Tara blinking) | Verified in Screen 5 & Interactive mode |
| **7. Motor Impairment / Tremor** | User cannot hold steady | Physical Volume Key or 'C' key provides instant capture | *"Accessibility capture (Volume key)"* | Verified via key listener & A11y trigger |
| **8. Unwanted Capture** | Photo auto-saved accidentally | 5s countdown toast provides 1-tap Undo deletion | *"Saved · Undo"* → *"Photo removed"* | Verified in Undo loop test |
| **9. Buttonless Discoverability** | First-time user opens camera | 3-card onboarding demo + pulsing ghost ring in idle | *"No shutter. Just stillness."* | Verified on `/` & `/?screen=onboarding` |

---

## 6. Conclusion & Deliverable Sign-Off

The STILL Camera application satisfies all functional and non-functional requirements outlined for Phase 7. The prototype is accessible, responsive, contrast-verified, and resilient to real-world edge cases. Ready to proceed to **Phase 8 (Export Deliverables & Case Study PDF)**.
