import React from 'react';
import { PhoneFrame } from '../components/PhoneFrame';
import { LockRing } from '../components/LockRing';
import { ModeCarousel } from '../components/ModeCarousel';
import { IconButton } from '../components/IconButton';
import { GlassChip } from '../components/GlassChip';
import { Settings2, RotateCcw, Zap, Sun, Hand, Activity } from 'lucide-react';
import { getAssetPath, getScreenUrl } from '../utils/assetPath';

interface LockingScreenProps {
  pureDevice?: boolean;
}

export const LockingScreen: React.FC<LockingScreenProps> = ({ pureDevice = false }) => {
  const urlParams = new URLSearchParams(window.location.search);
  const rawProgress = parseFloat(urlParams.get('progress') || '0.6');
  const progressParam = isNaN(rawProgress) ? 0.6 : Math.max(0, Math.min(1, rawProgress));
  const isAnnotated = urlParams.get('annotate') === '1';

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
        {/* Full-Bleed Viewfinder Photo (dimmed 8% to highlight focus ring) */}
        <img
          src={getAssetPath('scenes/portrait-subject.jpg')}
          alt="Subject being locked and tracked"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.92) contrast(1.05)',
          }}
        />

        {/* Central Focus Radial Vignette */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 45%, transparent 25%, rgba(11, 11, 15, 0.45) 85%)',
          pointerEvents: 'none',
        }} />

        {/* Top Scrim */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '140px',
          background: 'linear-gradient(to bottom, rgba(11, 11, 15, 0.75) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Bottom Scrim */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'linear-gradient(to top, rgba(11, 11, 15, 0.85) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Top Bar */}
        <header style={{
          position: 'relative',
          zIndex: 10,
          padding: 'var(--safe-top) var(--space-4) 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <IconButton icon={<Zap size={18} />} aria-label="Flash mode (prototype)" />
          
          <GlassChip icon={<Sun size={14} />} variant="accent">
            Locking Focus · 1×
          </GlassChip>

          <IconButton icon={<Settings2 size={18} />} aria-label="Settings (prototype)" />
        </header>

        {/* Core Hero Interaction: Anchored LockRing + Real-Time Status */}
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 15,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-3)',
        }}>
          {/* LockRing at specified progress (60% default) */}
          <div style={{ position: 'relative' }}>
            <LockRing
              progress={progressParam}
              state="locking"
              size={104}
              strokeWidth={4}
              showBrackets={true}
            />

            {/* Annotation callout 1 if annotated */}
            {isAnnotated && (
              <span style={{
                position: 'absolute',
                top: -12,
                right: -12,
                width: 24,
                height: 24,
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--accent)',
                color: 'var(--bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 12,
              }}>1</span>
            )}
          </div>

          {/* Dynamic Timing Chip */}
          <div style={{ position: 'relative' }}>
            <GlassChip icon={<Hand size={14} />} variant="accent">
              Hold steady · {(0.8 * (1 - progressParam)).toFixed(1)}s
            </GlassChip>

            {isAnnotated && (
              <span style={{
                position: 'absolute',
                top: -8,
                right: -24,
                width: 20,
                height: 20,
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--accent)',
                color: 'var(--bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 11,
              }}>2</span>
            )}
          </div>
        </div>

        {/* Bottom Bar: Steadiness Waveform Meter & Mode Carousel */}
        <footer style={{
          position: 'relative',
          zIndex: 10,
          padding: '0 var(--space-4) var(--safe-bottom)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}>
          {/* Steadiness Waveform Meter (Straightens as stability increases) */}
          <div style={{
            position: 'relative',
            width: '180px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--accent)',
              fontSize: 'var(--text-caption)',
              fontWeight: 500,
              textShadow: '0 1px 4px rgba(0,0,0,0.8)'
            }}>
              <Activity size={12} />
              <span>Steadiness: Optimal (Simulated)</span>
            </div>

            {/* SVG Steadiness Line */}
            <svg width="160" height="12" viewBox="0 0 160 12" style={{ overflow: 'visible' }}>
              <path
                d="M 0,6 Q 20,4 40,6 T 80,6 T 120,6 T 160,6"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            {isAnnotated && (
              <span style={{
                position: 'absolute',
                top: -6,
                right: -20,
                width: 20,
                height: 20,
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--accent)',
                color: 'var(--bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 11,
              }}>3</span>
            )}
          </div>

          {/* Primary Controls Row */}
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {/* Gallery Thumbnail (Semantic button for accessibility) */}
            <button
              type="button"
              onClick={() => { window.location.href = getScreenUrl('screen=moments'); }}
              aria-label="View last capture in Moment Strip"
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
                background: 'transparent',
                cursor: 'pointer',
              }}
            >
              <img
                src={getAssetPath('scenes/moment-3.jpg')}
                alt="Gallery thumbnail"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </button>

            {/* Mode Carousel */}
            <ModeCarousel activeMode="still" />

            {/* Lens Switcher */}
            <IconButton icon={<RotateCcw size={18} />} aria-label="Switch lens (prototype simulation)" />
          </div>
        </footer>
      </div>
    </PhoneFrame>
  );
};
