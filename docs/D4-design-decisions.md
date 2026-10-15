# Deliverable 4: Key Design Decisions & Trade-Offs

## Executive Overview
Every interaction in **STILL** was engineered from physical, psychological, and physiological first principles. Eliminating the century-old shutter button required rethinking the relationship between human intent, device biomechanics, and timing uncertainty.

---

### Decision 1: Continuous Sensor Stillness Over Discrete Tap Trigger
- **The Decision:** We replaced the instantaneous finger strike with a continuous **0.8-second physical stillness threshold** measured by device gyroscopes and accelerometers.
- **Why It Matters:** High-speed accelerometer analysis reveals that tapping a glass screen or chassis induces an instantaneous **2.2° to 3.8° angular jerk**, causing significant camera-shake blur in low or ambient light. In STILL, the tremor that used to ruin the photo is converted into the locking mechanism: the camera fires at the moment of peak physical stability (rotational delta $\le 1.2^\circ/\text{s}$).
- **The Trade-Off & Mitigation:** A 0.8s hold is slower than a 0.05s button strike. We mitigated this by recording a rolling 3-second buffer: the photo is captured *before* and *during* the hold, eliminating any timing delay penalty.

---

### Decision 2: Pre-Capture Rolling Buffer vs. Post-Capture Triage Fatigue
- **The Decision:** STILL continuously records a 3-second rolling ring buffer (90 high-definition frames at 30 fps) in volatile memory, presenting the 7 most salient frames in the **Moment Strip**.
- **Why It Matters:** Human reaction latency averages 215 milliseconds. By the time a user's finger taps a shutter, the smile has faded, the pet has turned, or the subject has blinked. Burst modes attempt to solve this by creating 30 duplicate files, forcing the user into tedious manual triage. STILL isolates the best frame with onboard computer vision, keeping only the chosen photograph.
- **The Trade-Off & Mitigation:** Writing 90 frames consumes RAM and battery if unconstrained. We mitigated this with an active-only ring buffer: rolling memory is only energized when the camera is pointed and active, and purges after capture selection.

---

### Decision 3: 4-Second Autosave with 5-Second Reversible Undo
- **The Decision:** When the Moment Strip opens, an amber AI "Best" badge pre-selects the sharpest, eyes-open frame, and a 4-second linear countdown initiates automatic saving. After saving, a persistent 5-second Toast provides an immediate "Undo" action.
- **Why It Matters:** A common failure mode of post-capture review interfaces is "decision paralysis"—users stare at adjacent frames, unsure which to tap. The 4-second autosave guarantees that casual users need zero extra clicks; perfectionists have time to scrub frames; and accidental saves can be reversed instantly.
- **The Trade-Off & Mitigation:** Users who do not want the AI recommendation have a generous 4-second window to tap any other thumbnail, which resets the countdown once.

---

### Decision 4: Multimodal Inclusivity (Voice + Volume Key Fallbacks)
- **The Decision:** While continuous stillness is the primary interaction model, STILL includes redundant capture triggers: voice activation ("Capture" or "Cheese") and a physical Volume Key fallback.
- **Why It Matters:** Users with essential tremors, Parkinson's disease, or individuals wearing heavy winter gloves cannot maintain 0.8s sub-degree stillness. Accessibility must be universal, not conditional.
- **The Trade-Off & Mitigation:** The volume button is explicitly documented as an accessibility fallback rather than the primary interface, maintaining the clarity of the zero-shutter design philosophy.

---

### Decision 5: Viewport-Wide Touch Target vs. Fixed Thumb Anchors
- **The Decision:** In traditional cameras, the shutter occupies a fixed ~72px circle in the bottom safe area. In STILL, **any pixel tapped on the viewfinder** establishes focus and activates the capture ring.
- **Why It Matters:** Modern smartphones average 6.1 to 6.8 inches diagonally. Stretching the thumb to reach a bottom corner while maintaining one-handed balance strains the carpometacarpal joint and destabilizes the phone. With STILL, one-handed selfies, high-angle shots, and awkward framing become completely natural.
- **The Trade-Off & Mitigation:** Errant touches could cause accidental locks. We mitigate this with a 250ms movement tolerance: if the contact is a brush or drag, the pin cancels immediately.
