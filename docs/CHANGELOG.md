# STILL: Development Changelog & Progression Log

This document records the step-by-step design, engineering, and verification history of the STILL camera submission for the VinnovateIT UI/UX Round 1 Challenge (*"Where did my button go? Rethink the Interaction"*).

---

## Commit History & Milestones

- **Phase 0 — Project Setup & Tooling** (`0cf64cf`)
  - Initialized Vite + React 19 + TypeScript template.
  - Setup Playwright Chromium environment for visual verification and testing.
  - Created initial file tree structure and configuration.

- **Phase 1 — Problem Framing & Specification** (`23deed0`)
  - Drafted Deliverable D1 problem statement analyzing the 5 historic jobs of the shutter.
  - Authored interaction specification defining the continuous stillness intent paradigm.

- **Phase 2 — State Machine Architecture & User Flow** (`c0f7d0c`)
  - Implemented 6-state finite state machine in `src/state/cameraMachine.ts`.
  - Authored automated unit test suite (`scripts/test-machine.ts`).
  - Generated vector user flow diagram (`docs/D2-user-flow.mmd` & `export/user-flow.svg`).

- **Phase 3 — Design System & Component Library** (`8509238`)
  - Built darkroom color tokens in `src/styles/tokens.css` with WCAG AA/AAA compliance.
  - Implemented core molecules: `LockRing`, `GlassChip`, `IconButton`, `Toast`, `ModeCarousel`.
  - Added component catalog preview route (`/?screen=kit`).

- **Phase 4 — 5 High-Fidelity UI Screens** (`7be9ad2`, `977cea2`)
  - Implemented all 5 screens in `src/screens/` with deterministic URL routing.
  - Integrated campus scene for Group Mode with multi-face status tracking.

- **Phase 5 — Interactive Prototype & STILL Lab** (`2443f75`)
  - Implemented live camera simulation with steadiness detection hook (`useSteadiness`).
  - Added simulated 3-second rewind buffer with 7 candidate frames (`MomentStrip`).
  - Built desktop demonstration inspector panel with real-time controls.

- **Phase 6 — Sensory Feedback & Reduced Motion** (`16f8b6e`)
  - Integrated Web Audio synthetic haptic clicks and shutter audio ticks.
  - Built full `prefers-reduced-motion` compliance with stepped percentage indicators.

- **Phase 7 — Accessibility Audit & Ergonomics** (`65beedd`)
  - Enforced 44×44px minimum touch targets (Apple HIG) across all actionable elements.
  - Integrated `aria-live="polite"` screen-reader live region.
  - Documented physical key and voice trigger fallbacks in QA report.

- **Phase 8 — High-Resolution Exports & Case Study PDF** (`fe24b79`)
  - Built automated Playwright export script (`scripts/export-screens.mjs`).
  - Exported all screens at 1170×2532 px (3× Retina), panoramic hero composite (2400×1350 px), and A4 case study PDF.

- **Phase 9 — Figma Replication Blueprint** (`8649f12`)
  - Authored complete Figma build guide with layer-by-layer layout instructions and token mapping.

- **Phase 10 — Calibration & Audit Resolution** (`main`)
  - Unified all timings to single source of truth in `src/state/constants.ts`.
  - Replaced D4 design decisions with approved 190-word concise rationale.
  - Replaced all contrast-failing `#6E6E80` text with `#A3A3B2` (7.89:1 AAA).
  - Re-exported all screen assets and case study PDF cleanly.

- **Phase 11 — Complete Audit Repair & Submission Hardening**
  - **Stage 0 (Triage):** Complete triage of all findings from `CLAUDE_AUDIT_REPORT_STILL.md`, extra sweep for unsourced claims, contrast verification, and creation of `TRIAGE.md`.
  - **Stage 1 (Tier 1: P0 Capture Blockers):** Resolved tap event bubbling, added `CANCELLED` auto-recovery timer (800ms), decoupled locking loop from steadiness re-renders via `steadinessRef`, conditioned group mode on boolean steadiness, added strict state guards on voice and volume inputs in `cameraMachine.ts`, preserved distinct moment frames in `fetch-scenes.mjs`, and expanded unit test suite to 9 tests (`835c2bf`).
  - **Stage 2 (Tier 2: P1 UX & Accessibility):** Fixed spacebar release dropping to moving state (0.35), implemented `accelerationIncludingGravity` delta fallback for mobile browsers, connected `TIMEOUT_FOCUS_MS` (6000ms) and `COOLDOWN_MS` (600ms), guarded haptic triggers, filtered keyboard listeners, converted all gallery thumbnails to semantic `<button>` elements, upgraded `ModeCarousel` to full WAI-ARIA tab pattern with roving tabindex and arrow navigation, removed viewport scaling locks for WCAG 1.4.4, created branded SVG favicon, implemented `src/utils/assetPath.ts` for relative subpath hosting, cleaned up undo timers, and added simulated environment disclosures (`b98f765`).
  - **Stage 3 (Tier 3: P2 Script Portability & CI):** Built `scripts/server-helper.mjs` for autonomous Vite server detection and spawning, removed hardcoded personal Windows paths with safe fallbacks, resolved missing `cand-3.jpg` handling in `compose-group.mjs`, added pure Node PNG dimension validator asserting 1170×2532 and 2400×1350, configured explicit A4 portrait PDF generation with `preferCSSPageSize: true`, and created `.github/workflows/ci.yml` running typecheck, build, test suite, and export pipeline (`e164930`).
  - **Stage 4 (Tier 4: Documentation Synchronization & Deliverable Sign-Off):** Synchronized `docs/QA-report.md` with real 9-test suite outputs, updated `docs/figma-build-guide.md` tokens, verified all deliverables and word counts, and verified all exports.

- **Phase 12 — Verified Audit Resolution & Full Hardening (Audit 2026-10-16)**
  - **Stage 1 (Correctness & Honest UI):** Fixed Group Mode lock gating with centralized `canCapture(state)` guard in `cameraMachine.ts`; prevented 3/4 group ready from ever triggering capture; enforced 800ms continuous stillness duration requirement on voice & volume inputs via `steadySinceRef`; stabilized dwell timer; added non-positive `dt` validation; enforced 44×44px Apple HIG touch targets on DemoPanel buttons; compacted Moment Strip to 44px flex-basis with 6px gaps fitting 390px viewports without horizontal clipping; honest UI disclosures on suggested moments and simulated hardware controls (`44caf43`).
  - **Stage 2 (Scripts, Exports & CI Resilience):** Direct Node execution of Vite in `server-helper.mjs` with process tree cleanup via `serverProcess.unref()` and `process.exit(0)`, resolving CI pipeline timeouts (1m37s green run); expanded `test-reduced-motion.mjs` with discrete stepped ring assertions; pruned obsolete screenshot scripts; re-exported Retina 3× screens, panoramic composite, and A4 PDF (`c87833b`).
  - **Stage 3 (Documentation Integrity & Historical Archive):** Archived historical superseded reports to `docs/history/`; executed comprehensive truth pass removing unsourced claims (such as unvalidated sharpness superlatives, unverified gallery persistence claims, and fabricated sensor figures); verified D1 (148 words) and D4 (191 words) limits; synchronized test logs with real 12 unit tests and 6 browser interaction scenarios.

- **Phase 13 — Comprehensive Multi-Phase Audit Resolution & Hardening (F1–F19)**
  - **Phase 1 (P1 High-Priority Fixes: F1–F4):**
    - **F1:** Mode carousel switching blocked during `CAPTURED` and `SAVED` states in both state machine and UI (`7bd66af`).
    - **F2:** Enforced $\ge 44\times 44\text{px}$ touch targets across all routes (live, onboarding, idle, locking, moments, group, kit, settings dialog) and scoped accessibility claims honestly (`e16f8d6`).
    - **F3:** Added dedicated "Prototype Limitations" section to Case Study PDF and presentation screens, resolving relative asset paths (`f3cb3ab`).
    - **F4:** Eliminated overclaims on hero composite banner; expanded claim scan sweep (`9a2c54e`).
  - **Phase 2 (P2 State & UI Logic Hardening: F5–F17):**
    - **F5:** Derived `remainingHoldSec` and dynamic low-light chip directly from `getEffectiveHoldTime()` in `DemoPanel/index.tsx` and `InteractiveCameraScreen.tsx` (`91bfde9`).
    - **F6:** Differentiated Group Mode status chip between armed and disarmed-complete states; corrected `handleUndo` reset logic (`c35f66b`).
    - **F7:** Restored previous gallery thumbnail on `UNDO` and reset in `handleReset` (`ba0d87d`).
    - **F8:** Clarified Suggested frame is fixed illustrative candidate index 3 in `README.md`, `docs/case-study.md`, and `docs/interaction-spec.md` (`ceb85fd`).
    - **F9:** Tightened Figma plugin face node matching to exact `Face: Aarav` in `scripts/figma-plugin/code.js` (`b8fcfe7`).
    - **F10:** Framed Figma plugin generator as layout scaffold/baseline in `docs/figma-bridge.md` with relative links (`73f9c3c`).
    - **F11:** Generated `export/MANIFEST.json` with SHA-256 checksums, byte sizes, and dimensions for all export assets (`2dad6a7`).
    - **F12:** Verified superseded headers in `docs/history/` and aligned documentation test counts (`2395e6c`).
    - **F13:** Enforced D4 word limit ($\le 200$ words, exactly 180 words) and added automated verification via `scripts/count-d4.mjs` (`90377ae`).
    - **F14:** Clarified Unsplash license details and visual derivative framing in `docs/CREDITS.md` (`349ee10`).
    - **F15:** Expanded claim scanner `scripts/sweep.cjs` with case-insensitive search and test fixtures (`03a8abf`).
    - **F16:** Audited static route interactive elements with `aria-disabled="true"` and added Playwright Scenario 6 static route click sweep with console error monitoring (`d3c96c2`).
    - **F17:** Updated `docs/QA-report.md` with real execution logs across all test suites (`140f98f`).
  - **Phase 3 (CI Infrastructure & Payload Validation: F18–F19):**
    - **F18:** Upgraded and secured GitHub Actions workflows with least-privilege permissions and verified v4 action suite (`2a7cd04`).
    - **F19:** Enforced strict payload validation and boundary clamping for `TAP_SUBJECT`, `SET_HOLD_TIME`, `SET_GROUP_READY`, `PICK_FRAME`, and `STEADY_TICK` in `cameraMachine.ts`; expanded state machine unit tests to 15 tests (`cf32009`).

