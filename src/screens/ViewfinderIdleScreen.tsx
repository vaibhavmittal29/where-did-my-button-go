import React from 'react';
import { PhoneFrame } from '../components/PhoneFrame';
import { LockRing } from '../components/LockRing';
import { CoachMark } from '../components/CoachMark';
import { ModeCarousel } from '../components/ModeCarousel';
import { IconButton } from '../components/IconButton';
import { GlassChip } from '../components/GlassChip';
import { Settings2, RotateCcw, Zap, Sun } from 'lucide-react';

interface ViewfinderIdleScreenProps {
  pureDevice?: boolean;
}

export const ViewfinderIdleScreen: React.FC<ViewfinderIdleScreenProps> = ({ pureDevice = false }) => {
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
        {/* Full-Bleed Viewfinder Background Photo */}
        <img
          src="/scenes/portrait-subject.jpg"
          alt="Camera Viewfinder Subject"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Top Vignette / Gradient Scrim for Text Legibility */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '140px',
          background: 'linear-gradient(to bottom, rgba(11, 11, 15, 0.75) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Bottom Vignette / Scrim */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '180px',
          background: 'linear-gradient(to top, rgba(11, 11, 15, 0.85) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Top Glass Bar */}
        <header style={{
          position: 'relative',
          zIndex: 10,
          padding: 'var(--safe-top) var(--space-4) 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <IconButton icon={<Zap size={18} />} aria-label="Flash mode auto" />
          
          <GlassChip icon={<Sun size={14} />} variant="default">
            Good Light · 1×
          </GlassChip>

          <IconButton icon={<Settings2 size={18} />} aria-label="Open Camera Settings" />
        </header>

        {/* Center: Ghost Ring & Coach Mark */}
        <div style={{
          position: 'relative',
          zIndex: 5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}>
          {/* Faint pulsing ghost ring at 60% opacity */}
          <LockRing progress={0} state="idle" size={96} showBrackets={true} />
          <CoachMark text="Tap what you want to keep" />
        </div>

        {/* Bottom Controls Bar: Note the COMPLETE ABSENCE of any shutter button! */}
        <footer style={{
          position: 'relative',
          zIndex: 10,
          padding: '0 var(--space-4) var(--safe-bottom)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
        }}>
          {/* Primary Controls Row: Left = Gallery, Center = Mode Carousel, Right = Lens Flip */}
          <div style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            {/* Gallery Thumbnail (Last Photo) */}
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
              role="button"
              aria-label="View last photo in gallery"
            >
              <img
                src="/scenes/moment-3.jpg"
                alt="Last captured thumbnail"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Mode Carousel (Still · Group · Doc) occupies the center */}
            <ModeCarousel
              activeMode="still"
              onModeChange={(m) => {
                if (m === 'group') window.location.href = '/?screen=group&ready=3';
              }}
            />

            {/* Lens Switcher */}
            <IconButton icon={<RotateCcw size={18} />} aria-label="Switch to selfie front camera" />
          </div>
        </footer>
      </div>
    </PhoneFrame>
  );
};
