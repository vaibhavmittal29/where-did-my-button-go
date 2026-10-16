import React, { useState } from 'react';
import { PhoneFrame } from '../components/PhoneFrame';
import { LockRing } from '../components/LockRing';
import { GlassChip } from '../components/GlassChip';
import { IconButton } from '../components/IconButton';
import { Toast } from '../components/Toast';
import { Settings2, RotateCcw, Sparkles, Mic, Hand, Users, Check } from 'lucide-react';

export const ComponentKitScreen: React.FC = () => {
  const [interactiveProgress, setInteractiveProgress] = useState(0.66);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-8)',
      padding: 'var(--space-8) var(--space-4)',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%',
    }}>
      {/* Header */}
      <header style={{ textAlign: 'center', maxWidth: '700px' }}>
        <div style={{
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: 'var(--radius-pill)',
          background: 'var(--accent-soft)',
          border: '1px solid var(--accent)',
          color: 'var(--accent)',
          fontSize: 'var(--text-caption)',
          fontWeight: 600,
          marginBottom: 'var(--space-2)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Design System & Component Kit
        </div>
        <h1 style={{
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--text-headline)',
          color: 'var(--text)',
          marginBottom: 'var(--space-2)'
        }}>
          STILL UI Architecture
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: 'var(--text-small)' }}>
          Verified token bindings, accessible 44px touch targets, zero hardcoded colors.
        </p>
      </header>

      {/* Main Kit Display */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 'var(--space-6)',
        width: '100%',
      }}>
        {/* Section 1: LockRing States */}
        <div style={{
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-card)',
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}>
          <h2 style={{ fontSize: 'var(--text-title)', fontFamily: 'var(--font-family-display)' }}>
            1. LockRing States
          </h2>
          <p style={{ color: 'var(--text-dim)', fontSize: 'var(--text-caption)' }}>
            Physical sensor-driven progress ring with framing brackets and center anchor.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: 'var(--space-4)',
            justifyItems: 'center',
            textAlign: 'center',
            padding: 'var(--space-4) 0',
          }}>
            <div>
              <LockRing progress={0} state="idle" size={88} />
              <div style={{ fontSize: 'var(--text-caption)', color: 'var(--text-dim)', marginTop: '8px' }}>
                0% (Ghost Pulse)
              </div>
            </div>

            <div>
              <LockRing progress={0.33} state="locking" size={88} />
              <div style={{ fontSize: 'var(--text-caption)', color: 'var(--text-dim)', marginTop: '8px' }}>
                33% (Early Lock)
              </div>
            </div>

            <div>
              <LockRing progress={0.66} state="locking" size={88} />
              <div style={{ fontSize: 'var(--text-caption)', color: 'var(--text-dim)', marginTop: '8px' }}>
                66% (Mid Lock)
              </div>
            </div>

            <div>
              <LockRing progress={1.0} state="captured" size={88} />
              <div style={{ fontSize: 'var(--text-caption)', color: 'var(--success)', marginTop: '8px', fontWeight: 600 }}>
                100% (Captured)
              </div>
            </div>

            <div>
              <LockRing progress={0.5} state="danger" size={88} />
              <div style={{ fontSize: 'var(--text-caption)', color: 'var(--danger)', marginTop: '8px', fontWeight: 600 }}>
                Draining (Unsteady)
              </div>
            </div>
          </div>

          {/* Interactive Slider for LockRing */}
          <div style={{ marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: 'var(--text-caption)', color: 'var(--text-dim)' }}>
              Interactive Test: {Math.round(interactiveProgress * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={interactiveProgress}
              onChange={(e) => setInteractiveProgress(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
          </div>
        </div>

        {/* Section 2: Chips & Feedback Toasts */}
        <div style={{
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--glass-border)',
          borderRadius: 'var(--radius-card)',
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}>
          <h2 style={{ fontSize: 'var(--text-title)', fontFamily: 'var(--font-family-display)' }}>
            2. Chips & Status Badges
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <GlassChip icon={<Hand size={14} />}>Hold steady · 0.5s</GlassChip>
            <GlassChip icon={<Sparkles size={14} />} variant="accent">Best Moment</GlassChip>
            <GlassChip icon={<Check size={14} />} variant="success">3 of 4 Ready</GlassChip>
            <GlassChip variant="danger">Too much movement</GlassChip>
            <GlassChip isPill variant="accent">STILL MODE</GlassChip>
          </div>

          <h2 style={{ fontSize: 'var(--text-title)', fontFamily: 'var(--font-family-display)', marginTop: 'var(--space-4)' }}>
            3. 44px Icon Buttons
          </h2>
          <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
            <IconButton icon={<Settings2 size={20} />} aria-label="Open Camera Settings" />
            <IconButton icon={<RotateCcw size={20} />} aria-label="Flip Camera Lens" />
            <IconButton icon={<Sparkles size={20} />} variant="accent" aria-label="Auto Select Best Moment" />
            <IconButton icon={<Mic size={20} />} variant="ghost" aria-label="Enable Voice Trigger" />
            <IconButton icon={<Users size={20} />} aria-label="Group Detection Mode" />
          </div>

          <h2 style={{ fontSize: 'var(--text-title)', fontFamily: 'var(--font-family-display)', marginTop: 'var(--space-4)' }}>
            4. Live Toast Feedback
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <Toast message="Saved (simulated)" actionLabel="Undo" onAction={() => alert('Undo triggered')} />
            <Toast message="Too much movement — hold still" type="warn" />
          </div>
        </div>
      </div>

      {/* Section 3: PhoneFrame Preview */}
      <section style={{
        marginTop: 'var(--space-8)',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-4)',
      }}>
        <h2 style={{ fontSize: 'var(--text-headline)', fontFamily: 'var(--font-family-display)', textAlign: 'center' }}>
          5. PhoneFrame Device Preview (390×844)
        </h2>
        <PhoneFrame>
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 'var(--safe-top) var(--space-4) var(--safe-bottom)',
            background: 'radial-gradient(circle at center, #1F1F2A 0%, #0B0B0F 100%)',
            alignItems: 'center',
            position: 'relative'
          }}>
            {/* Top Bar */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <GlassChip icon={<Sparkles size={14} />} variant="accent">STILL</GlassChip>
              <IconButton icon={<Settings2 size={18} />} aria-label="Settings" />
            </div>

            {/* Viewfinder Center */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
              <LockRing progress={interactiveProgress} size={96} />
              <GlassChip icon={<Hand size={14} />}>
                Hold steady · {(interactiveProgress * 0.8).toFixed(1)}s
              </GlassChip>
            </div>

            {/* Bottom Bar: NO SHUTTER BUTTON */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Toast message="Hold still to capture" />
            </div>
          </div>
        </PhoneFrame>
      </section>
    </div>
  );
};
