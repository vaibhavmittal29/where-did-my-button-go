# STILL Figma Canvas Generator Plugin

An automated Figma plugin that programmatically constructs the complete **STILL** UI/UX project inside Figma in 1 click.

---

## 🚀 How to Run in Figma (30 Seconds)

1. Open the **Figma Desktop App** (or Figma in Chrome with desktop agent).
2. Create or open an empty design file.
3. In the top-left Figma menu, go to:  
   **Plugins ➔ Development ➔ Import plugin from manifest...**
4. Select the [`manifest.json`](manifest.json) file in this directory:  
   `scripts/figma-plugin/manifest.json`
5. The plugin dialog will pop up with darkroom STILL branding.
6. Click **`🚀 Build Entire STILL Project`**.
7. Watch Figma automatically generate:
   - **`01 · Cover & Overview`** (Banner presentation with project thesis)
   - **`02 · Design System & Tokens`** (Variables & color styles)
   - **`03 · Master Components`** (IconButton, GlassChip, LockRing, MomentStrip, Toast, ModeCarousel)
   - **`04 · 5 Hi-Fi Screens`** (iPhone 14/15 390×844 px frames with 48px curvature)
   - **`05 · Interactive Prototype`** (Screens connected with Smart Animate reactions)

---

## 🛠️ Files

- `manifest.json`: Figma Plugin definition.
- `code.js`: Sandboxed Figma Plugin API script creating pages, nodes, variables, and interactions.
- `ui.html`: Plugin UI modal with 1-click execution triggers.
