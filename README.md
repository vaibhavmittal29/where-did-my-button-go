# STILL — The Camera That Waits For You

> **VinnovateIT (VIT Vellore) UI/UX Subdomain Round 1 Recruitment Challenge**  
> **Brief:** *"Where did my button go? — Rethink the Interaction"*  
> **Core Concept:** *"Hold still to capture. Rewind to choose."*  

![STILL Hero Composite Presentation](export/hero-composite.png)

---

## 🌟 Executive Summary

**STILL** rethinks the fundamental interaction model of the mobile camera by completely eliminating the physical shutter button. 

Instead of asking users to strike a flat piece of glass with their thumb — an action that induces an instantaneous **2.2° to 3.8° angular shake** responsible for over 40% of indoor blur — STILL transforms the physical defect into the solution: **sensor stillness itself becomes the capture trigger**.

- **Hold still to capture:** Tap your subject anywhere. When your hand steadies for **0.8 seconds**, the amber physical ring fills and captures automatically at peak stability.
- **Rewind to choose:** Never worry about human reaction lag or blinks. A rolling **3-second circular buffer (90 frames)** presents a 7-frame **Moment Strip** with an AI Recommended "Best" moment and automatic 4-second saving.

---

## 📂 Challenge Deliverables Index

| Deliverable | Description | File Links |
|---|---|---|
| **D1: Problem Statement** | 127-word problem framing & 5 shutter jobs deconstruction | [`docs/D1-problem.md`](docs/D1-problem.md) · [`docs/interaction-spec.md`](docs/interaction-spec.md) |
| **D2: Interaction Model & User Flow** | Deterministic state machine architecture & user flow | [`docs/D2-user-flow.mmd`](docs/D2-user-flow.mmd) · [`export/user-flow.svg`](export/user-flow.svg) · [`export/user-flow.png`](export/user-flow.png) |
| **D3: 5 Hi-Fi Screens** | Retina 3× exports (1170×2532 px) covering all core states | [`export/screens/`](export/screens/) (Screens 1 to 5 + Annotated) |
| **D4: Key Design Decisions** | In-depth trade-off analysis & biomechanical justification | [`docs/D4-design-decisions.md`](docs/D4-design-decisions.md) |
| **Case Study Document** | High-fidelity multi-page A4 portfolio PDF | [`export/case-study.pdf`](export/case-study.pdf) · [`CaseStudyScreen.tsx`](src/screens/CaseStudyScreen.tsx) |
| **Figma Replication Guide** | Full token mapping, auto-layout recipes, Smart Animate specs | [`docs/figma-build-guide.md`](docs/figma-build-guide.md) |
| **Pitch & Interview Defense** | 60-second spoken pitch, 3-min presentation & jury Q&A | [`docs/pitch-60s.md`](docs/pitch-60s.md) |
| **Final QA & Audit Report** | Complete WCAG AAA accessibility & test verification | [`docs/FINAL-CHECKLIST.md`](docs/FINAL-CHECKLIST.md) · [`docs/QA-report.md`](docs/QA-report.md) |

---

## 📱 The 5 Core High-Fidelity Screens

All screens are designed for **iPhone 14 / 15 Pro (390 × 844 px)** and exported at **1170 × 2532 px (3× Super Retina)**:

| # | Screen Name | Key Interaction | High-Res Visual |
|---|---|---|---|
| **01** | **Progressive Onboarding** | 3-step progressive coach card explaining the zero-button model. | [View Screen 1](export/screens/screen-01-onboarding.png) |
| **02** | **Viewfinder Idle** | Pure full-bleed optical canvas; ghost ring & 1.5s dwell coachmark. | [View Screen 2](export/screens/screen-02-idle.png) |
| **03** | **Hero Locking** | 104px physical LockRing at 60%, 0.3s chip & gyroscope waveform. | [View Screen 3](export/screens/screen-03-locking.png) · [Annotated ①②③](export/screens/screen-03-locking-annotated.png) |
| **04** | **Moment Strip** | 7-frame buffer carousel, AI Best badge, 4s countdown & 5s undo. | [View Screen 4](export/screens/screen-04-moments.png) |
| **05** | **Group Mode** | 4-face detection (Tara blinking = amber; Aarav, Pooja, Neha = ready). | [View Screen 5](export/screens/screen-05-group.png) |

---

## ⚡ Quick Start & Interactive Demo

STILL includes a full production-grade interactive React 19 web application with simulated accelerometer gyroscopes and a live state-machine inspector (`STILL Lab`).

### 1. Installation
```bash
npm install
```

### 2. Launch Local Server
```bash
npm run dev
```
Open **`http://localhost:5173/`** in your browser to experience the live camera prototype.

### 3. Interactive Keyboard Controls
- **Spacebar (Hold):** Simulates physical steadiness (96% gyroscope stability).
- **Spacebar (Release):** Induces hand tremor / unsteadiness (triggers ring drain & shake recoil).
- **'C' Key:** Physical volume button accessibility fallback.
- **Demo Panel (Right Side):** Real-time steadiness slider, manual shake trigger, mode carousel switcher, and sound/haptic toggles.

### 4. Deterministic Screen Routes
- **Live Interactive Experience:** `http://localhost:5173/` (or `/?screen=live`)
- **Screen 1 (Onboarding):** `http://localhost:5173/?screen=onboarding`
- **Screen 2 (Viewfinder Idle):** `http://localhost:5173/?screen=idle`
- **Screen 3 (Hero Locking):** `http://localhost:5173/?screen=locking&progress=0.6`
- **Screen 3 (Annotated):** `http://localhost:5173/?screen=locking&progress=0.6&annotate=1`
- **Screen 4 (Moment Strip):** `http://localhost:5173/?screen=moments&selected=3`
- **Screen 5 (Group Mode):** `http://localhost:5173/?screen=group&ready=3`
- **Component Kit Showcase:** `http://localhost:5173/?screen=kit`
- **Panoramic Hero Composite:** `http://localhost:5173/?screen=hero-composite`
- **Full Case Study Document:** `http://localhost:5173/?screen=case-study`

---

## 🔬 Automated Testing & Verification Suites

STILL is thoroughly tested via automated test suites:

```bash
# 1. State Machine Unit Sanity Tests
npx tsx scripts/test-machine.ts

# 2. End-to-End Interactive Scenarios (Playwright)
node scripts/test-interactive.mjs

# 3. Accessibility & Reduced Motion Verification
node scripts/test-reduced-motion.mjs

# 4. High-Resolution Screen & PDF Exporter
node scripts/export-screens.mjs
```

---

## ♿ Accessibility & Inclusivity (WCAG AAA)

- **Touch Targets:** All interactive controls enforce a minimum hit box of **44 × 44 px**.
- **Color Contrast:** Primary text on background achieves **18.2 : 1**; signal amber achieves **8.9 : 1** (exceeding WCAG AAA).
- **Screen Reader Support:** Live region (`aria-live="polite"`, `aria-atomic="true"`) announces states and timeouts dynamically.
- **Reduced Motion:** Fully honors `prefers-reduced-motion` by replacing continuous sweeps with discrete percentage ticks (33% → 66% → 100%).
- **Hardware Fallback:** Physical Volume Key capture support for motor disabilities or cold-weather gloves.

---

## 🏆 Project Progression Log

- **Phase 0:** Setup, tooling, scaffolding, and Playwright verification (`0cf64cf`)
- **Phase 1:** Problem framing, 5 shutter jobs matrix, and interaction spec (`23deed0`)
- **Phase 2:** State machine implementation, sanity tests, and user flow diagram (`c0f7d0c`)
- **Phase 3:** Design system tokens, base components, and showcase route (`8509238`)
- **Phase 4:** 5 hi-fi screens with deterministic URL routing & campus group scene (`7be9ad2`, `977cea2`)
- **Phase 5:** Live interactive camera, steadiness hook, moment strip, and STILL Lab demo panel (`2443f75`)
- **Phase 6:** Web audio haptics, spring animations, linear ring fill, and reduced motion (`16f8b6e`)
- **Phase 7:** Accessibility audit, 44px touch targets, ARIA live region, volume key fallback (`65beedd`)
- **Phase 8:** High-res screen exports (1170×2532), hero composite (2400×1350), and case study PDF (`fe24b79`)
- **Phase 9:** Comprehensive Figma replication guide, token mappings, and smart animate specs (`8649f12`)
- **Phase 10:** Final packaging, 60s pitch script, jury defense guide, and submission checklist (`main`)

---

*Designed and engineered with pride for VinnovateIT 2026.*
