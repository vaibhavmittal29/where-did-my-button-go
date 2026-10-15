# Deliverable 4: Key Design Decisions

1. **Reuse tap-to-focus.** Everyone already taps to focus, so STILL extends a familiar gesture instead of teaching a new one.
2. **Stillness is consent.** The tap sets the focus point; the photo is taken only after the phone has settled for about 0.8 s. The jolt from the tap fades before capture, and an accidental touch never takes a photo.
3. **Visible, physical progress.** A filling ring shows what is about to happen. If you move, it drains, so you stay in control without a button.
4. **Choose the moment afterwards.** A rewind strip (a simulated 3-second buffer in this prototype) removes the pressure of perfect timing. The sharpest frame is preselected, saves after 4 seconds, and Undo lasts 5 seconds.
5. **Whole-screen control.** No corner to reach, which suits one-handed and selfie use.
6. **Inclusive fallbacks.** Adjustable hold time, voice trigger and volume key for people who cannot hold still.
7. **Calm dark UI.** The photo is the hero; amber is reserved for action and "best".

Note: the timings (0.8 s, 4 s, 5 s) are starting values to tune through usability testing.
