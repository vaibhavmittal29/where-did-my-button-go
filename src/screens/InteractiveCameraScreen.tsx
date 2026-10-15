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
import { useSteadiness } from '../hooks/useSteadiness';
import { useHaptics } from '../hooks/useHaptics';
import {
  Settings2,
  RotateCcw,
  Zap,
  Mic,
  Moon,
  Users,
  FileText,
  Sparkles,
} from 'lucide-react';

export const InteractiveCameraScreen: React.FC = () => {
  const [state, dispatch] = useReducer(cameraReducer, initialCameraState);
  const { steadiness, setSteadiness, triggerShake, isHoldingSpace } = useSteadiness();
  const { triggerHaptic } = useHaptics();

  // Selected frame preview during review
  const [previewFrameIndex, setPreviewFrameIndex] = useState<number>(3);
  const [savedThumbnail, setSavedThumbnail] = useState<string>('/scenes/portrait-subject.jpg');
  const [flashActive, setFlashActive] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Group mode readiness count (3 of 4 or 4 of 4)
  const [groupReadyCount, setGroupReadyCount] = useState<number>(3);

  // Refs for tracking animation loops & timeouts
  const lastTickTimeRef = useRef<number>(performance.now());
  const unsteadySinceRef = useRef<number | null>(null);
  const autosaveTimerRef = useRef<number | null>(null);
  const autosaveStartRef = useRef<number | null>(null);
  const [autosaveProgress, setAutosaveProgress] = useState<number>(0);
  const undoTimeoutRef = useRef<number | null>(null);
  const groupHoldTimerRef = useRef<number | null>(null);

  const viewfinderRef = useRef<HTMLDivElement>(null);

  // Determine current scene background based on mode and state
  const getSceneSrc = () => {
    if (state.status === 'REVIEW') {
      return `/scenes/moment-${previewFrameIndex}.jpg`;
    }
    if (state.mode === 'group') {
      return '/scenes/group-campus.jpg';
    }
    if (state.mode === 'doc') {
      return '/scenes/whiteboard-notes.jpg';
    }
    return '/scenes/portrait-subject.jpg';
  };

  // 1. Subject Tap Handler (focus pin placement)
  const handleViewfinderTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only allow tapping when idle, focused, or locking
    if (state.status === 'REVIEW' || state.status === 'SAVED') return;

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

  // 3. State Machine: LOCKING loop (progress accumulation & unsteady detection)
  useEffect(() => {
    if (state.status !== 'LOCKING') return;

    let animId: number;
    lastTickTimeRef.current = performance.now();
    unsteadySinceRef.current = null;

    const tick = (now: number) => {
      const dt = now - lastTickTimeRef.current;
      lastTickTimeRef.current = now;

      if (steadiness >= 0.7) {
        unsteadySinceRef.current = null;
        dispatch({ type: 'STEADY_TICK', dt });
      } else {
        // Track unsteadiness duration
        if (unsteadySinceRef.current === null) {
          unsteadySinceRef.current = now;
        } else if (now - unsteadySinceRef.current > 200) {
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
  }, [state.status, steadiness, triggerHaptic]);

  // 4. Capture flash and transition from CAPTURED to REVIEW
  useEffect(() => {
    if (state.status === 'CAPTURED') {
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

  // 5. REVIEW Autosave 4-second Countdown
  useEffect(() => {
    if (state.status !== 'REVIEW') {
      setAutosaveProgress(0);
      if (autosaveTimerRef.current) cancelAnimationFrame(autosaveTimerRef.current);
      return;
    }

    autosaveStartRef.current = performance.now();
    const duration = 4000;

    const updateAutosave = (now: number) => {
      const elapsed = now - (autosaveStartRef.current || now);
      const progress = Math.min(1, elapsed / duration);
      setAutosaveProgress(progress);

      if (progress >= 1) {
        triggerHaptic('save');
        setSavedThumbnail(`/scenes/moment-${previewFrameIndex}.jpg`);
        dispatch({ type: 'TIMEOUT_REVIEW' });
      } else {
        autosaveTimerRef.current = requestAnimationFrame(updateAutosave);
      }
    };

    autosaveTimerRef.current = requestAnimationFrame(updateAutosave);
    return () => {
      if (autosaveTimerRef.current) cancelAnimationFrame(autosaveTimerRef.current);
    };
  }, [state.status, previewFrameIndex, triggerHaptic]);

  // 6. SAVED Toast & 5s Undo Window
  useEffect(() => {
    if (state.status === 'SAVED') {
      setToastMessage('Saved · Undo');
      if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);

      undoTimeoutRef.current = window.setTimeout(() => {
        setToastMessage(null);
        dispatch({ type: 'RESET' });
      }, 5000);

      return () => {
        if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
      };
    }
  }, [state.status]);

  // 7. Group Mode Hands-Free Auto-Capture
  useEffect(() => {
    if (state.mode !== 'group' || state.status === 'REVIEW' || state.status === 'SAVED') return;

    if (groupReadyCount >= 4 && steadiness >= 0.7) {
      if (!groupHoldTimerRef.current) {
        groupHoldTimerRef.current = window.setTimeout(() => {
          dispatch({ type: 'PROGRESS_COMPLETE' });
        }, 600);
      }
    } else {
      if (groupHoldTimerRef.current) {
        clearTimeout(groupHoldTimerRef.current);
        groupHoldTimerRef.current = null;
      }
    }

    return () => {
      if (groupHoldTimerRef.current) {
        clearTimeout(groupHoldTimerRef.current);
        groupHoldTimerRef.current = null;
      }
    };
  }, [state.mode, state.status, groupReadyCount, steadiness]);

  // Handlers for Undo and Reset
  const handleUndo = useCallback(() => {
    triggerHaptic('tap');
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    dispatch({ type: 'UNDO' });
    setToastMessage('Photo removed');
    setTimeout(() => {
      setToastMessage(null);
      dispatch({ type: 'RESET' });
    }, 1800);
  }, [triggerHaptic]);

  const handleReset = useCallback(() => {
    triggerHaptic('tap');
    setToastMessage(null);
    dispatch({ type: 'RESET' });
  }, [triggerHaptic]);

  // Group mode faces
  const groupFaces: FaceData[] = [
    { id: '1', name: groupReadyCount >= 4 ? 'Tara' : 'Tara · Blinking', top: '46.5%', left: '11.5%', width: '14%', height: '8%', isReady: groupReadyCount >= 4 },
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

          {/* White Flash / Shutterless Capture Pulse */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#ffffff',
            opacity: flashActive ? 0.85 : 0,
            pointerEvents: 'none',
            transition: 'opacity 0.12s ease-out',
            zIndex: 90,
          }} />

          {/* Group Mode Global Frame Ring */}
          {state.mode === 'group' && (
            <div style={{
              position: 'absolute',
              inset: '16px',
              borderRadius: '32px',
              border: `3px solid ${groupReadyCount >= 4 ? 'var(--success)' : 'var(--accent)'}`,
              opacity: 0.85,
              pointerEvents: 'none',
              boxShadow: `0 0 24px ${groupReadyCount >= 4 ? 'rgba(61, 220, 151, 0.4)' : 'rgba(255, 176, 32, 0.3)'}`,
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
          <header style={{
            position: 'relative',
            zIndex: 30,
            padding: 'var(--safe-top) var(--space-4) 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <IconButton icon={<Zap size={18} />} aria-label="Flash" />

            {/* Top Context Chip */}
            {state.mode === 'group' ? (
              <GlassChip
                icon={<Users size={14} />}
                variant={groupReadyCount >= 4 ? 'success' : 'accent'}
              >
                {groupReadyCount >= 4 ? 'All 4 Ready · Auto-Capturing' : `${groupReadyCount} of 4 ready`}
              </GlassChip>
            ) : state.isLowLight ? (
              <GlassChip icon={<Moon size={14} />} variant="accent">
                Low Light · 1.2s Hold
              </GlassChip>
            ) : (
              <GlassChip icon={<Sparkles size={14} />} variant="default">
                AI Best Shot Active
              </GlassChip>
            )}

            <IconButton icon={<Settings2 size={18} />} aria-label="Settings" />
          </header>

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
                  <GlassChip>Tap what you want to keep</GlassChip>
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
                onSelectFrame={(idx) => {
                  triggerHaptic('tap');
                  setPreviewFrameIndex(idx);
                  dispatch({ type: 'PICK_FRAME', index: idx });
                }}
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
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
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
              <div style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                {/* Gallery Thumbnail */}
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: 'var(--radius-card)',
                    overflow: 'hidden',
                    border: '1.5px solid rgba(255, 255, 255, 0.25)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    triggerHaptic('tap');
                    window.location.href = '/?screen=moments';
                  }}
                  title="View last capture in Moment Strip"
                >
                  <img
                    src={savedThumbnail}
                    alt="Gallery thumbnail"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Mode Carousel (No shutter button here — carousel takes bottom center) */}
                <ModeCarousel
                  activeMode={state.mode}
                  onModeChange={(m) => {
                    triggerHaptic('tap');
                    dispatch({ type: 'MODE_CHANGE', mode: m });
                  }}
                />

                {/* Flip Camera */}
                <IconButton
                  icon={<RotateCcw size={18} />}
                  aria-label="Switch lens"
                  onClick={() => triggerHaptic('tap')}
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
        groupReadyCount={groupReadyCount}
        onSetSteadiness={setSteadiness}
        onTriggerShake={triggerShake}
        onToggleLowLight={() => dispatch({ type: 'SET_LOW_LIGHT', isLowLight: !state.isLowLight })}
        onSetGroupReady={(count) => {
          setGroupReadyCount(count);
          dispatch({ type: 'SET_GROUP_READY', count });
        }}
        onTriggerVoice={(phrase) => {
          triggerHaptic('tap');
          dispatch({ type: 'VOICE_TRIGGER', phrase });
        }}
        onReset={handleReset}
        onModeChange={(m) => {
          triggerHaptic('tap');
          dispatch({ type: 'MODE_CHANGE', mode: m });
        }}
      />
    </div>
  );
};
