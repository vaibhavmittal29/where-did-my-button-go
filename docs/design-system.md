# STILL Design System & Contrast Verification Report

> **Design Philosophy:** "Calm, precise, quiet confidence." The photography is the hero; interface elements are non-destructive and recede when not actively needed.

---

## 1. Color System & Contrast Ratio Audit

| Token | Hex / Value | Role | Tested Against | Contrast Ratio | Evaluation |
|---|---|---|---|---|---|
| `--text` | `#F5F5F7` | Primary text & headlines | `--bg` (`#0B0B0F`) | **18.0 : 1** | Exceeds 7:1 (Enhanced) |
| `--text` | `#F5F5F7` | Card text | `--surface-1` (`#15151C`) | **15.7 : 1** | Exceeds 7:1 (Enhanced) |
| `--text-dim` | `#A3A3B2` | Secondary labels & microcopy | `--bg` (`#0B0B0F`) | **7.9 : 1** | Exceeds 7:1 (Enhanced) |
| `--text-dim` | `#A3A3B2` | Surface secondary | `--surface-1` (`#15151C`) | **6.9 : 1** | Exceeds 4.5:1 (Minimum) |
| `--accent` | `#FFB020` | Signal Amber (Ring arc, badges) | `--bg` (`#0B0B0F`) | **10.7 : 1** | Exceeds 7:1 (Enhanced) |
| `--accent` | `#FFB020` | Interactive chip label | `--surface-1` (`#15151C`) | **9.3 : 1** | Exceeds 7:1 (Enhanced) |
| `--success` | `#3DDC97` | Status Ready / Saved | `--bg` (`#0B0B0F`) | **11.1 : 1** | Exceeds 7:1 (Enhanced) |
| `--danger` | `#FF6B5E` | Movement warning / cancel | `--bg` (`#0B0B0F`) | **7.0 : 1** | Exceeds 4.5:1 / 7:1 (Large) |
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

1. **44×44 px Touch Targets:** All interactive icons and buttons enforce strict minimum bounding boxes of 44×44px, compliant with Apple Human Interface Guidelines and exceeding WCAG 2.2 Success Criterion 2.5.8 (Level AA, 24×24px) as well as satisfying 2.5.5 (Level AAA, 44×44px).
2. **Accessible Focus States:** All actionable elements provide high-visibility `2px solid var(--accent)` outlines when navigated via keyboard.
3. **Motion Sensitivity:** Components respect `prefers-reduced-motion: reduce`, dropping spring dynamics and continuous pulses in favor of immediate discrete state transitions.
