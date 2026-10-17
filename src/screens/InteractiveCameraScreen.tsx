import React, { useReducer, useEffect, useRef, useState, useCallback } from 'react';
import { PhoneFrame } from '../components/PhoneFrame';
import { DemoPanel } from '../components/DemoPanel';
import { LockRing } from '../components/LockRing';
import { GlassChip } from '../components/GlassChip';
import { IconButton } from '../components/IconButton';
import { ModeCarousel } from '../components/ModeCarousel';
import { MomentStrip } from '../components/MomentStrip';
import { Toast } from '../components/Toast';
import { FaceChips, FaceData } from '../components/FaceChips';
import {
  cameraReducer,
  initialCameraState,
  getEffectiveHoldTime,
} from '../state/cameraMachine';
import {
  UNSTEADY_GRACE_MS,
  TIMEOUT_FOCUS_MS,
  COOLDOWN_MS,
  STEADY_THRESHOLD,
  GROUP_STEADY_HOLD_MS,
  AUTOSAVE_MS,
  UNDO_WINDOW_MS,
  VOICE_SUPPORTED_PHRASES,
} from '../state/constants';
import { useSteadiness } from '../hooks/useSteadiness';
import { useHaptics } from '../hooks/useHaptics';
import { getAssetPath, getScreenUrl } from '../utils/assetPath';
import {
  Settings2,
  RotateCcw,
  Zap,
  Mic,
  Moon,
  Users,
  FileText,
  Sparkles,
  X,
} from 'lucide-react';

export const InteractiveCameraScreen: React.FC = () => {
  const [state, dispatch] = useReducer(cameraReducer, initialCameraState);
  const {
    steadiness,
    setSteadiness,
    triggerShake,
    isHoldingSpace,
    isRealSensorEnabled,
    toggleRealSensor,
    sensorStatusText,
    sensorError,
  } = useSteadiness();
  const { triggerHaptic, isMuted, toggleMute } = useHaptics();

  // Selected frame preview during review
  const [previewFrameIndex, setPreviewFrameIndex] = useState<number>(3);
  const previewFrameIndexRef = useRef<number>(3);
  const hasResetAutosaveRef = useRef<boolean>(false);
  const [savedThumbnail, setSavedThumbnail] = useState<string>(getAssetPath('scenes/portrait-subject.jpg'));
  const [flashActive, setFlashActive] = useState<boolean>(false);
  const [flashMode, setFlashMode] = useState<'off' | 'auto' | 'on'>('auto');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // Group mode readiness count is managed directly in cameraMachine reducer (state.groupReadyCount)

  // P1-01: Track continuous steadiness duration
  const steadySinceRef = useRef<number | null>(null);
  useEffect(() => {
    if (steadiness >= STEADY_THRESHOLD) {
      if (steadySinceRef.current === null) {
        steadySinceRef.current = performance.now();
      }
    } else {
      steadySinceRef.current = null;
    }
  }, [steadiness]);

  // Dwell timer: if user holds phone steady in IDLE for 1.5s, prompt "Tap what matters"
  // P2-01: Stable boolean check so fluctuating continuous sensor updates do not restart the countdown
  const isSteadyForDwell = state.status === 'IDLE' && steadiness >= STEADY_THRESHOLD;
  const dwellTimerRef = useRef<number | null>(null);
  const [dwellHintActive, setDwellHintActive] = useState<boolean>(false);

  useEffect(() => {
    if (isSteadyForDwell) {
      if (!dwellTimerRef.current && !dwellHintActive) {
        dwellTimerRef.current = window.setTimeout(() => {
          setDwellHintActive(true);
          dwellTimerRef.current = null;
        }, 1500);
      }
    } else {
      if (dwellTimerRef.current) {
        clearTimeout(dwellTimerRef.current);
        dwellTimerRef.current = null;
      }
      setDwellHintActive(false);
    }
    return () => {
      if (dwellTimerRef.current) {
        clearTimeout(dwellTimerRef.current);
        dwellTimerRef.current = null;
      }
    };
  }, [isSteadyForDwell, dwellHintActive]);

  // Track 33% and 66% ring progress ticks (PLAN.md Section 6.4)
  const lastProgressRef = useRef<number>(0);
  useEffect(() => {
    if (state.status === 'LOCKING') {
      const prev = lastProgressRef.current;
      const curr = state.progress;
      if (prev < 0.33 && curr >= 0.33) triggerHaptic('tick');
      if (prev < 0.66 && curr >= 0.66) triggerHaptic('tick');
      lastProgressRef.current = curr;
    } else {
      lastProgressRef.current = 0;
    }
  }, [state.status, state.progress, triggerHaptic]);

  // Refs for tracking animation loops & timeouts
  const lastTickTimeRef = useRef<number>(performance.now());
  const unsteadySinceRef = useRef<number | null>(null);
  const autosaveTimerRef = useRef<number | null>(null);
  const autosaveStartRef = useRef<number | null>(null);
  const [autosaveProgress, setAutosaveProgress] = useState<number>(0);
  const undoTimeoutRef = useRef<number | null>(null);
  const undoSecondaryTimerRef = useRef<number | null>(null);
  const groupHoldTimerRef = useRef<number | null>(null);
  const lastCooldownTimeRef = useRef<number>(0);

  const viewfinderRef = useRef<HTMLDivElement>(null);
  const steadinessRef = useRef<number>(steadiness);
  steadinessRef.current = steadiness;
  useEffect(() => {
    steadinessRef.current = steadiness;
  }, [steadiness]);

  // Determine current scene background based on mode and state
  const getSceneSrc = () => {
    if (state.status === 'REVIEW') {
      return getAssetPath(`scenes/moment-${previewFrameIndex}.jpg`);
    }
    if (state.mode === 'group') {
      return getAssetPath('scenes/group-campus.jpg');
    }
    if (state.mode === 'doc') {
      return getAssetPath('scenes/whiteboard-notes.jpg');
    }
    return getAssetPath('scenes/portrait-subject.jpg');
  };

  // 1. Subject Tap Handler (focus pin placement)
  const handleViewfinderTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only allow tapping when idle, focused, or locking
    if (state.status === 'REVIEW' || state.status === 'SAVED') return;

    // P1-03: Enforce capture/reset cooldown (600ms) to prevent accidental double-taps
    if (performance.now() - lastCooldownTimeRef.current < COOLDOWN_MS) return;

    // P0-01: Tap to focus MUST only fire when clicking the viewfinder background,
    // not header, footer, controls, chips, buttons, carousel, demo panel, or dialogs.
    const target = e.target as HTMLElement | null;
    if (target && target.closest('button, [role="button"], [role="tab"], [role="dialog"], header, footer, [data-no-focus], input, select, textarea')) {
      return;
    }

    if (!viewfinderRef.current) return;
    const rect = viewfinderRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    triggerHaptic('tap');
    dispatch({ type: 'TAP_SUBJECT', x, y });
  };

  // 2. State Machine: FOCUSED -> LOCKING transition on steadiness
  useEffect(() => {
    if (state.status === 'FOCUSED') {
      if (steadiness >= 0.7) {
        dispatch({ type: 'STEADY_OK' });
      }
    }
  }, [state.status, steadiness]);

  // 2b. State Machine: FOCUSED -> IDLE timeout (3000ms) if no steady hold begins (P1-02)
  useEffect(() => {
    if (state.status === 'FOCUSED') {
      const focusTimer = window.setTimeout(() => {
        dispatch({ type: 'TIMEOUT_FOCUS' });
      }, TIMEOUT_FOCUS_MS);

      return () => {
        clearTimeout(focusTimer);
      };
    }
  }, [state.status]);

  // 3. State Machine: LOCKING loop (progress accumulation & unsteady detection)
  useEffect(() => {
    if (state.status !== 'LOCKING') return;

    let animId: number;
    lastTickTimeRef.current = performance.now();
    unsteadySinceRef.current = null;

    const tick = (now: number) => {
      const rawDt = now - lastTickTimeRef.current;
      lastTickTimeRef.current = now;

      // Phase 2.1: Clamp RAF delta to 100ms to prevent instant lock ring jumps after background tab resume
      const dt = Math.min(100, Math.max(0, rawDt));

      // P0-03: Read steadiness from ref so RAF loop is not torn down on every sensor update
      const currentSteadiness = steadinessRef.current;
      if (currentSteadiness >= STEADY_THRESHOLD) {
        unsteadySinceRef.current = null;
        dispatch({ type: 'STEADY_TICK', dt });
      } else {
        // Track unsteadiness duration
        if (unsteadySinceRef.current === null) {
          unsteadySinceRef.current = now;
        } else if (now - unsteadySinceRef.current > UNSTEADY_GRACE_MS) {
          // Unsteady exceeded grace period -> cancel & drain ring
          triggerHaptic('error');
          dispatch({ type: 'UNSTEADY' });
          return;
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [state.status, triggerHaptic]);

  // Phase 2.1: Reset lock accumulation and cancel when tab is backgrounded
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (state.status === 'LOCKING') {
          dispatch({ type: 'UNSTEADY' });
        }
      } else {
        lastTickTimeRef.current = performance.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [state.status]);

  // 4. Capture flash and transition from CAPTURED to REVIEW
  useEffect(() => {
    if (state.status === 'CAPTURED') {
      lastCooldownTimeRef.current = performance.now();
      triggerHaptic('capture');
      setFlashActive(true);

      const flashTimer = window.setTimeout(() => {
        setFlashActive(false);
      }, 150);

      const animDoneTimer = window.setTimeout(() => {
        dispatch({ type: 'ANIM_DONE' });
      }, 350);

      return () => {
        clearTimeout(flashTimer);
        clearTimeout(animDoneTimer);
      };
    }
  }, [state.status, triggerHaptic]);

  // 4b. Auto-recovery from CANCELLED state back to FOCUSED (P0-02)
  useEffect(() => {
    if (state.status === 'CANCELLED') {
      const recoveryTimer = window.setTimeout(() => {
        dispatch({ type: 'ANIM_DONE' });
      }, 800);

      return () => {
        clearTimeout(recoveryTimer);
      };
    }
  }, [state.status]);

  // 5. REVIEW Autosave Countdown (P2-02: AUTOSAVE_MS, Max 1 reset on frame scrub)
  useEffect(() => {
    if (state.status !== 'REVIEW') {
      setAutosaveProgress(0);
      if (autosaveTimerRef.current) cancelAnimationFrame(autosaveTimerRef.current);
      return;
    }

    hasResetAutosaveRef.current = false;
    previewFrameIndexRef.current = 3;
    setPreviewFrameIndex(3);
    autosaveStartRef.current = performance.now();
    const duration = AUTOSAVE_MS;

    const updateAutosave = (now: number) => {
      const elapsed = now - (autosaveStartRef.current || now);
      const progress = Math.min(1, elapsed / duration);
      setAutosaveProgress(progress);

      if (progress >= 1) {
        triggerHaptic('save');
        setSavedThumbnail(getAssetPath(`scenes/moment-${previewFrameIndexRef.current}.jpg`));
        dispatch({ type: 'TIMEOUT_REVIEW' });
      } else {
        autosaveTimerRef.current = requestAnimationFrame(updateAutosave);
      }
    };

    autosaveTimerRef.current = requestAnimationFrame(updateAutosave);
    return () => {
      if (autosaveTimerRef.current) cancelAnimationFrame(autosaveTimerRef.current);
    };
  }, [state.status, triggerHaptic]);

  // Frame selection in Moment Strip (resets 4s timer once if not already reset)
  const handleSelectFrame = useCallback((index: number) => {
    setPreviewFrameIndex(index);
    previewFrameIndexRef.current = index;
    triggerHaptic('tick');
    dispatch({ type: 'PICK_FRAME', index });
    if (!hasResetAutosaveRef.current) {
      hasResetAutosaveRef.current = true;
      autosaveStartRef.current = performance.now();
      setAutosaveProgress(0);
    }
  }, [triggerHaptic]);

  // 6. SAVED Toast & 5s Undo Window
  useEffect(() => {
    if (state.status === 'SAVED') {
      setToastMessage('Saved · Undo');
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);

      undoTimeoutRef.current = window.setTimeout(() => {
        setToastMessage(null);
        dispatch({ type: 'RESET' });
      }, UNDO_WINDOW_MS);

      return () => {
        if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
      };
    } else if (state.status !== 'IDLE') {
      setToastMessage((prev) => (prev === 'Saved · Undo' ? null : prev));
    }
  }, [state.status]);

  // 7. Group Mode Hands-Free Auto-Capture (P0-04, P1-01)
  useEffect(() => {
    if (
      state.mode !== 'group' ||
      !state.groupAutoCaptureArmed ||
      state.status === 'REVIEW' ||
      state.status === 'SAVED' ||
      state.status === 'CAPTURED'
    ) {
      if (groupHoldTimerRef.current) {
        clearTimeout(groupHoldTimerRef.current);
        groupHoldTimerRef.current = null;
      }
      return;
    }

    const isSteady = steadiness >= STEADY_THRESHOLD;
    const isGroupReady = state.groupReadyCount >= state.groupTotalCount;

    if (isGroupReady && isSteady && state.groupAutoCaptureArmed) {
      if (!groupHoldTimerRef.current) {
        groupHoldTimerRef.current = window.setTimeout(() => {
          dispatch({ type: 'PROGRESS_COMPLETE' });
          groupHoldTimerRef.current = null;
        }, GROUP_STEADY_HOLD_MS);
      }
    } else {
      if (groupHoldTimerRef.current) {
        clearTimeout(groupHoldTimerRef.current);
        groupHoldTimerRef.current = null;
      }
    }
  }, [
    state.mode,
    state.status,
    state.groupReadyCount,
    state.groupTotalCount,
    state.groupAutoCaptureArmed,
    steadiness >= STEADY_THRESHOLD,
  ]);

  // Clean up group timer on unmount
  useEffect(() => {
    return () => {
      if (groupHoldTimerRef.current) {
        clearTimeout(groupHoldTimerRef.current);
        groupHoldTimerRef.current = null;
      }
    };
  }, []);

  // Guarded triggers for Volume Key & Voice (P1-01 & P1-04: requires stability interval, cooldown, no capture haptic on reject)
  const handleVolumeKeyTrigger = useCallback(() => {
    if (performance.now() - lastCooldownTimeRef.current < COOLDOWN_MS) {
      triggerHaptic('error');
      return;
    }
    if (!['IDLE', 'FOCUSED', 'LOCKING'].includes(state.status)) {
      triggerHaptic('error');
      return;
    }
    if (state.mode === 'group' && state.groupReadyCount < state.groupTotalCount) {
      dispatch({ type: 'VOLUME_KEY', isSteady: true });
      triggerHaptic('error');
      return;
    }
    // Require phone to have been held steady continuously for at least 800ms
    const isSteady =
      steadinessRef.current >= STEADY_THRESHOLD &&
      steadySinceRef.current !== null &&
      performance.now() - steadySinceRef.current >= 800;

    dispatch({ type: 'VOLUME_KEY', isSteady });
    if (isSteady) {
      lastCooldownTimeRef.current = performance.now();
      // Single-source capture feedback: triggered once in CAPTURED status effect
    } else {
      triggerHaptic('error');
    }
  }, [state.status, state.mode, state.groupReadyCount, state.groupTotalCount, triggerHaptic]);

  const handleVoiceTrigger = useCallback((phrase: string) => {
    if (performance.now() - lastCooldownTimeRef.current < COOLDOWN_MS) {
      triggerHaptic('error');
      return;
    }
    if (!['IDLE', 'FOCUSED', 'LOCKING'].includes(state.status)) {
      triggerHaptic('error');
      return;
    }
    if (state.mode === 'group' && state.groupReadyCount < state.groupTotalCount) {
      dispatch({ type: 'VOICE_TRIGGER', phrase, isSteady: true });
      triggerHaptic('error');
      return;
    }
    const phraseLower = (phrase || '').trim().toLowerCase();
    const isSupported = (VOICE_SUPPORTED_PHRASES as readonly string[]).includes(phraseLower);
    if (!isSupported) {
      dispatch({ type: 'VOICE_TRIGGER', phrase, isSteady: true });
      triggerHaptic('error');
      return;
    }

    // Require phone to have been held steady continuously for at least 800ms
    const isSteady =
      steadinessRef.current >= STEADY_THRESHOLD &&
      steadySinceRef.current !== null &&
      performance.now() - steadySinceRef.current >= 800;

    dispatch({ type: 'VOICE_TRIGGER', phrase, isSteady });
    if (isSteady) {
      lastCooldownTimeRef.current = performance.now();
      // Single-source capture feedback: triggered once in CAPTURED status effect
    } else {
      triggerHaptic('error');
    }
  }, [state.status, state.mode, state.groupReadyCount, state.groupTotalCount, triggerHaptic]);

  // 8. Alternate Input Trigger: Volume Key / 'C' key (requires continuous stillness, avoids screen tap shake)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes((e.target as HTMLElement)?.tagName) ||
          (e.target as HTMLElement)?.closest('button, [role="button"], [role="tab"], [contenteditable]')) {
        return;
      }
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        handleVolumeKeyTrigger();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleVolumeKeyTrigger]);

  // Handlers for Undo and Reset (P1-17: track and clean up secondary timeout)
  const handleUndo = useCallback(() => {
    if (state.status !== 'SAVED' || !state.canUndo) return;
    triggerHaptic('tap');
    lastCooldownTimeRef.current = performance.now();
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    if (undoSecondaryTimerRef.current) clearTimeout(undoSecondaryTimerRef.current);
    if (groupHoldTimerRef.current) {
      clearTimeout(groupHoldTimerRef.current);
      groupHoldTimerRef.current = null;
    }
    dispatch({ type: 'UNDO' });
    setToastMessage('Photo removed');
    undoSecondaryTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      dispatch({ type: 'RESET' });
      undoSecondaryTimerRef.current = null;
    }, 1800);
  }, [state.status, state.canUndo, triggerHaptic]);

  const handleReset = useCallback(() => {
    triggerHaptic('tap');
    lastCooldownTimeRef.current = 0;
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    if (undoSecondaryTimerRef.current) clearTimeout(undoSecondaryTimerRef.current);
    if (groupHoldTimerRef.current) {
      clearTimeout(groupHoldTimerRef.current);
      groupHoldTimerRef.current = null;
    }
    setToastMessage(null);
    dispatch({ type: 'RESET' });
  }, [triggerHaptic]);

  // Cleanup undo secondary timer on unmount (P1-17)
  useEffect(() => {
    return () => {
      if (undoSecondaryTimerRef.current) {
        clearTimeout(undoSecondaryTimerRef.current);
        undoSecondaryTimerRef.current = null;
      }
    };
  }, []);

  // Group mode faces
  const groupFaces: FaceData[] = [
    { id: '1', name: state.groupReadyCount >= 4 ? 'Tara' : 'Tara · Blinking', top: '46.5%', left: '11.5%', width: '14%', height: '8%', isReady: state.groupReadyCount >= 4 },
    { id: '2', name: 'Aarav', top: '47%', left: '31%', width: '12.5%', height: '8%', isReady: true },
    { id: '3', name: 'Pooja', top: '48%', left: '54.5%', width: '12%', height: '8%', isReady: true },
    { id: '4', name: 'Neha', top: '46%', left: '73%', width: '12.5%', height: '8%', isReady: true },
  ];

  const focusPoint = state.focusPoint || { x: 50, y: 45 };
  const effectiveHoldTime = getEffectiveHoldTime(state.isLowLight) / 1000;
  const remainingHoldSec = Math.max(0, (1 - state.progress) * effectiveHoldTime);

  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 'var(--space-8)',
      minHeight: '100vh',
      width: '100%',
      padding: 'var(--space-6)',
      backgroundColor: 'var(--bg)',
      boxSizing: 'border-box',
    }}>
      {/* 1. Mobile Phone Viewfinder Screen */}
      <PhoneFrame pureDevice={true}>
        <div
          ref={viewfinderRef}
          onClick={handleViewfinderTap}
          style={{
            position: 'relative',
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: 'var(--bg)',
            overflow: 'hidden',
            cursor: state.status === 'REVIEW' ? 'default' : 'crosshair',
          }}
        >
          {/* Accessible Screen Reader Status Announcements */}
          <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {state.status === 'IDLE' && 'Camera ready. Tap viewfinder to focus and hold steady to capture.'}
            {state.status === 'FOCUSED' && 'Subject focused. Hold phone steady to lock.'}
            {state.status === 'LOCKING' && `Locking capture. ${Math.round(state.progress * 100)} percent.`}
            {state.status === 'CAPTURED' && 'Photo captured. Reviewing best moment in Moment Strip.'}
            {state.status === 'REVIEW' && `Reviewing frame ${previewFrameIndex + 1} of 7. Autosaving.`}
            {state.status === 'SAVED' && 'Photo saved (simulated). Undo available.'}
            {state.status === 'CANCELLED' && 'Too much movement — hold still.'}
          </div>

          {/* Live Viewfinder Background Photo */}
          <img
            src={getSceneSrc()}
            alt="Camera viewfinder scene"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center center',
              transition: 'opacity 0.2s ease-out',
            }}
          />

          {/* Shutterless Capture Pulse (Subtle perimeter bloom, avoiding harsh white flash) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            boxShadow: flashActive
              ? 'inset 0 0 80px 24px rgba(255, 176, 32, 0.45), inset 0 0 120px 48px rgba(255, 255, 255, 0.3)'
              : 'none',
            backgroundColor: flashActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
            opacity: flashActive ? 1 : 0,
            pointerEvents: 'none',
            transition: 'opacity 0.15s ease-out',
            zIndex: 90,
          }} />

          {/* Group Mode Global Frame Ring */}
          {state.mode === 'group' && (
            <div style={{
              position: 'absolute',
              inset: '16px',
              borderRadius: '32px',
              border: `3px solid ${state.groupReadyCount >= 4 ? 'var(--success)' : 'var(--accent)'}`,
              opacity: 0.85,
              pointerEvents: 'none',
              boxShadow: `0 0 24px ${state.groupReadyCount >= 4 ? 'rgba(61, 220, 151, 0.4)' : 'rgba(255, 176, 32, 0.3)'}`,
              transition: 'all var(--dur-base) var(--ease-out)',
              zIndex: 12,
            }} />
          )}

          {/* Top Vignette Scrim */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '140px',
            background: 'linear-gradient(to bottom, rgba(11, 11, 15, 0.8) 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 10,
          }} />

          {/* Bottom Vignette Scrim */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '180px',
            background: 'linear-gradient(to top, rgba(11, 11, 15, 0.85) 0%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 10,
          }} />

          {/* Top Controls Bar */}
          <header
            role="group"
            aria-label="Camera header controls"
            style={{
              position: 'relative',
              zIndex: 30,
              padding: 'var(--safe-top) var(--space-4) 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <IconButton
              icon={<Zap size={18} />}
              aria-label={`Flash mode: ${flashMode}`}
              onClick={() => {
                triggerHaptic('tap');
                const next = flashMode === 'auto' ? 'on' : flashMode === 'on' ? 'off' : 'auto';
                setFlashMode(next);
                setToastMessage(`Flash: ${next.toUpperCase()}`);
                setTimeout(() => setToastMessage((p) => (p?.startsWith('Flash:') ? null : p)), 1400);
              }}
            />

            {/* Top Context Chip */}
            {state.mode === 'group' ? (
              <GlassChip
                icon={<Users size={14} />}
                variant={state.groupReadyCount >= 4 ? 'success' : 'accent'}
              >
                {state.groupReadyCount >= 4 ? 'All 4 Ready (simulated) · Hold still to capture' : `${state.groupReadyCount} of 4 ready (simulated)`}
              </GlassChip>
            ) : state.isLowLight ? (
              <GlassChip icon={<Moon size={14} />} variant="accent">
                Low Light · 1.2s Hold
              </GlassChip>
            ) : (
              <GlassChip icon={<Sparkles size={14} />} variant="default">
                Rewind Buffer Active (simulated)
              </GlassChip>
            )}

            <IconButton
              icon={<Settings2 size={18} />}
              aria-label="Settings"
              onClick={() => {
                triggerHaptic('tap');
                setIsSettingsOpen(true);
              }}
            />
          </header>

          {/* Settings Modal Sheet */}
          {isSettingsOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="camera-settings-title"
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(11, 11, 15, 0.85)',
                backdropFilter: 'blur(16px)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
              onClick={() => setIsSettingsOpen(false)}
            >
              <div
                style={{
                  backgroundColor: 'var(--surface-1)',
                  borderTop: '1px solid var(--glass-border)',
                  borderRadius: '24px 24px 0 0',
                  padding: 'var(--space-6) var(--space-4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-4)',
                  boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.6)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 id="camera-settings-title" style={{ margin: 0, fontSize: '17px', fontWeight: 600, color: 'var(--text)' }}>
                    STILL Settings
                  </h3>
                  <IconButton
                    icon={<X size={18} />}
                    aria-label="Close settings"
                    onClick={() => setIsSettingsOpen(false)}
                  />
                </div>

                {/* Tunable Hold Duration */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Stillness Hold Duration</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{state.baseHoldTime} ms</span>
                  </div>
                  <input
                    type="range"
                    min={400}
                    max={1500}
                    step={50}
                    value={state.baseHoldTime}
                    onChange={(e) => dispatch({ type: 'SET_HOLD_TIME', holdTimeMs: parseInt(e.target.value, 10) })}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                    aria-label="Stillness hold duration in milliseconds"
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-dim)' }}>
                    <span>400ms (Fast)</span>
                    <span>800ms (Default)</span>
                    <span>1500ms (Steady)</span>
                  </div>
                </div>

                {/* Audio Feedback Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid var(--glass-border)' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>Sound & Haptic Feedback</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Progress clicks and capture confirmation</div>
                  </div>
                  <button
                    onClick={toggleMute}
                    style={{
                      minHeight: '44px',
                      minWidth: '44px',
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid var(--glass-border)',
                      backgroundColor: isMuted ? 'transparent' : 'var(--accent)',
                      color: isMuted ? 'var(--text-dim)' : 'var(--bg)',
                      fontWeight: 600,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isMuted ? 'Muted' : 'Sound On'}
                  </button>
                </div>

                {/* Hardware Sensors Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: '1px solid var(--glass-border)' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>Device Motion Heuristic</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{sensorError || 'Device motion (acceleration heuristic) if supported'}</div>
                  </div>
                  <button
                    onClick={toggleRealSensor}
                    style={{
                      minHeight: '44px',
                      minWidth: '44px',
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-pill)',
                      border: '1px solid var(--glass-border)',
                      backgroundColor: isRealSensorEnabled ? 'var(--accent)' : 'transparent',
                      color: isRealSensorEnabled ? 'var(--bg)' : 'var(--text-dim)',
                      fontWeight: 600,
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isRealSensorEnabled ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Group Mode Detected Faces */}
          {state.mode === 'group' && state.status !== 'REVIEW' && (
            <FaceChips faces={groupFaces} />
          )}

          {/* Document Mode Scanning Corners */}
          {state.mode === 'doc' && state.status !== 'REVIEW' && (
            <div style={{
              position: 'absolute',
              top: '22%',
              left: '12%',
              width: '76%',
              height: '52%',
              border: '2px dashed var(--accent)',
              borderRadius: 'var(--radius-card)',
              pointerEvents: 'none',
              boxShadow: '0 0 16px rgba(255, 176, 32, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <GlassChip icon={<FileText size={14} />}>Hold still over document</GlassChip>
            </div>
          )}

          {/* Core Interactive Ring: Ghost Ring in IDLE or Active Fill in FOCUSED/LOCKING */}
          {state.mode === 'still' && (
            <>
              {state.status === 'IDLE' && (
                <div style={{
                  position: 'absolute',
                  top: '45%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  pointerEvents: 'none',
                }}>
                  <LockRing state="idle" progress={0} size={96} showBrackets={false} />
                  <GlassChip>{dwellHintActive ? 'Tap what matters' : 'Tap what you want to keep'}</GlassChip>
                </div>
              )}

              {(state.status === 'FOCUSED' || state.status === 'LOCKING' || state.status === 'CANCELLED') && (
                <div style={{
                  position: 'absolute',
                  top: `${focusPoint.y}%`,
                  left: `${focusPoint.x}%`,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  pointerEvents: 'none',
                  zIndex: 25,
                }}>
                  <LockRing
                    progress={state.progress}
                    state={state.status === 'CANCELLED' ? 'danger' : 'locking'}
                    size={96}
                    showBrackets={true}
                  />

                  {/* Microcopy Under Ring */}
                  {state.status === 'LOCKING' && (
                    <GlassChip variant="accent">
                      {`Hold steady · ${remainingHoldSec.toFixed(1)}s`}
                    </GlassChip>
                  )}
                  {state.status === 'FOCUSED' && (
                    <GlassChip>
                      {steadiness >= 0.7 ? 'Hold still…' : 'Hold steady to capture'}
                    </GlassChip>
                  )}
                  {state.status === 'CANCELLED' && (
                    <GlassChip variant="accent">
                      Too much movement
                    </GlassChip>
                  )}
                </div>
              )}
            </>
          )}

          {/* Bottom Toast Notification */}
          {toastMessage && (
            <div style={{
              position: 'absolute',
              bottom: '120px',
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              zIndex: 80,
              pointerEvents: 'auto',
            }}>
              <Toast
                message={toastMessage}
                type={toastMessage.includes('removed') ? 'warn' : 'success'}
                actionLabel={toastMessage.includes('Undo') ? 'Undo' : undefined}
                onAction={handleUndo}
              />
            </div>
          )}

          {/* Review Mode: Moment Strip Panel */}
          {state.status === 'REVIEW' && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 50,
            }}>
              <MomentStrip
                selectedIndex={previewFrameIndex}
                bestIndex={3}
                countdownProgress={autosaveProgress}
                onSelectFrame={handleSelectFrame}
              />
            </div>
          )}

          {/* Bottom Controls Row: Gallery, Mode Carousel, Camera Flip */}
          {state.status !== 'REVIEW' && (
            <footer style={{
              position: 'relative',
              zIndex: 30,
              padding: '0 var(--space-4) var(--safe-bottom)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-3)',
            }}>
              {/* Steadiness Waveform / Meter replacing discrete shutter */}
              {state.status === 'LOCKING' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'rgba(11, 11, 15, 0.7)',
                  border: '1px solid var(--glass-border)',
                }}>
                  <div style={{
                    width: '60px',
                    height: '3px',
                    borderRadius: '2px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${Math.round(steadiness * 100)}%`,
                      height: '100%',
                      backgroundColor: steadiness >= 0.7 ? 'var(--success)' : 'var(--accent)',
                      transition: 'width 0.1s ease-out',
                    }} />
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>
                    {steadiness >= 0.7 ? 'Steady' : 'Hold still'}
                  </span>
                </div>
              )}

              {/* Hands-Free Voice Hint in Group Mode */}
              {state.mode === 'group' && state.status === 'IDLE' && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--glass)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text)',
                  fontSize: 'var(--text-caption)',
                  fontWeight: 500,
                }}>
                  <Mic size={13} color="var(--accent)" />
                  <span>Or say <strong>"Cheese"</strong> / <strong>"Capture"</strong></span>
                </div>
              )}

              {/* Main Controls Row */}
              <div
                role="group"
                aria-label="Camera primary controls"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {/* Gallery Thumbnail (P1-15: semantic button) */}
                <button
                  type="button"
                  style={{
                    width: '44px',
                    height: '44px',
                    minWidth: '44px',
                    minHeight: '44px',
                    padding: 0,
                    borderRadius: 'var(--radius-card)',
                    overflow: 'hidden',
                    border: '1.5px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                    cursor: 'pointer',
                    background: 'transparent',
                  }}
                  onClick={() => {
                    triggerHaptic('tap');
                    window.location.href = getScreenUrl('screen=moments');
                  }}
                  aria-label="View last capture in Moment Strip"
                  title="View last capture in Moment Strip"
                >
                  <img
                    src={savedThumbnail}
                    alt="Gallery thumbnail"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </button>

                {/* Mode Carousel (No shutter button here — carousel takes bottom center) */}
                <ModeCarousel
                  activeMode={state.mode}
                  disabled={state.status === 'CAPTURED' || state.status === 'SAVED'}
                  onModeChange={(m) => {
                    triggerHaptic('tap');
                    dispatch({ type: 'MODE_CHANGE', mode: m });
                  }}
                />

                {/* Flip Camera */}
                <IconButton
                  icon={<RotateCcw size={18} />}
                  aria-label="Switch lens (prototype simulation)"
                  onClick={() => {
                    triggerHaptic('tap');
                    setToastMessage('Switch lens (prototype simulation)');
                    setTimeout(() => setToastMessage(null), 1800);
                  }}
                />
              </div>
            </footer>
          )}
        </div>
      </PhoneFrame>

      {/* 2. Interactive Demo Panel for Testers / Presenters */}
      <DemoPanel
        status={state.status}
        mode={state.mode}
        steadiness={steadiness}
        isHoldingSpace={isHoldingSpace}
        isLowLight={state.isLowLight}
        groupReadyCount={state.groupReadyCount}
        isMuted={isMuted}
        isRealSensorEnabled={isRealSensorEnabled}
        sensorStatusText={sensorStatusText}
        sensorError={sensorError}
        onToggleMute={toggleMute}
        onToggleRealSensor={toggleRealSensor}
        onSetSteadiness={setSteadiness}
        onTriggerShake={triggerShake}
        onToggleLowLight={() => dispatch({ type: 'SET_LOW_LIGHT', isLowLight: !state.isLowLight })}
        onSetGroupReady={(count) => {
          dispatch({ type: 'SET_GROUP_READY', count });
        }}
        onTriggerVoice={handleVoiceTrigger}
        onTriggerVolumeKey={handleVolumeKeyTrigger}
        onReset={handleReset}
        onModeChange={(m) => {
          triggerHaptic('tap');
          dispatch({ type: 'MODE_CHANGE', mode: m });
        }}
      />
    </div>
  );
};
