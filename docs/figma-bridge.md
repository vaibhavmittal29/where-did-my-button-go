# STILL — Figma Plugin Bridge & Verification Guide

This guide describes how to run and verify the STILL Figma plugin generator located in `scripts/figma-plugin/`.

---

## 1. Overview & Architecture

The STILL Figma plugin (`scripts/figma-plugin/`) generates a complete, professional design system and prototype canvas directly inside Figma:

- **Page 1: Cover & Overview** — Presentation banner with title, tagline, and project attribution.
- **Page 2: Design System & Tokens** — Figma Local Variables (12 colors, 5 corner radii, 6 spacing tokens) and Paint Styles matching `tokens.css`.
- **Page 3: Master Components** — 6 core components (`IconButton`, `GlassChip`, `LockRing`, `Toast`, `ModeCarousel`, `MomentStrip`).
- **Page 4: 5 Hi-Fi Screens** — 390 × 844 px mobile viewframes with 48px corner radius for iPhone 14/15.
- **Page 5: Interactive Prototype** — Full prototype flow wired with Figma Smart Animate transitions (including Still $\leftrightarrow$ Group mode navigation, tap-to-lock, 800ms simulated timeout, and moment strip review).

---

## 2. How to Load and Run in Figma Desktop

1. Open **Figma Desktop** (macOS or Windows).
2. Open any new or existing Figma design file.
3. In the Figma menu, navigate to:
   **Plugins** $\rightarrow$ **Development** $\rightarrow$ **Import plugin from manifest...**
4. Browse to this repository and select:
   `scripts/figma-plugin/manifest.json`
5. The plugin **STILL Camera — Full Project Generator** is now registered under your Development plugins.
6. Open the plugin:
   **Plugins** $\rightarrow$ **Development** $\rightarrow$ **STILL Camera — Full Project Generator**
7. The plugin dialog will appear:
   - Click **"🚀 Build Entire STILL Project"** to generate all 5 pages, tokens, components, and prototype connections.
   - Alternatively, use the granular buttons to generate only tokens or screens.
8. When complete, the plugin displays a generation summary card with exact counts of created entities, and a **"Close Plugin"** button.

---

## 3. Resilience & Idempotency Features

- **Font Fallback Hierarchy:** If `Space Grotesk` is not installed locally on your system, the plugin automatically falls back to `Inter`, and then to `Roboto`, logging a graceful warning without crashing.
- **Idempotent Upsert:** Re-running the plugin cleans existing generated nodes tagged with `still_entity` on each page, rather than creating duplicates or cluttering your canvas. Color variables and paint styles are upserted by name.
- **Timeout Units:** Prototype transition delays use milliseconds (`800`), matching Figma Plugin API requirements.

---

## 4. Verification

### Automated Static Verification (CI)
Run the automated static check suite via:
```bash
npm run test:figma
```
This script tests:
1. Node.js JavaScript syntax check (`node --check scripts/figma-plugin/code.js`).
2. Manifest schema validation and file existence.
3. Invariant check that no fractional timeout seconds (`timeout: 0.8`) exist in `code.js` (asserts `timeout: 800`).
4. UI message protocol handlers (`BUILD_ALL`, `BUILD_COMPLETE`, `ERROR`, `CLOSE`).
5. Master component definitions (`MomentStrip`, font fallback, idempotency helpers).

### Manual in-Figma Checklist
*Because headless Figma execution requires proprietary runtime APIs unavailable in CLI/CI, visual output is manually verified in Figma using this checklist:*

1. [ ] **Cover Page:** Generated at 1920 × 1080 with STILL branding and VinnovateIT submission copy.
2. [ ] **Tokens Page:** Color styles visible under Design panel styles list; variable collection `STILL-Tokens` visible in Local Variables modal.
3. [ ] **Components Page:** All 6 components generated in a horizontal layout:
   - `IconButton` (44×44px circle)
   - `GlassChip` (pill)
   - `LockRing` (104×104px ring with brackets)
   - `Toast` (358×48px with Undo)
   - `ModeCarousel` (Still, Group, Doc)
   - `MomentStrip` (358×80px with 7 thumbnail cards)
4. [ ] **Screens Page:** 5 screens laid out horizontally with 80px gap, correct status bar and navigation scrims.
5. [ ] **Prototype Page:** In Figma Presentation mode (`Shift + Space` or Play icon):
   - Click "Got it" on Screen 1 $\rightarrow$ navigates to Screen 2 Viewfinder.
   - Click Ghost Ring on Screen 2 $\rightarrow$ navigates to Screen 3 Hero Locking.
   - Screen 3 delays 800ms $\rightarrow$ navigates to Screen 4 Moment Strip.
   - Click "Save Selection" on Screen 4 $\rightarrow$ returns to Screen 2.
   - Click "Group" pill on Screen 2 $\rightarrow$ navigates to Screen 5 Group Mode.
   - Click "Still" pill on Screen 5 $\rightarrow$ returns to Screen 2.
   - Click ready face box on Screen 5 $\rightarrow$ navigates to Screen 4 Moment Strip.
