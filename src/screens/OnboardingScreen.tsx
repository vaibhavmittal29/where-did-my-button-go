import React, { useState, useEffect } from 'react';
import { PhoneFrame } from '../components/PhoneFrame';
import { LockRing } from '../components/LockRing';
import { GlassChip } from '../components/GlassChip';
import { Hand, Sparkles, Sliders } from 'lucide-react';

interface OnboardingScreenProps {
  pureDevice?: boolean;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ pureDevice = false }) => {
  const [demoProgress, setDemoProgress] = useState(0.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoProgress((prev) => (prev >= 1 ? 0.2 : prev + 0.15));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <PhoneFrame pureDevice={pureDevice}>
      <div style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg)',
        overflow: 'hidden'
      }}>
        {/* Top 55%: Interactive Mini-Demo Viewfinder */}
        <div style={{
          position: 'relative',
          height: '52%',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Background Scene */}
          <img
            src="/scenes/portrait-subject.jpg"
            alt="Viewfinder preview subject"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.85)',
            }}
          />

          {/* Top Scrim */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(to bottom, rgba(11, 11, 15, 0.8) 0%, transparent 100%)',
          }} />

          {/* Top Pill Brand */}
          <div style={{
            position: 'absolute',
            top: 'var(--safe-top)',
            left: 'var(--space-4)',
            zIndex: 10,
          }}>
            <GlassChip icon={<Sparkles size={14} />} variant="accent">STILL</GlassChip>
          </div>

          {/* Center Dynamic LockRing Demo */}
          <div style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            zIndex: 5,
          }}>
            <LockRing progress={demoProgress} size={104} />
            <GlassChip icon={<Hand size={14} />}>
              Hold steady · {Math.max(0, (0.8 * (1 - demoProgress))).toFixed(1)}s
            </GlassChip>
          </div>
        </div>

        {/* Bottom Sheet (Radius 28px, Surface 1) */}
        <div style={{
          height: '48%',
          width: '100%',
          backgroundColor: 'var(--surface-1)',
          borderTopLeftRadius: 'var(--radius-sheet)',
          borderTopRightRadius: 'var(--radius-sheet)',
          borderTop: '1px solid var(--glass-border)',
          padding: 'var(--space-6) var(--space-6) var(--safe-bottom)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 -16px 40px rgba(0, 0, 0, 0.6)',
          zIndex: 20,
        }}>
          {/* Header */}
          <div>
            <h1 style={{
              fontFamily: 'var(--font-family-display)',
              fontSize: '26px',
              fontWeight: 700,
              color: 'var(--text)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: 'var(--space-4)',
            }}>
              No shutter. Just stillness.
            </h1>

            {/* 3 Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--text-caption)',
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: '1px'
                }}>1</span>
                <div>
                  <strong style={{ color: 'var(--text)' }}>Tap</strong>
                  <span style={{ color: 'var(--text-dim)', marginLeft: '4px' }}>what matters to set focus.</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--text-caption)',
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: '1px'
                }}>2</span>
                <div>
                  <strong style={{ color: 'var(--text)' }}>Hold still</strong>
                  <span style={{ color: 'var(--text-dim)', marginLeft: '4px' }}>while the ring fills (~0.8s).</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--accent-soft)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 'var(--text-caption)',
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: '1px'
                }}>3</span>
                <div>
                  <strong style={{ color: 'var(--text)' }}>Rewind</strong>
                  <span style={{ color: 'var(--text-dim)', marginLeft: '4px' }}>to pick your best moment afterwards.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => { window.location.href = '/?screen=idle'; }}
              style={{
                width: '100%',
                padding: 'var(--space-3) var(--space-4)',
                backgroundColor: 'var(--accent)',
                color: 'var(--bg)',
                border: 'none',
                borderRadius: 'var(--radius-card)',
                fontFamily: 'var(--font-family-body)',
                fontSize: 'var(--text-body)',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(255, 176, 32, 0.3)',
                transition: 'transform var(--dur-fast) var(--ease-out)',
              }}
            >
              Got it
            </button>

            <a
              href="/?screen=idle"
              style={{
                color: 'var(--text-dim)',
                fontSize: 'var(--text-caption)',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Sliders size={12} />
              <span>Adjust steadiness sensitivity</span>
            </a>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
};
