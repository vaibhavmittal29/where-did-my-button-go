import React from 'react';
import { PhoneFrame } from '../components/PhoneFrame';
import { FaceChips, FaceData } from '../components/FaceChips';
import { ModeCarousel } from '../components/ModeCarousel';
import { IconButton } from '../components/IconButton';
import { GlassChip } from '../components/GlassChip';
import { Settings2, RotateCcw, Zap, Mic, Users } from 'lucide-react';

export const GroupModeScreen: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const readyCount = parseInt(urlParams.get('ready') || '3', 10);

  // 4 university friends clearly framed across the viewfinder:
  // 1. Tara (Female in red shirt on left - laughing with eyes closed) -> Blinking (Amber)
  // 2. Aarav (Male in blue button-down - smiling at camera) -> Ready (Green)
  // 3. Pooja (Female in white shirt - smiling at camera) -> Ready (Green)
  // 4. Neha (Female in navy graphic tee - smiling at camera) -> Ready (Green)
  const faces: FaceData[] = [
    { id: '1', name: 'Tara · Blinking', top: '46.5%', left: '11.5%', width: '14%', height: '8%', isReady: readyCount >= 4 },
    { id: '2', name: 'Aarav', top: '47%', left: '31%', width: '12.5%', height: '8%', isReady: true },
    { id: '3', name: 'Pooja', top: '48%', left: '54.5%', width: '12%', height: '8%', isReady: true },
    { id: '4', name: 'Neha', top: '46%', left: '73%', width: '12.5%', height: '8%', isReady: true },
  ];

  return (
    <PhoneFrame>
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
        {/* Full-Bleed Viewfinder Photo (4 University Friends Facing Camera) */}
        <img
          src="/scenes/group-campus.jpg"
          alt="University campus group of 4 friends smiling at camera"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
          }}
        />

        {/* Global Frame Ring (3px outline around entire frame indicating group readiness) */}
        <div style={{
          position: 'absolute',
          inset: '16px',
          borderRadius: '32px',
          border: `3px solid ${readyCount >= 4 ? 'var(--success)' : 'var(--accent)'}`,
          opacity: 0.85,
          pointerEvents: 'none',
          boxShadow: `0 0 24px ${readyCount >= 4 ? 'rgba(61, 220, 151, 0.4)' : 'rgba(255, 176, 32, 0.3)'}`,
          transition: 'all var(--dur-base) var(--ease-out)',
          zIndex: 12,
        }} />

        {/* Top Vignette Scrim */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '140px',
          background: 'linear-gradient(to bottom, rgba(11, 11, 15, 0.8) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Bottom Vignette Scrim */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '200px',
          background: 'linear-gradient(to top, rgba(11, 11, 15, 0.85) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Top Controls Bar */}
        <header style={{
          position: 'relative',
          zIndex: 20,
          padding: 'var(--safe-top) var(--space-4) 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <IconButton icon={<Zap size={18} />} aria-label="Flash" />

          {/* Group Ready Counter Chip */}
          <GlassChip
            icon={<Users size={14} />}
            variant={readyCount >= 4 ? 'success' : 'accent'}
          >
            {readyCount >= 4 ? 'All 4 Ready · Auto-Capturing' : `${readyCount} of 4 ready`}
          </GlassChip>

          <IconButton icon={<Settings2 size={18} />} aria-label="Settings" />
        </header>

        {/* Face Tracking Bounding Boxes with Status Indicators */}
        <FaceChips faces={faces} />

        {/* Bottom Bar: Voice Trigger Hint & Group Mode Selected */}
        <footer style={{
          position: 'relative',
          zIndex: 20,
          padding: '0 var(--space-4) var(--safe-bottom)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}>
          {/* Hands-Free Voice Prompt */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            backgroundColor: 'var(--glass)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--glass-border)',
            color: 'var(--text)',
            fontSize: 'var(--text-caption)',
            fontWeight: 500,
            textShadow: '0 1px 3px rgba(0,0,0,0.8)'
          }}>
            <Mic size={14} color="var(--accent)" />
            <span>Or say <strong>"Cheese"</strong> / <strong>"Capture"</strong></span>
          </div>

          {/* Primary Controls Row: Gallery, Mode Carousel, Lens Switcher */}
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {/* Gallery Thumbnail */}
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-card)',
              overflow: 'hidden',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            }}>
              <img
                src="/scenes/portrait-subject.jpg"
                alt="Gallery thumbnail"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Mode Carousel (Group Mode Highlighted) */}
            <ModeCarousel
              activeMode="group"
              onModeChange={(m) => {
                if (m === 'still') window.location.href = '/?screen=idle';
              }}
            />

            {/* Switch Camera */}
            <IconButton icon={<RotateCcw size={18} />} aria-label="Switch lens" />
          </div>
        </footer>
      </div>
    </PhoneFrame>
  );
};
