# TRIAGE AUDIT REPORT — STILL: "Hold still to capture. Rewind to choose."

> **Audit Date:** October 15, 2026  
> **Repository:** https://github.com/vaibhavmittal29/where-did-my-button-go  
> **Challenge:** VinnovateIT (VIT Vellore) UI/UX Subdomain Round 1 — *Where Did My Button Go?*  
> **Branch Inspected:** `main`  
> **HEAD Commit Inspected:** `1c9ac62e861d58eff4ffe3bcabac060091c70bb9`  
> **Differ from 1c9ac62:** No (0 commits ahead/behind, clean tree)  
> **Initial Build & Typecheck:** `npm run build` PASS (0 errors, 1.63s), `npx tsc --noEmit` PASS (0 errors)  
> **Live Server Status:** Vite v6.4.4 active on `http://localhost:5173/` (0 console errors across all 9 routes)

---

## 1. Summary of Stage 0 Verification

Every finding from `CLAUDE_AUDIT_REPORT_STILL.md` was verified against the actual source files and execution runtime. The audit hypotheses are overwhelmingly **CONFIRMED**: despite claims in `AUDIT-REPORT.md` that all issues were resolved, the actual source code retains critical state machine stalls, event bubbling bugs, animation loop teardowns, timer cancellations, accessibility regressions, broken asset pipelines, and undefined CSS variables.

---

## 2. Complete Finding-by-Finding Verification Table

### 2.1 P0 — Critical Source and Interaction Defects

| Finding ID | Title | Verified Status | Exact File & Line Evidence | Technical Summary |
|---|---|---|---|---|
| **P0-01** | Viewfinder click bubbling | **CONFIRMED** | `src/screens/InteractiveCameraScreen.tsx#L110-L121`, `L355-L357` | `handleViewfinderTap` is attached to the parent container `<div ref={viewfinderRef} onClick={handleViewfinderTap}>` without target filtering or stopping propagation. Clicking header/footer controls dispatches `TAP_SUBJECT` to button coordinates. |
| **P0-02** | CANCELLED auto-recovery | **CONFIRMED** | `src/screens/InteractiveCameraScreen.tsx#L167-L185`, `src/state/cameraMachine.ts#L157-L167` | In `cameraMachine.ts`, `ANIM_DONE` is required to transition `CANCELLED -> FOCUSED`. In `InteractiveCameraScreen.tsx`, `ANIM_DONE` is only dispatched on `CAPTURED`. Movement stalls the camera in `CANCELLED` indefinitely until manual re-tap. |
| **P0-03** | Locking loop restart on steadiness | **CONFIRMED** | `src/screens/InteractiveCameraScreen.tsx#L133-L164` | `useEffect` for the `LOCKING` RAF loop includes `steadiness` in its dependency array. On sensor updates (or slider adjustments), the loop is torn down and restarted, resetting `unsteadySinceRef.current = null` every frame. |
| **P0-04** | Group Mode hold timer cancellation | **CONFIRMED** | `src/screens/InteractiveCameraScreen.tsx#L252-L274` | `useEffect` for group mode capture includes `steadiness` in dependencies. Any fluctuation clears `groupHoldTimerRef.current`, preventing the 600ms hold timer from completing on real sensors. |
| **P0-05** | Voice / fallback capture guards | **CONFIRMED** | `src/state/cameraMachine.ts#L227-L233`, `L252-L258` | Guards check `if (action.isSteady === false)`. If `action.isSteady` is `undefined`, it captures immediately without requiring `action.isSteady === true`. Also skips group readiness checks in group mode. |
| **P0-06** | `PROGRESS_COMPLETE` state constraints | **CONFIRMED** | `src/state/cameraMachine.ts#L142-L155` | `PROGRESS_COMPLETE` permits transition to `CAPTURED` directly from `IDLE` and `FOCUSED` in standard still mode, bypassing the progressive locking duration. |
| **P0-07** | Movement E2E test false-positive | **CONFIRMED** | `scripts/test-interactive.mjs#L117-L121` | Test logs `Shake state feedback: State updated` if `'Too much movement'` is missing instead of asserting failure. Never validates that `state.status === 'CANCELLED'` or that the ring drained. |
| **P0-08** | Asset script overwriting moments | **CONFIRMED** | `scripts/fetch-scenes.mjs#L41-L47` | Script copies `portrait-subject.jpg` directly over `moment-0.jpg` through `moment-6.jpg`, destroying the distinct canvas burst frames. |

---

### 2.2 P1 — Major Incomplete or Incorrect Behaviours

| Finding ID | Title | Verified Status | Exact File & Line Evidence | Technical Summary |
|---|---|---|---|---|
| **P1-01** | Spacebar release restores steady value | **CONFIRMED** | `src/hooks/useSteadiness.ts#L8`, `L14`, `L49` | Default `baseValueRef.current` is `0.88` (> 0.7 steady). Releasing spacebar restores `baseValueRef.current` (0.88), failing to trigger unsteadiness. |
| **P1-02** | Focus timeout not connected to live flow | **CONFIRMED** | `src/screens/InteractiveCameraScreen.tsx` (missing dispatch), `src/state/constants.ts#L12` | `TIMEOUT_FOCUS_MS = 3000` exists, but no `setTimeout` dispatches `TIMEOUT_FOCUS`. Camera stays focused indefinitely. |
| **P1-03** | Capture cooldown unenforced | **CONFIRMED** | `src/state/constants.ts#L11` | `COOLDOWN_MS = 600` is defined in constants but unreferenced in machine transitions or UI handlers. |
| **P1-04** | Haptic triggered on rejected actions | **CONFIRMED** | `src/screens/InteractiveCameraScreen.tsx#L276-L295` | `handleVolumeKeyTrigger` and `handleVoiceTrigger` trigger `triggerHaptic('capture')` even if the reducer rejected the transition (e.g. while in `REVIEW` or `SAVED`). |
| **P1-05** | Keyboard fallback fires on custom controls | **CONFIRMED** | `src/screens/InteractiveCameraScreen.tsx#L300` | Checks only `['INPUT', 'TEXTAREA'].includes(target.tagName)`. Fails to ignore `SELECT`, `BUTTON`, `[contenteditable]`, or `[role="button"]`. |
| **P1-06** | Sensor algorithm missing gravity fallback | **CONFIRMED** | `src/hooks/useSteadiness.ts#L112-L116` | If `event.acceleration` is null/unavailable (common on Android Chrome), comment notes fallback to `accelerationIncludingGravity`, but code simply returns early. |
| **P1-07** | Static Viewfinder controls inert | **CONFIRMED** | `src/screens/ViewfinderIdleScreen.tsx#L71`, `L77` | Header icon buttons lack `onClick` handlers or descriptive prototype labels. |
| **P1-08** | Static Moment Strip Save resets to frame 3 | **CONFIRMED** | `src/screens/MomentStripScreen.tsx#L166` | `onClick` executes `window.location.href = '/?screen=moments&selected=3&saved=1'`, resetting user's active choice to frame 3. |
| **P1-09** | Static Moment Strip dismiss/share inert | **CONFIRMED** | `src/screens/MomentStripScreen.tsx#L76`, `L102` | Discard (`X`) and Share buttons have no `onClick` handlers. |
| **P1-10** | Decorative controls imply real hardware | **CONFIRMED** | `src/screens/ViewfinderIdleScreen.tsx`, `src/screens/GroupModeScreen.tsx` | Lens switch (`RotateCcw`), flash (`Zap`), and face boxes lack explicit visual or aria disclaimers that they are prototype simulations. |
| **P1-11** | Undefined CSS tokens | **CONFIRMED** | `src/screens/InteractiveCameraScreen.tsx#L519, L521, L543`, `src/components/DemoPanel/DemoPanel.module.css#L8, L14, L27, L57`, `src/components/LockRing/LockRing.module.css#L80` | Usages of `var(--border)`, `var(--space-5)`, `var(--text-muted)`, `var(--font-body)`, `var(--font-display)`. None exist in `tokens.css`. Browser discards declarations. |
| **P1-12** | Focus-visible styling suppressed | **CONFIRMED** | `src/components/IconButton/IconButton.module.css#L19` | Specifies `outline: none;` with no `:focus-visible` replacement. Violates WCAG 2.4.7. |
| **P1-13** | ModeCarousel incomplete tab pattern | **CONFIRMED** | `src/components/ModeCarousel/index.tsx#L24-L47` | Uses `role="tablist"` and `role="tab"` but lacks arrow key navigation, roving `tabIndex`, and references nonexistent `aria-controls` targets. |
| **P1-14** | Global viewport metadata disables zoom | **CONFIRMED** | `index.html#L6` | `user-scalable=no, maximum-scale=1.0` is active in `index.html`, violating WCAG 1.4.4 Resize Text. |
| **P1-15** | Live gallery thumbnail not semantic/operable | **CONFIRMED** | `src/screens/InteractiveCameraScreen.tsx#L808-L828` | Gallery preview is rendered as `<div onClick={...}>` without `role="button"`, `tabIndex`, or keyboard handlers. |
| **P1-16** | Root-relative URLs conflict with relative Vite base | **CONFIRMED** | `vite.config.ts#L6`, `src/screens/*.tsx` | `vite.config.ts` sets `base: './'`, while app code hardcodes absolute navigation (`/?screen=...`) and asset paths (`/scenes/...`), breaking GitHub Pages deployments. |
| **P1-17** | Undo secondary timeout not tracked/cleaned | **CONFIRMED** | `src/screens/InteractiveCameraScreen.tsx#L316-L319` | `setTimeout` inside `handleUndo` is unassigned to a ref and not cleared on unmount. |
| **P1-18** | Group Mode is deterministic simulation | **CONFIRMED** | `src/screens/InteractiveCameraScreen.tsx`, `src/screens/GroupModeScreen.tsx` | Face tracking and blink status are simulated hardcoded bounds. Must be explicitly documented as prototype simulation. |
| **P1-19** | Voice recognition is simulated | **CONFIRMED** | `src/components/DemoPanel/index.tsx`, `src/screens/InteractiveCameraScreen.tsx` | Voice triggers are triggered via UI simulation buttons, not a Web Speech API listener. Must be explicitly documented. |

---

### 2.3 P2 — Script Portability, Assets and Export Issues

| Finding ID | Title | Verified Status | Exact File & Line Evidence | Technical Summary |
|---|---|---|---|---|
| **P2-01** | Test scripts assume dev server is running | **CONFIRMED** | `scripts/test-interactive.mjs#L37`, `scripts/test-reduced-motion.mjs#L26` | Scripts attempt direct `page.goto('http://localhost:5173/')` without verifying server availability or launching Vite. |
| **P2-02** | Hard-coded personal Windows paths | **CONFIRMED** | `scripts/test-interactive.mjs#L10`, `scripts/test-reduced-motion.mjs#L10`, `scripts/screenshot-screens.mjs#L19` | Hardcoded `C:/Users/vaibh/.gemini/antigravity/brain/...` fallback path causes errors in non-author environments. |
| **P2-03** | Missing input asset in compose-group | **CONFIRMED** | `scripts/compose-group.mjs#L14` | Reads `public/scenes/cand-3.jpg` which does not exist, causing fatal `ENOENT`. |
| **P2-04** | Screenshot helper uses 2× scale | **CONFIRMED** | `scripts/screenshot-screens.mjs#L16` | Sets `deviceScaleFactor: 2` (780×1688) instead of the required 3× Retina factor (1170×2532). |
| **P2-05** | PDF exporter lacks explicit orientation | **CONFIRMED** | `scripts/export-screens.mjs#L110` | Uses `format: 'A4'` without explicit landscape/portrait flag. |
| **P2-06** | Moment generation workflow disconnected | **CONFIRMED** | `package.json#L13-L22` | `generate-moments.mjs` is not wired into `npm run export` or `npm run build`. |
| **P2-07** | Flow export depends on external CDN | **CONFIRMED** | `scripts/export-user-flow.mjs#L18` | Injects `https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js`, failing in offline environments. |
| **P2-08** | Broken favicon reference | **CONFIRMED** | `index.html#L5` | `<link rel="icon" href="/vite.svg" />` targets a file that does not exist in `public/`. |
| **P2-09** | Export output validation insufficient | **CONFIRMED** | `scripts/export-screens.mjs` | Logs file sizes but does not validate that exported PNG dimensions match exactly 1170×2532. |
| **P2-10** | Missing GitHub Actions CI workflow | **CONFIRMED** | `.github/workflows` (nonexistent) | Repository lacks an automated CI workflow to run linting, typechecking, and test suites on push. |

---

### 2.4 Section 5 — Actual Capabilities That Are NOT Implemented (Prototype Disclosures)

| Item | Capability | Current State | Required Truthful Disclosure |
|---|---|---|---|
| **5.1** | Live camera hardware preview | Simulated with curated high-res campus scenes | Disclose as prototype simulation; real app would use `MediaDevices.getUserMedia` |
| **5.2** | Rolling camera video buffer | Simulated with 7 canvas-generated burst moments | Disclose as 7-frame pre-capture buffer simulation |
| **5.3** | Automated blur / sharpness ranking | Pre-selected frame index 3 with Sparkles badge | Disclose as simulated best-frame algorithm |
| **5.4** | Face / eye-open / blink detection | Hardcoded 4-face coordinate grid (Tara blinking) | Disclose as UI heuristic simulation |
| **5.5** | Real-time speech recognition | Triggered via STILL Lab interactive buttons | Disclose as simulated Web Speech API fallback |
| **5.6** | Hardware volume key interception | Mapped to keyboard `'C'` / `'c'` keydown | Disclose as desktop accessibility mapping |
| **5.7** | Persistent gallery storage | In-memory React state with 5s Undo | Disclose as prototype session state |
| **5.8** | Native OS Share Sheet | Static decorative button with feedback toast | Disclose as prototype UI action |
| **5.9** | Camera lens / sensor flip | Static decorative toggle button | Disclose as prototype UI action |
| **5.10** | Environmental low-light sensor | Simulated via STILL Lab toggle (1.5× hold) | Disclose as lux threshold simulation |
| **5.11** | Document edge detection / unskew | Static whiteboard photo | Disclose as document mode layout demonstration |
| **5.12** | Cross-platform physical haptics | `navigator.vibrate` with Web Audio click fallback | Disclose as progressive enhancement (Android native, Web Audio on iOS/Desktop) |
| **5.13** | Figma project file | Code-first design tokens & CSS system | Disclose as code-first implementation |
| **5.14** | Formal lab user research study | Heuristic evaluations & interaction specifications | Disclose as design specifications and usability heuristics |

---

### 2.5 Section 6 — P2-DOC: Documentation Claims & Consistency Defects

| Finding ID | Title | Verified Status | Evidence & Resolution Target |
|---|---|---|---|
| **P2-DOC-01** | Audit report claims "ALL FINDINGS RESOLVED (100%)" | **CONFIRMED** | `AUDIT-REPORT.md#L8` falsely asserts 100% resolution. Must be updated to reflect real status truthfully. |
| **P2-DOC-02** | Case study mixes simulation and real claims | **CONFIRMED** | `src/screens/CaseStudyScreen.tsx` and `docs/D4-design-decisions.md` must clearly label simulations. |
| **P2-DOC-03** | Interaction spec timings and claims | **CONFIRMED** | `docs/interaction-spec.md` mentions rolling buffer and hardware haptics without prototype disclaimer. |
| **P2-DOC-04** | Asset licensing disclosure | **CONFIRMED** | `docs/CREDITS.md` needs exact Unsplash URLs and open-source licenses for all assets. |
| **P2-DOC-05** | Stale tokens in Figma/design docs | **CONFIRMED** | Docs reference old tokens (`--font-body`, `--text-muted`) that mismatch `tokens.css`. |
| **P2-DOC-06** | QA report claims unverified accessibility | **CONFIRMED** | `docs/QA-report.md` asserts WCAG AAA certification without qualifying specific criteria. |
| **P2-DOC-07** | Pitch text risks overclaiming | **CONFIRMED** | `docs/pitch-60s.md` must use truthful prototype terminology. |
| **P2-DOC-08** | Changelog missing audit repair history | **CONFIRMED** | Create `docs/CHANGELOG.md` with transparent progression. |
| **P2-DOC-09** | README WCAG badge | **CONFIRMED** | README badge should state "WCAG 2.2 AA Evaluated" rather than uncertified claims. |

---

## 3. Extra Sweep Results

### 3.1 Mathematical WCAG Contrast Calculations
Calculated using W3C Relative Luminance ($L_1 / L_2$):
- **#F5F5F7 on #0B0B0F:** **18.04 : 1** (Passes AAA normal & large)
- **#FFB020 on #0B0B0F:** **10.74 : 1** (Passes AAA normal & large)
- **#3DDC97 on #0B0B0F:** **11.12 : 1** (Passes AAA normal & large)
- **#FF6B5E on #0B0B0F:** **7.03 : 1** (Passes AAA normal & large)
- **#A3A3B2 on #0B0B0F:** **7.89 : 1** (Passes AAA normal & large)
- **#6E6E80 on #0B0B0F:** **3.93 : 1** (**FAILS** WCAG AA 4.5:1 for normal text! Only passes large text 3.0:1)
- **#6E6E80 on #15151C:** **3.64 : 1** (**FAILS** WCAG AA 4.5:1 for normal text!)
- **#8E8E93 on #16161C:** **5.53 : 1** (Passes AA normal, fails AAA normal)
- **#0B0B0F on #FFB020:** **10.74 : 1** (Passes AAA normal & large)

> **Contrast Fix Target:** Replace any remaining instances of `#6E6E80` with `--text-dim` (`#A3A3B2`, 7.89:1) for all body/caption text.

### 3.2 Undefined CSS Tokens Discovered
- `--border` (used in `InteractiveCameraScreen.tsx` for panel dividers; should be `rgba(255, 255, 255, 0.08)` / `--glass-border`)
- `--space-5` (used in `InteractiveCameraScreen.tsx` and `DemoPanel.module.css`; replace with `--space-4` or `--space-6`)
- `--text-muted` (used in `InteractiveCameraScreen.tsx` and `DemoPanel.module.css`; replace with `var(--text-dim)`)
- `--font-body` (used in `DemoPanel.module.css`; replace with `var(--font-family-body)`)
- `--font-display` (used in `DemoPanel.module.css` and `LockRing.module.css`; replace with `var(--font-family-display)`)

### 3.3 Textual Claims Sweep
- `AUDIT-REPORT.md` retains historical references to old removed numbers in finding B1, and asserts `100%` pass.
- `index.html` references missing `public/vite.svg`.
- All other code files cleanly avoid unsourced numbers; minor occurrences of `100%` relate strictly to CSS widths or progress milestones.

---

## 4. Proposed Order of Work (Tiered Plan)

### Stage 1 (Tier 1): P0 Blocker Repairs (State Machine & Critical Runtime Bugs)
1. **P0-01:** Stop event bubbling on controls inside `InteractiveCameraScreen.tsx` (filter targets in `handleViewfinderTap`).
2. **P0-02:** Add recovery timer in `InteractiveCameraScreen.tsx` when `status === 'CANCELLED'` to dispatch `ANIM_DONE` after 800ms.
3. **P0-03:** Fix RAF locking loop in `InteractiveCameraScreen.tsx` to read `steadiness` via ref instead of tearing down on sensor updates.
4. **P0-04:** Fix Group Mode steady-hold timer to read steadiness via ref, preventing continuous timer cancellation.
5. **P0-05 & P0-06:** Enforce strict guards in `cameraMachine.ts` for `VOICE_TRIGGER`, `VOLUME_KEY`, and `PROGRESS_COMPLETE` (require steady=true, check group ready count, restrict valid from-states).
6. **P0-07:** Add strict assertions to `scripts/test-interactive.mjs` verifying `state.status === 'CANCELLED'`.
7. **P0-08:** Fix `scripts/fetch-scenes.mjs` so it does not overwrite `moment-*.jpg`.
8. *Verification:* Run `npm run build`, `npm test`, commit & push.

### Stage 2 (Tier 2): P1 Major Interaction & Accessibility Repairs
1. **P1-01:** Update `useSteadiness.ts` so spacebar release drops steadiness to `0.35` (unsteady), and spacebar hold raises to `0.95` (steady).
2. **P1-02 & P1-03:** Wire `TIMEOUT_FOCUS` (3s) and `COOLDOWN_MS` (600ms) into `InteractiveCameraScreen.tsx` and `cameraMachine.ts`.
3. **P1-04:** Guard haptic calls so they only fire when transitions succeed.
4. **P1-05:** Update keyboard listener in `InteractiveCameraScreen.tsx` to ignore buttons, selects, and custom controls.
5. **P1-06:** Implement `accelerationIncludingGravity` magnitude delta fallback in `useSteadiness.ts`.
6. **P1-08 & P1-09:** Fix `MomentStripScreen.tsx` so Save preserves `selectedIndex`, and add dismiss/share handlers.
7. **P1-11:** Fix all undefined CSS tokens across `tokens.css`, `DemoPanel.module.css`, `LockRing.module.css`, and `InteractiveCameraScreen.tsx`.
8. **P1-12:** Restore `:focus-visible` styling with 2px amber ring in `IconButton.module.css`.
9. **P1-13:** Add full WAI-ARIA arrow key navigation and roving tabindex to `ModeCarousel`.
10. **P1-14:** Remove `maximum-scale=1.0, user-scalable=no` from `index.html`.
11. **P1-15:** Make gallery preview thumbnail in `InteractiveCameraScreen.tsx` a semantic, accessible `<button>`.
12. **P1-16:** Support relative base URL paths across screens and asset imports.
13. **P1-17:** Store and clean up undo secondary timeout.
14. *Verification:* Run `npm test`, verify in browser at 390×844, commit & push.

### Stage 3 (Tier 3): P2 Script Portability, Assets & Exports
1. **P2-01 & P2-02:** Remove hardcoded paths and make test scripts gracefully check/start dev server or exit with clear messages.
2. **P2-03:** Fix `scripts/compose-group.mjs` asset path.
3. **P2-04:** Ensure screenshot scripts export at 3× Retina (1170×2532).
4. **P2-05:** Explicitly configure PDF page orientation and dimensions.
5. **P2-06:** Integrate `generate-moments.mjs` into export workflow.
6. **P2-07:** Add local Mermaid fallback or ensure self-contained export in `export-user-flow.mjs`.
7. **P2-08:** Add proper SVG favicon in `public/favicon.svg` and link in `index.html`.
8. **P2-09:** Add strict dimension validation to `export-screens.mjs`.
9. **P2-10:** Add `.github/workflows/ci.yml` for automated CI test execution.
10. *Verification:* Run `npm run export`, inspect output files, commit & push.

### Stage 4 (Tier 4): Documentation Synchronization & Final Submission Polish
1. Update `AUDIT-REPORT.md`, `README.md`, `docs/QA-report.md`, `docs/D4-design-decisions.md`, and `src/screens/CaseStudyScreen.tsx` with 100% truthful disclosures of prototype vs hardware capabilities.
2. Replace all remaining `#6E6E80` text with `#A3A3B2` to guarantee AAA contrast compliance.
3. Create `docs/CHANGELOG.md` with complete audit and fix history.
4. Final full export and end-to-end test verification. Commit and push.

---

**STAGE 0 TRIAGE IS COMPLETE. AWAITING USER "GO" BEFORE COMMENCING STAGE 1.**
