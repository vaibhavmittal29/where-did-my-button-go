# STILL: Interaction Specification & Theoretical Framework

> **Concept:** *"Hold still to capture. Rewind to choose."*  
> **Interaction Paradigm:** Continuous sensor-driven intent + post-hoc frame selection (replacing discrete command input).

---

## 1. Why the Shutter Button Existed (The 5 Jobs)

Traditional camera interfaces rely on a dedicated capture button rooted in 19th-century mechanical traditions. In mobile touchscreens, this button performs five distinct user-experience functions:

| # | Shutter Job | Traditional Mechanism | Inherent Flaw / Limitation |
|---|---|---|---|
| **1** | **Intent** | Explicit press declares: *"I want a photo right now."* | High friction; requires cognitive commitment before seeing the outcome. |
| **2** | **Timing** | Determines the exact millisecond of exposure. | Anxiety-inducing; human reaction time often misses fast action or blinks. |
| **3** | **Feedback** | Visual shutter blink, haptic pulse, and mechanical click sound. | Confirms capture occurred, but cannot confirm image sharpness or quality. |
| **4** | **Reachability** | Centered circular target at the bottom safe zone. | Fixed coordinates demand one-handed thumb stretching or two-handed framing. |
| **5** | **Stability (The Hidden Flaw)** | Physical tap on glass or chassis. | **Self-defeating:** The physical tap impulse jars phone gyroscopes, causing motion blur at exposure. |

---

## 2. How STILL Replaces Every Shutter Job

STILL does not relocate the button; it redesigns the interaction model from first principles.

| Shutter's Job | How STILL Replaces It | Design Rationale |
|---|---|---|
| **Intent** | **Tap-to-Focus + Steadiness** | Users already tap a subject to establish focus. STILL repurposes this universal mental model: tapping places a focus ring, and holding the phone still signals active consent. |
| **Timing** | **Moment Strip (Rolling 3s Buffer)** | Instead of predicting the precise millisecond, STILL records a continuous 3-second buffer. Users choose their preferred moment *after* the event. |
| **Feedback** | **Dynamic Ring Fill + Haptic Pulse + Screen Bloom** | A physical, linear fill gauge on the focus point communicates progress. A crisp haptic confirmation and gentle perimeter bloom confirm capture without jarring flashes. |
| **Reachability** | **Entire Viewfinder is Active** | Anywhere you tap becomes the capture anchor. No bottom-corner reach is required, making one-handed, selfie, and awkward angle captures effortless. |
| **Camera Shake** | **Capture at Peak Stillness** | By requiring a steady threshold (0.8s hold), the photo is taken at the moment of minimal accelerometer delta. The old flaw is converted into the trigger mechanism. |

---

## 3. Illustrative User Scenarios

*(Note: The following personas and scenarios are illustrative archetypes created for contextual design analysis.)*

### Scenario A: Aarav (18, CSE Fresher) — Campus Fest Gathering
- **Context:** Evening cultural night, dim stage lights, holding a cold drink in one hand.
- **Problem with Old Shutter:** Stretching his thumb to hit the bottom shutter button causes the phone to tilt, resulting in a dark, blurry group photo.
- **Experience with STILL:** Aarav frames his friends, taps on their faces with his thumb anywhere on screen, and keeps his hand steady for 0.8s. The ring completes smoothly. The camera captures them cleanly without one-handed tap shake.

### Scenario B: Meera (19, Student) — Lecture Hall Whiteboard Capture
- **Context:** Standing at the back of a large lecture hall, zooming 3x to capture professor's complex handwritten equation before it is erased.
- **Problem with Old Shutter:** At 3x digital zoom, tapping the shutter creates severe angular shake, rendering fine mathematical symbols illegible.
- **Experience with STILL:** Meera taps directly on the equation. The amber ring tracks the text. When her hands settle, STILL automatically triggers at peak stability. The resulting image is crisp and readable.

### Scenario C: Ritu (20, Pet Owner) — Fast-Moving Subject
- **Context:** Taking a portrait of an energetic golden retriever in a park.
- **Problem with Old Shutter:** By the time Ritu's thumb physically touches the shutter, the dog has turned its head or closed its eyes (the "timing lag" problem).
- **Experience with STILL:** Ritu taps the dog. As STILL locks, the 3-second buffer records the entire movement. Even if the dog turns right at the capture point, the **Moment Strip** pops up displaying 7 adjacent frames. Ritu simply taps the frame from 0.4 seconds prior where the dog was looking straight ahead.

---

## 4. Risks & Mitigations Matrix

| Identified Risk | Severity | User Impact | STILL Mitigation Architecture |
|---|---|---|---|
| **Discoverability** | High | First-time users wonder *"Where is the button?"* and feel lost. | 1. Interactive 3-step onboarding sheet on first launch.<br/>2. Ambient pulsing **ghost ring** on viewfinder with coach text: *"Tap what you want to keep"*. |
| **Accidental Captures** | Medium | Phone takes photos automatically in pocket or while walking. | Tapping alone **never** captures; sustained device steadiness (accelerometer variance < threshold for 800ms) is strictly enforced. |
| **Loss of Precision** | Medium | User feels they lost control over the exact split-second. | Post-capture **Moment Strip** presents 7 candidate frames with a suggested frame pre-selected (precomputed in prototype). |
| **Tap Tremor & Alternate Triggers** | Medium | Users looking to avoid screen tap impact or wanting hands-free triggering. | 1. Configurable hold time in Settings (400–1500 ms).<br/>2. Voice trigger (*"Capture"* / *"Cheese"*, simulated in prototype).<br/>3. Physical key fallback ('C' key in prototype; volume keys in native apps). All alternate triggers still require phone stillness before capture. |
| **Unwanted Captures** | Low | A capture completed that the user did not want stored. | Prominent 5-second **"Saved · Undo"** toast allows single-tap immediate deletion. |

---

## 5. Interaction State Machine Specification

### 5.1 States
- `IDLE`: Viewfinder live, ghost ring pulsing, coach mark visible.
- `FOCUSED`: Subject tapped at `(x, y)`; focus ring visible at 0% progress.
- `LOCKING`: Device steadiness exceeds threshold; progress accumulator running ($progress = \Delta t / \text{holdTime}$).
- `CANCELLED`: Device motion exceeded threshold during lock; ring drains at 2× speed with soft warning feedback.
- `CAPTURED`: Lock progress reached 100%; exposure frozen; rolling buffer committed; haptic confirmation.
- `REVIEW`: Moment Strip sliding up; suggested frame highlighted with "Suggested" badge; 4s autosave countdown active.
- `SAVED`: Selected frame written to storage; undo window (5s) available.

### 5.2 Transition Table
| Current State | Event Trigger | Next State | System Actions & Feedback |
|---|---|---|---|
| `IDLE` | `TAP_SUBJECT(x, y)` | `FOCUSED` | Position focus pin at `(x,y)`; haptic tick (10ms); display ring track. |
| `FOCUSED` | `STEADY_OK` | `LOCKING` | Initiate progress fill; listen to device motion ticks. |
| `FOCUSED` | `TIMEOUT(3s)` | `IDLE` | Fade pin; display transient microcopy: *"Hold still"*. |
| `LOCKING` | `STEADY_TICK(dt)` | `LOCKING` | Increment progress gauge by $dt / \text{holdTime}$. |
| `LOCKING` | `UNSTEADY(>250ms)` | `CANCELLED` | Drain ring gauge at 2× speed; soft error haptic (30ms); toast: *"Too much movement"*. |
| `CANCELLED` | `ANIM_DONE` | `FOCUSED` | Retain focus pin at `(x,y)` to enable immediate re-lock without re-tapping. |
| `LOCKING` | `PROGRESS >= 1.0` | `CAPTURED` | Multi-pulse haptic `[18ms, 30ms, 18ms]`; perimeter viewport bloom; snapshot buffer. |
| `CAPTURED` | `ANIM_DONE` | `REVIEW` | Animate Moment Strip from bottom; pre-select suggested frame (simulated in prototype). |
| `REVIEW` | `PICK_FRAME(i)` | `REVIEW` | Swap primary preview; reset autosave countdown timer. |
| `REVIEW` | `TIMEOUT(4s)` | `SAVED` | Commit chosen frame; dismiss strip; surface toast: *"Saved · Undo"*. |
| `SAVED` | `UNDO(<=5s)` | `IDLE` | Purge saved frame from storage; toast: *"Photo removed"*. |

---

## 6. Tunable Physics & Temporal Constants

```typescript
export const HOLD_TIME_MS = 800;          // Base required stillness (configurable: 400-1500ms)
export const UNSTEADY_GRACE_MS = 250;     // Permitted micro-jitter window before cancel
export const STEADY_THRESHOLD = 0.7;      // Accelerometer variance threshold (0.0 = chaotic, 1.0 = rock solid)
export const LOW_LIGHT_MULTIPLIER = 1.5;  // Extended exposure hold in low-lux conditions (1200ms)
export const BUFFER_SECONDS = 3.0;        // Rolling buffer window
export const CANDIDATE_FRAMES = 7;        // Frames displayed in Moment Strip
export const AUTOSAVE_MS = 4000;          // Auto-commit timer if user does not touch strip
export const UNDO_WINDOW_MS = 5000;       // Post-save undo grace period
export const COOLDOWN_MS = 600;           // Guard against accidental double-captures
```

---

## 7. Sensory Feedback Mapping

| User Moment | Haptic Signature (`vibrate`) | Synthetic Audio | Visual Indicator |
|---|---|---|---|
| **Tap Subject** | 10ms single tick | None | Ring appears at tap coordinates |
| **Ring Fill (33% & 66%)** | 8ms subtle pulse | Soft tick (optional) | Continuous amber arc sweep |
| **Capture Completed** | `[18ms, 30ms, 18ms]` | Short 40ms camera shutter click | Viewport perimeter bloom (no white flash) |
| **Motion Cancelled** | 30ms dull pulse | None | Amber ring drains rapidly to red track |
| **Auto-Saved** | 12ms soft confirmation | None | Toast message with interactive Undo CTA |

---

## 8. Moment Strip Buffer Architecture: Prototype vs. Production

### 8.1 Browser Prototype Stand-ins
In this browser prototype, the 7 frames in the Moment Strip are visual stand-ins derived from a single high-resolution portrait photograph. Dynamic CSS zoom, pan, brightness, and warmth transforms simulate candidate frames along a temporal sequence. Frame index 3 is preselected as a fixed illustrative Suggested frame (no real-time sharpness ranking or variance heuristic is computed in the browser prototype). This allows the prototype to demonstrate the card-scrubbing ergonomics, automatic "Suggested" moment indicator, and autosave lifecycle with zero external video pipeline dependencies.

### 8.2 Production Circular Ring Buffer Specification
In a production native mobile implementation (iOS AVFoundation / Android CameraX):
1. **Ring Buffer Allocation:** The camera pipeline allocates an in-memory circular ring buffer of YUV/RAW frames running at 30 fps over 3.0 seconds (a continuous FIFO cache of exposures).
2. **Foreground Gating:** The buffer records frames only when the viewfinder view is visible and the app is active in the foreground, immediately freeing resources when backgrounded.
3. **Capture & Suggested Frame Selection:** In this prototype, frame index 3 is pre-selected as a fixed illustrative Suggested frame. In a future production native camera pipeline, a background worker would sample candidate frames from the circular buffer, evaluate high-frequency edge gradients across candidate frames, and pre-select the least blurred candidate.

---

## 9. Prototype Limitations (Simulated vs Real)

This project is a browser-based UI/UX prototype created for the VinnovateIT design challenge. To maintain technical integrity, the following hardware/native capabilities are simulated in the browser:

- **Camera stream:** Browser simulation using an optimized high-resolution portrait image with dynamic CSS filters (not raw hardware sensor frames).
- **Steadiness sensor:** Web `DeviceMotionEvent` acceleration heuristic (filtered magnitude) or on-screen slider/keyboard simulator, not true multi-axis gyroscope angular velocity.
- **Moment Strip:** 7 transformed visual variations derived from a single portrait to demonstrate the rewind UI/UX pattern, not 7 distinct frames from a hardware circular ring buffer.
- **Group detection:** Simulated multi-face tracking bounding boxes and readiness state machine, not on-device computer vision or face-mesh ML models.
- **Speech recognition:** Simulated button triggers and keyword hooks, not the native Web Speech API.
- **Persistence:** In-memory reactive state and transient toast dismissal, not persistent disk or IndexedDB gallery photo storage.
