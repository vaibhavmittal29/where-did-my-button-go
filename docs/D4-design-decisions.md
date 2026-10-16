# Deliverable 4: Key Design Decisions

1. **Reuse tap-to-focus.** Everyone already taps to focus, so STILL extends a familiar gesture instead of teaching a new one.
2. **Stillness is consent.** The tap sets the focus point; the photo is taken only after the phone has settled for about 0.8 s. The jolt from the tap fades before capture, and an accidental touch never takes a photo.
3. **Visible, physical progress.** A filling ring shows what is about to happen. If you move, it drains, so you stay in control without a button.
4. **Choose the moment afterwards.** A rewind strip (a simulated 3-second buffer in this prototype) removes the pressure of perfect timing. A suggested frame is preselected, saves after 4 seconds, and Undo lasts 5 seconds.
5. **Whole-screen control.** No corner to reach, which suits one-handed and selfie use.
6. **Inclusive fallbacks.** Adjustable hold-time threshold, voice trigger, and hardware volume key provide alternate input methods that bypass touching the screen (eliminating tap tremor) while still requiring the device to settle before capture.
7. **Calm dark UI.** The photo is the hero; amber is reserved for action and suggested moment.

Note: the timings (0.8 s, 4 s, 5 s) are starting values to tune through usability testing.

### Moment Strip: Simulated Stand-ins vs. Production Circular Buffer
In this browser prototype, the 7 candidate frames presented in the Moment Strip are visual stand-ins derived via CSS and canvas geometric/color transformations from a single high-resolution portrait photograph. They exist to demonstrate the rewind, card-scrubbing, and pre-selection UI pattern in a lightweight browser environment. In a production native mobile implementation (iOS AVFoundation or Android CameraX), the camera hardware would maintain a continuous circular ring buffer (e.g., a continuous FIFO buffer at 30 fps over 3.0 seconds). Upon stillness-triggered capture, the native pipeline would read directly from this hardware buffer, compute variance/edge gradients across candidate frames to identify peak sharpness, and surface genuine high-resolution photographic exposures.

---

## Prototype Limitations (Simulated vs Real)

This project is a browser-based UI/UX prototype created for the VinnovateIT design challenge. To maintain technical integrity, the following hardware/native capabilities are simulated in the browser:

- **Camera stream:** Browser simulation using an optimized high-resolution portrait image with dynamic CSS filters (not raw hardware sensor frames).
- **Steadiness sensor:** Web `DeviceMotionEvent` acceleration heuristic (filtered magnitude) or on-screen slider/keyboard simulator, not true multi-axis gyroscope angular velocity.
- **Moment Strip:** 7 transformed visual variations derived from a single portrait to demonstrate the rewind UI/UX pattern, not 7 distinct frames from a hardware rolling ring buffer.
- **Group detection:** Simulated multi-face tracking bounding boxes and readiness state machine, not on-device computer vision or face-mesh ML models.
- **Speech recognition:** Simulated button triggers and keyword hooks, not the native Web Speech API.
- **Persistence:** In-memory reactive state and transient toast dismissal, not persistent disk or IndexedDB gallery photo storage.
