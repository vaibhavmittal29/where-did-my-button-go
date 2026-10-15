# STILL Design System & Contrast Verification Report

> **Design Philosophy:** "Calm, precise, quiet confidence." The photography is the hero; interface elements are non-destructive and recede when not actively needed.

---

## 1. Color System & WCAG AA Contrast Audit

| Token | Hex / Value | Role | Tested Against | Contrast Ratio | WCAG Compliance |
|---|---|---|---|---|---|
| `--text` | `#F5F5F7` | Primary text & headlines | `--bg` (`#0B0B0F`) | **17.0 : 1** | **AAA** (Exceeds 7:1) |
| `--text` | `#F5F5F7` | Card text | `--surface-1` (`#15151C`) | **15.6 : 1** | **AAA** (Exceeds 7:1) |
| `--text-dim` | `#A3A3B2` | Secondary labels & microcopy | `--bg` (`#0B0B0F`) | **7.36 : 1** | **AAA** (Exceeds 7:1) |
| `--text-dim` | `#A3A3B2` | Surface secondary | `--surface-1` (`#15151C`) | **6.77 : 1** | **AA** (Exceeds 4.5:1) |
| `--accent` | `#FFB020` | Signal Amber (Ring arc, badges) | `--bg` (`#0B0B0F`) | **10.5 : 1** | **AAA** (Exceeds 7:1) |
| `--accent` | `#FFB020` | Interactive chip label | `--surface-1` (`#15151C`) | **9.67 : 1** | **AAA** (Exceeds 7:1) |
| `--success` | `#3DDC97` | Status Ready / Saved | `--bg` (`#0B0B0F`) | **10.8 : 1** | **AAA** (Exceeds 7:1) |
| `--danger` | `#FF6B5E` | Movement warning / cancel | `--bg` (`#0B0B0F`) | **6.49 : 1** | **AA** (Exceeds 4.5:1) |
| `--glass` | `rgba(20,20,28,0.55)` | Overlays & controls | Varied photo viewfinders | Verified with `backdrop-filter: blur(16px)` + 1px border scrim | Pass |

---

## 2. Typography Hierarchy

- **Display & Section Headers:** `Space Grotesk` (SemiBold 600 / Bold 700)
  - `40px` Display (Splash / Hero)
  - `28px` Headline (Onboarding & Screen headers)
  - `20px` Title (Card titles & mode labels)
- **UI & Microcopy:** `Inter` (Regular 400 / Medium 500 / SemiBold 600)
  - `16px` Body (Primary instructions)
  - `14px` Small (Chips, button labels, toast messages)
  - `12px` Caption (Metrics, timers, helper text)
- **Numeric Precision:** All timers, hold-seconds, and counters enforce `font-variant-numeric: tabular-nums` to eliminate layout jitter during live animations.

---

## 3. Spatial System (8-pt Baseline Grid)

- `4px` (`--space-1`): Micro-gap between icons and adjacent text
- `8px` (`--space-2`): Chip padding & tight card spacing
- `12px` (`--space-3`): Icon button margins
- `16px` (`--space-4`): Standard gutter & card padding
- `24px` (`--space-6`): Section separation
- `32px` (`--space-8`): Major structural margins
- `48px` (`--space-12`): Hero offsets

---

## 4. Accessibility Principles

1. **44×44 px Touch Targets:** All interactive icons and buttons enforce strict minimum bounding boxes of 44×44px, compliant with Apple Human Interface Guidelines and WCAG 2.5.5 (Target Size).
2. **Accessible Focus States:** All actionable elements provide high-visibility `2px solid var(--accent)` outlines when navigated via keyboard.
3. **Motion Sensitivity:** Components respect `prefers-reduced-motion: reduce`, dropping spring dynamics and continuous pulses in favor of immediate discrete state transitions.
