# STILL — Camera Without a Shutter Button

> **VinnovateIT (VIT Vellore) UI/UX Subdomain Round 1 Recruitment Task**  
> **Brief:** *"Where did my button go? — Rethink the Interaction"*  
> **Core Concept:** *"Hold still to capture. Rewind to choose."*

---

## What is STILL?
STILL rethinks the fundamental interaction of the mobile camera. Instead of simply relocating the shutter button to another screen corner or volume rocker, STILL challenges the 5 core jobs the shutter historically performed (Intent, Timing, Feedback, Reachability, and the hidden flaw of Camera Shake).

By making **steadiness the trigger** and offering a **3-second rolling buffer (Moment Strip)** to choose the crispest shot after the fact, STILL transforms discrete shutter taps into continuous sensor-driven intent.

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Deterministic Screen URLs
- Onboarding: `/?screen=onboarding`
- Idle Viewfinder: `/?screen=idle`
- Locking Screen (60% Progress): `/?screen=locking&progress=0.6`
- Moment Strip Review: `/?screen=moments&selected=3`
- Group Mode (4 Faces / 3 Ready): `/?screen=group&ready=3`
- Component Kit: `/?screen=kit`

---

## Deliverables
- **D1 (Problem Definition):** `docs/D1-problem.md`
- **D2 (User Flow):** `docs/D2-user-flow.mmd` & `export/user-flow.png`
- **D3 (5 High-Fidelity Screens):** `export/screens/`
- **D4 (Key Design Decisions):** `docs/D4-design-decisions.md`
- **Case Study Portfolio:** `export/case-study.pdf`
