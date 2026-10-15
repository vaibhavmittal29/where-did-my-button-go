# STILL — Comprehensive Repository Audit & Repair Handoff for Claude

**Repository:** https://github.com/vaibhavmittal29/where-did-my-button-go  
**Project:** STILL — “Hold still to capture. Rewind to choose.”  
**Challenge:** VinnovateIT, VIT Vellore — UI/UX Subdomain Round 1  
**Branch inspected:** `main`  
**Snapshot inspected:** commit `1c9ac62e861d58eff4ffe3bcabac060091c70bb9` (2026-10-15)  
**Repository tree:** 118 entries at the time of inspection  
**Purpose:** Give Claude a single, detailed, actionable record of known code defects, unimplemented features, documentation contradictions, test gaps, accessibility concerns, and required verification steps.

> **Important verification boundary:** This report is based on source files, repository metadata, documentation, asset inventory, and inspection of the onboarding export. The reviewer did **not** independently execute `npm ci`, `npm run build`, `npm test`, browser automation, or the PDF export in the current environment. Therefore, no build/test pass is asserted here. Findings are classified as source-confirmed, test gaps, or requirements needing runtime verification. Claude must verify the current HEAD because the repository may have changed after this snapshot.

---

## 0. Instructions for Claude — read before changing code

You are acting as the senior React/TypeScript engineer, interaction designer, accessibility reviewer, QA engineer, and documentation maintainer for this repository.

### Mission

1. Inspect the **current** repository and working-tree state before editing. Confirm branch, current commit, and whether this report matches the current source.
2. Read `docs/PLAN.md` fully. It is the project’s primary specification. Read the interaction spec, README, current audit report, QA report, final checklist, and relevant source files before making changes.
3. Reproduce each finding below. Mark each one **CONFIRMED**, **ALREADY FIXED**, **NOT REPRODUCIBLE**, or **NEEDS RUNTIME VERIFICATION** based on evidence from the current code. Do not copy old findings blindly if code has changed.
4. Fix verified defects; implement missing core requirements that belong to the current static front-end prototype. Do not scope-creep into accounts, a backend, analytics, or an unrelated redesign.
5. Add meaningful regression tests before or alongside the fixes. Tests must assert the expected state, not simply print a success message.
6. Run the clean install, build, unit tests, end-to-end tests, reduced-motion test, and export workflow. Inspect actual generated screenshots and the PDF.
7. Update documentation only after verification. Do not keep inaccurate “100% ready” claims or claim tests passed unless the current command actually passed.
8. Finish with a finding-by-finding table, changed-files summary, exact commands/results, screenshots and export checks, remaining prototype limitations, and a truthful readiness verdict.

---

## 1. Executive summary

### Overall verdict

**NOT YET READY FOR FINAL SUBMISSION VERIFICATION.** The concept is strong, the source tree is substantial, the static deliverables exist, and recent commits improved the state machine, differentiated the Moment Strip image assets, and completed the Markdown case study. However, source review still indicates defects in cancellation handling, motion-loop lifecycle, group-mode timing, voice/fallback capture guards, event propagation, regression tests, and design-token consistency. QA/checklist documents also contain stale counts and overstated completion claims.

---

## 2. P0 — Critical source and interaction defects

- P0-01 — Viewfinder clicks can bubble from controls and trigger focus
- P0-02 — CANCELLED state does not automatically recover in the live UI
- P0-03 — The locking animation effect restarts whenever steadiness changes
- P0-04 — Group Mode steady-hold timer can be continuously cancelled
- P0-05 — Voice and accessibility fallback can directly bypass the normal capture sequence
- P0-06 — PROGRESS_COMPLETE permits capture from inappropriate states/modes
- P0-07 — Movement E2E test contains a false-positive path
- P0-08 — Asset download script overwrites distinct Moment Strip frames

---

## 3. P1 — Major incomplete or incorrect behaviours

- P1-01 — Spacebar release restores a “steady” value by default
- P1-02 — Focus timeout is specified but not connected to the live state flow
- P1-03 — Capture cooldown constant is not enforced
- P1-04 — Haptic feedback is triggered based on steadiness, not whether capture was accepted
- P1-05 — Keyboard fallback can fire when a non-form custom control has focus
- P1-06 — Sensor algorithm/fallback and sensor status are incomplete
- P1-07 — Static Viewfinder controls are inert or only decorative
- P1-08 — Static Moment Strip Save always resets selection to frame 3
- P1-09 — Static Moment Strip dismiss/share controls are not implemented
- P1-10 — Several decorative controls in static screens imply real camera features
- P1-11 — Undefined CSS tokens cause style declarations to be discarded
- P1-12 — Focus-visible styling may be suppressed for IconButton
- P1-13 — ModeCarousel uses tab roles without a complete tab pattern
- P1-14 — The global viewport metadata disables zoom
- P1-15 — Live gallery thumbnail is not a semantic, keyboard-operable control
- P1-16 — Root-relative asset and navigation paths conflict with the relative Vite base
- P1-17 — Undo’s secondary timeout is not stored/cleaned up
- P1-18 — Group Mode readiness is only a deterministic simulation
- P1-19 — No actual speech-recognition mechanism exists

---

## 4. P2 — Script portability, assets and export issues

- P2-01 — E2E and reduced-motion scripts assume a server is already running
- P2-02 — Hard-coded personal Windows copy destinations remain
- P2-03 — scripts/compose-group.mjs references a missing input asset and relative cwd paths
- P2-04 — Screenshot helper uses 2× scale while the primary export requirement is 3×
- P2-05 — PDF exporter does not explicitly set landscape orientation
- P2-06 — Moment image-generation workflow is not robustly integrated
- P2-07 — Flow export depends on an external CDN
- P2-08 — Missing Vite favicon reference
- P2-09 — Primary export output validation is insufficient
- P2-10 — No GitHub Actions CI workflow was present in the inspected tree

---

## 5. Actual capabilities that are NOT implemented (must be disclosed)

1. Actual live camera preview
2. Actual rolling camera buffer
3. Sharpness / blur ranking
4. Real face detection / eye-open or blink detection
5. Real voice capture from microphone
6. Physical volume-button support
7. Real gallery/file persistence
8. Actual share flow
9. Actual lens/camera flip
10. Real low-light detection
11. Real document edge detection/scanning
12. Real haptic support on all platforms
13. Figma project file
14. User research/usability study

---

## 6. P2-DOC — Documentation claims and consistency defects

- P2-DOC-01 — Audit and checklist status is overstated/stale
- P2-DOC-02 — Case study has contradictory descriptions of simulation and real functionality
- P2-DOC-03 — Interaction spec claims are stronger than implementation
- P2-DOC-04 — Asset licensing text for derivatives is unclear
- P2-DOC-05 — Figma guide contains stale tokens and unsupported accuracy claim
- P2-DOC-06 — QA report claims more accessibility testing than its scripts prove
- P2-DOC-07 — Pitch/interview text risks overclaiming “fully verified” behaviour
- P2-DOC-08 — Changelog not synchronised with latest audit/fix work
- P2-DOC-09 — README’s WCAG badge can imply certification
