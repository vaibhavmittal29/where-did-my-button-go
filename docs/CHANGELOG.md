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
