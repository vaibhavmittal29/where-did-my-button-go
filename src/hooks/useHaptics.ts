import { useState, useCallback } from 'react';

export type HapticType = 'tap' | 'tick' | 'capture' | 'error' | 'save';

export function useHaptics() {
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const triggerHaptic = useCallback((type: HapticType = 'tap') => {
    if (isMuted) return;

    // 1. Physical Device Vibration (navigator.vibrate)
    // Matches PLAN.md Section 6.4 table:
    // Tap subject: 10ms | Ring 33%/66%: 8ms | Capture: [18, 30, 18] | Cancelled: [30] | Saved: 12ms
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        switch (type) {
          case 'tap':
            navigator.vibrate(10);
            break;
          case 'tick':
            navigator.vibrate(8);
            break;
          case 'capture':
            navigator.vibrate([18, 30, 18]);
            break;
          case 'error':
            navigator.vibrate(30);
            break;
          case 'save':
            navigator.vibrate(12);
            break;
        }
      } catch {
        // Ignore devices blocking vibrate without user interaction
      }
    }

    // 2. Synthetic Audio Feedback (Web Audio API)
    // Produces a subtle, authentic camera mechanical/haptic impulse click
    if (typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.connect(gain);
          gain.connect(ctx.destination);

          const now = ctx.currentTime;

          if (type === 'capture') {
            // Camera mechanical click: crisp high-pitch tick followed by resonant thud
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
          } else if (type === 'error') {
            // Soft cancellation low tone
            osc.frequency.setValueAtTime(180, now);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
          } else if (type === 'tick') {
            // Subtle ring fill progress tick
            osc.frequency.setValueAtTime(1200, now);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
            osc.start(now);
            osc.stop(now + 0.015);
          } else if (type === 'save') {
            // Positive confirmation chirp
            osc.frequency.setValueAtTime(520, now);
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);
            osc.start(now);
            osc.stop(now + 0.07);
          } else {
            // Subtle UI tap
            osc.frequency.setValueAtTime(600, now);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.02);
            osc.start(now);
            osc.stop(now + 0.02);
          }
        }
      } catch {
        // AudioContext may be suspended before first gesture
      }
    }
  }, [isMuted]);

  return { triggerHaptic, isMuted, toggleMute };
}
