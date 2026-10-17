# Deliverable 4: Key Design Decisions

1. **Reuse tap-to-focus.** Everyone taps to focus; STILL extends a familiar gesture rather than teaching a new one.
2. **Stillness is consent.** Tap anchors focus; capture occurs only after the phone settles for ~0.8s. The tap jolt settles before exposure, preventing accidental triggers.
3. **Visible physical progress.** A filling ring shows upcoming capture. If movement occurs, it drains smoothly, keeping the user in control without a shutter button.
4. **Choose the moment afterwards.** A rewind strip (simulated 3s buffer) eliminates timing anxiety. Suggested frame index 3 is preselected, autosaves in 4s, with 5s Undo.
5. **Whole-screen control.** No bottom corner to reach, dramatically improving one-handed stability and selfie reachability.
6. **Inclusive alternate triggers.** Tunable hold sensitivity, voice trigger, and volume key provide hands-free alternatives that eliminate screen tap shake while still requiring steadiness.
7. **Calm dark UI.** Canvas stays dark and uncluttered; signal amber is strictly reserved for the focus ring and suggested moment.

Note: Timings (0.8s, 4s, 5s) are baseline defaults refined through usability testing. For buffer architecture and simulated prototype details, see [interaction-spec.md](interaction-spec.md#8-moment-strip-buffer-architecture-prototype-vs-production).
