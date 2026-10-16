# TRIAGE REPORT — STILL REPOSITORY AUDIT (HEAD: 5da83ff)

**Repository:** https://github.com/vaibhavmittal29/where-did-my-button-go  
**Inspected HEAD SHA:** `5da83ffd92d38aa038d8257176f287b62e447fb8`  
**Audit Source:** `STILL_REPOSITORY_AUDIT_2026-10-16.md`  
**Date:** October 16, 2026  
**Auditor:** Senior Engineer / Accessibility Reviewer / QA Lead  

---

## 1. Quick Verification Command Results

| Command | Exit Code | Verified Output Summary |
|---|:---:|---|
| `npm ci` | **0** | Added 83 packages, audited 84 packages in 25s, 0 vulnerabilities. |
| `npm run build` | **0** | `tsc && vite build` succeeded in 1.55s. 1,625 modules transformed cleanly. |
| `npm test` | **0** | 9/9 state machine unit tests passed, all 6 Puppeteer E2E interaction scenarios passed, reduced motion compliance test passed. |

---

## 2. Audit Findings Triage Matrix (Against Current HEAD `5da83ff`)

| ID | Severity | Finding Summary | Status | File & Line Evidence | Action Plan |
|---|---|---|:---:|---|---|
| **P0-01** | 🔴 Blocker | Group readiness bypassed in normal hold flow | **CONFIRMED** | `src/state/cameraMachine.ts#L107`, `L126` (`STEADY_OK` and `STEADY_TICK` do not check `groupReadyCount < groupTotalCount`) | Centralize `canCapture(state)` in reducer for all capture pathways (`STEADY_OK`, `STEADY_TICK`, `PROGRESS_COMPLETE`, `VOICE_TRIGGER`, `VOLUME_KEY`). Add unit + E2E regression test. |
| **P1-01** | 🟡 Major | Voice/volume fallback lacks duration tracking | **CONFIRMED** | `src/screens/InteractiveCameraScreen.tsx#L340`, `L360` (checks snapshot steadiness without requiring 1s stability interval) | Track continuous stillness interval (`steadySinceRef`), require stability duration before triggering capture, and give no capture haptics on rejected triggers. |
| **P1-02** | 🟡 Major | "Best Moment (Sharpest)" overstates implementation | **CONFIRMED** | `src/components/MomentStrip/index.tsx#L27`, `src/screens/MomentStripScreen.tsx#L85`, `src/screens/CaseStudyScreen.tsx#L250` | Replace "Best Moment (Sharpest)" with "Suggested (illustrative)" across all screens, docs, and pitch. Explicitly disclose fixed index 3. |
| **P1-03** | 🟡 Major | DemoPanel buttons below 44px touch target | **CONFIRMED** | `src/components/DemoPanel/DemoPanel.module.css#L106`, `src/components/DemoPanel/index.tsx#L86` (action buttons are 32px, header buttons are 24px) | Enforce 44px min-height for interactive DemoPanel buttons. Add Playwright bounding-box assertions for all interactive controls. |
| **P1-04** | 🟡 Major | Moment Strip does not fit 7 thumbnails on 390px viewport | **CONFIRMED** | `src/components/MomentStrip/MomentStrip.module.css#L30`, `export/screens/screen-04-moments.png` (cards exceed 390px width) | Adjust card width/gap to fit all 7 thumbnails at 390×844 (e.g. 44px cards, 4px gap, 14px padding ≈ 360px). Re-export screen-04. |
| **P1-05** | 🟡 Major | Static screen controls are inert or route to demo | **CONFIRMED** | `src/screens/ViewfinderIdleScreen.tsx#L74`, `src/screens/LockingScreen.tsx#L250`, `src/screens/GroupModeScreen.tsx#L177` | Render non-functional decorative controls as illustrations (`aria-hidden="true"`, pointer-events none) or clearly mark as prototype simulations. |
| **P1-06** | 🟡 Major | Sensor status overstates availability | **CONFIRMED** | `src/components/DemoPanel/index.tsx#L143`, `src/hooks/useSteadiness.ts#L60` (labels "Real Sensor (Active)" on toggle before events arrive) | Separate "Motion sensor requested — waiting for readings" from "Receiving readings", add timeout, rename from Gyro to Motion Sensor. |
| **P1-07** | 🟡 Major | DemoPanel controls lack bounding box & keyboard QA | **CONFIRMED** | `scripts/test-interactive.mjs` (no bounding box assertions or focus verification for demo controls) | Add browser assertions for touch target size, keyboard focus, and input field shortcut isolation. |
| **P1-08** | 🟡 Major | Save/Undo implies persistent device gallery | **CONFIRMED** | `src/screens/MomentStripScreen.tsx#L22`, `src/screens/ComponentKitScreen.tsx#L174` (toast says "Saved to gallery") | Change to "Saved (simulated)", label save action as "Save (prototype)", clarify prototype scope. |
| **P2-01** | 🔵 Minor | Dwell hint timer restarts on every sensor update | **CONFIRMED** | `src/screens/InteractiveCameraScreen.tsx#L58-L68` (`useEffect` depends on `[state.status, steadiness]`) | Use stable ref-based countdown timer so steady sensor readings do not restart countdown. Add test with fluctuating steady values. |
| **P2-02** | 🔵 Minor | Constants duplicated and not centrally driving capture | **CONFIRMED** | `src/screens/InteractiveCameraScreen.tsx#L244`, `L314` (hardcoded 4000ms, 600ms instead of importing constants) | Wire `STEADY_THRESHOLD`, `GROUP_STEADY_HOLD_MS`, `AUTOSAVE_MS`, `UNDO_WINDOW_MS`, `BUFFER_SECONDS`, `COOLDOWN_MS`. Enforce cooldown at all capture entry points. Reject negative/non-finite dt. |
| **P2-03** | 🔵 Minor | Server helper spawns shell process causing orphan Vite | **CONFIRMED** | `scripts/server-helper.mjs#L20` (spawns with shell: true; top-level kill leaves child processes) | Spawn without shell, manage process tree, ensure guaranteed cleanup in `finally` blocks for all scripts. |
| **P2-04** | 🔵 Minor | Reduced-motion test only checks data attribute | **CONFIRMED** | `scripts/test-reduced-motion.mjs#L35` (only asserts `data-reduced-motion === 'true'`) | Assert stepped progress percentages (33%, 66%, 100%) and verify full capture -> review -> save/undo flow under reduced motion. |
| **P2-05** | 🔵 Minor | Legacy screenshot helpers have hardcoded Windows paths | **CONFIRMED** | `scripts/screenshot-kit.mjs#L15`, `screenshot-screens.mjs#L19`, `screenshot-test.mjs#L12` | Remove legacy redundant setup scripts; update README and CHANGELOG. |
| **P2-06** | 🔵 Minor | User flow export depends on CDN and masks failures | **CONFIRMED** | `scripts/export-user-flow.mjs#L18`, `L135` (loads Mermaid from CDN, catches error and exits 0 if old files exist) | Resolve script-relative paths, fail with non-zero exit on error, add local rendering instructions, re-export user flow. |
| **P2-07** | 🔵 Minor | Screenshot exports have fixed sleep timing | **CONFIRMED** | `scripts/export-screens.mjs#L55` (uses waitForTimeout while animations may run) | Disable transitions/animations during screenshot capture (`animations: 'disabled'`), wait for fonts and images for deterministic output. |
| **P2-08** | 🔵 Minor | Case study PDF has underutilized page area | **CONFIRMED** | `export/case-study.pdf`, `src/screens/CaseStudyScreen.tsx` (10 portrait pages with large empty margins) | Rework print pagination, avoid empty pages, keep typography legible. |
| **P2-09** | 🔵 Minor | Root-relative favicon breaks under subpath hosting | **CONFIRMED** | `index.html#L7` (`href="/favicon.svg"` is domain-relative) | Use base-relative favicon URL and test with subpath base. |
| **P2-10** | 🔵 Minor | `compose-group.mjs` legacy script missing `cand-3.jpg` | **CONFIRMED** | `scripts/compose-group.mjs` (untracked asset dependency) | Delete legacy script as group-campus.jpg is already checked in. |
| **P2-11** | 🔵 Minor | `fetch-scenes.mjs` requires network and resolves CWD | **CONFIRMED** | `scripts/fetch-scenes.mjs#L4` (resolves `public/scenes` from CWD) | Make script-relative, network-optional, document as maintenance utility. |
| **P2-12** | 🔵 Minor | Figma guide claims 100% match and has local paths | **CONFIRMED** | `docs/figma-build-guide.md#L6` ("100% 1:1 match") | Label guide as design blueprint, fix token values and remove file:/// links. |
| **DOC-01** | 🔵 Minor | Overclaiming language in README and docs | **CONFIRMED** | `README.md`, `AUDIT-REPORT.md`, `docs/FINAL-CHECKLIST.md`, `docs/case-study.md` | Remove "100%", "production-ready", "zero-dependency", "WCAG AAA certified" claims; replace with honest prototype disclosures. |

---

## 3. Swept Terms Audit Results (Prose & Claims Hits)

| Target Term | Total Hits | Findings & Context |
|---|:---:|---|
| `"2.2°"` | **0** | Clean. No unsourced angular tremor stats. |
| `"3.8°"` | **0** | Clean. No unsourced angular tremor stats. |
| `"40%"` | **0** | Clean. No unsourced percentage stats. |
| `"43%"` | **0** | Clean. No unsourced percentage stats. |
| `"215"` | **0** | Clean. No unsourced millisecond claims. |
| `"1.2°/s"` | **0** | Clean. No unsourced velocity numbers. |
| `"90 frames"` | **0** | Clean. No fabricated buffer size. |
| `"180 years"` | **0** | Clean. No historical camera hyperbole. |
| `"zero tap tremor"` | **0** | Clean. Replaced by calm physical reasoning. |
| `"gyroscope"` | **3** | `DemoPanel/index.tsx`, `docs/case-study.md`, `docs/interaction-spec.md` -> To be replaced with "Motion sensor (accelerometer heuristic)". |
| `"AI"` | **4** | Appears in `PLAN.md` specification notes and `CHANGELOG.md` -> To be cleaned in docs pass. |
| `"computer vision"` | **0** | Clean. No computer vision claims. |
| `"sharpest"` | **12** | Appears in `CaseStudyScreen.tsx`, `case-study.md`, `D4-design-decisions.md`, `interaction-spec.md`, `pitch-60s.md`, `README.md` -> **MUST BE REPLACED WITH "Suggested (illustrative)"**. |
| `"production-ready"` | **1** | `docs/case-study.md:227` -> To be removed. |
| `"zero-dependency"` | **1** | `docs/case-study.md:227` -> To be removed. |
| `"WCAG AAA"` | **1** | `docs/QA-report.md:37` -> To be qualified as calculated token contrast ratio, not blanket certification. |
| `"WCAG AA"` | **15** | Appears in `CaseStudyScreen.tsx`, `FINAL-CHECKLIST.md`, `QA-report.md`, `README.md` -> To be clarified as calculated color contrast and touch target targets, not formal certification. |
| `"WCAG Accessible"` | **1** | `src/screens/HeroCompositeScreen.tsx:331` -> To be replaced with "Contrast reviewed". |
| `"100%"` (claims) | **6** | `docs/figma-build-guide.md:6`, `docs/FINAL-CHECKLIST.md:7`, `AUDIT-REPORT.md:8`, `AUDIT-REPORT.md:107`, `TRIAGE.md:105`, `TRIAGE.md:141` -> To be replaced with truthful descriptions. (43 other hits are standard CSS `width: 100%` or 100% progress). |
| `"Saved to gallery"` | **4** | `ComponentKitScreen.tsx:174`, `MomentStripScreen.tsx:22`, `figma-build-guide.md:150`, `L227` -> To be replaced with "Saved (simulated)". |
| `"fully verified"` | **0** | Clean. No claims of full verification. |

---

## 4. Execution Plan

1. **Stage 1 (Correctness & Honest UI):**
   - P0-01: Centralize capture guard in `canCapture(state)` in `cameraMachine.ts`. Block normal steady-hold capture when `mode === 'group' && groupReadyCount < groupTotalCount`. Add unit regression test in `test-machine.ts` and E2E scenario in `test-interactive.mjs`.
   - P1-01: Track continuous stability duration for voice and volume fallback triggers in `InteractiveCameraScreen.tsx`. Give no capture haptics on rejected triggers.
   - P2-02: Enforce constants (`STEADY_THRESHOLD`, `GROUP_STEADY_HOLD_MS`, `AUTOSAVE_MS`, `UNDO_WINDOW_MS`, `BUFFER_SECONDS`, `COOLDOWN_MS`) centrally. Reject negative/non-finite deltas.
   - P2-01: Stabilize dwell timer in `InteractiveCameraScreen.tsx` so continuous sensor readings do not restart it.
   - P1-03 & P1-07: Ensure all DemoPanel interactive buttons have $\ge 44$px rendered height. Add bounding box and keyboard focus tests.
   - P1-04: Adjust Moment Strip styling so all 7 frames fit visually at 390px.
   - P1-02: Replace "Best Moment (Sharpest)" with "Suggested (illustrative)" across all code and docs.
   - P1-05 & P1-08: Mark static controls as illustrations/prototype, change "Saved to gallery" to "Saved (simulated)".
   - P1-06: Clarify motion sensor status ("Requested - waiting for readings" vs "Receiving readings").
   - Run tests, commit, push, check CI.
2. **Stage 2 (Scripts, Exports, CI):**
   - P2-03: Harden `server-helper.mjs` (spawn without shell, robust process tree kill, try/finally browser cleanup).
   - P2-04: Enhance `test-reduced-motion.mjs` (assert stepped percentages 33/66/100 and flow completion).
   - P2-05, P2-10, P2-11: Delete redundant legacy scripts (`screenshot-kit`, `screenshot-screens`, `screenshot-test`, `compose-group`).
   - P2-06: Make `export-user-flow.mjs` fail on error, resolve script-relative, update Mermaid source.
   - P2-07: Disable animations in export script for deterministic screenshots.
   - P2-08: Rework case study PDF layout for optimal pagination and readability.
   - P2-09: Update favicon in `index.html` to base-compatible URL.
   - Add console error and route accessibility tests across multiple viewports.
   - Run tests, export, commit, push, check CI.
3. **Stage 3 (Docs Truth Pass):**
   - Move old `CLAUDE_AUDIT_REPORT_STILL.md`, `AUDIT-REPORT.md`, `TRIAGE.md` to `docs/history/` with historical headers.
   - Update `README.md`, `docs/QA-report.md`, `docs/FINAL-CHECKLIST.md`, `docs/case-study.md`, `CaseStudyScreen.tsx`, `HeroCompositeScreen.tsx`, `docs/interaction-spec.md`, `docs/pitch-60s.md`, `docs/CREDITS.md`, `docs/design-system.md`, `docs/figma-build-guide.md`, `docs/D1-problem.md` ($\le 150$ words), `docs/D4-design-decisions.md` ($\le 200$ words), and `docs/CHANGELOG.md`.
   - Confirm zero unsupported hits in sweep.
   - Commit, push, verify CI.
4. **Stage 4:** Wait for user's explicit "Go Figma".
