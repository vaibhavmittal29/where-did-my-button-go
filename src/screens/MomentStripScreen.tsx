import React, { useState } from 'react';
import { PhoneFrame } from '../components/PhoneFrame';
import { MomentStrip } from '../components/MomentStrip';
import { GlassChip } from '../components/GlassChip';
import { IconButton } from '../components/IconButton';
import { Toast } from '../components/Toast';
import { Sparkles, Check, X, Share2 } from 'lucide-react';

export const MomentStripScreen: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const initialIndex = parseInt(urlParams.get('selected') || '3', 10);
  const showSavedToast = urlParams.get('saved') === '1';
  const isAnnotated = urlParams.get('annotate') === '1';

  const [selectedIndex, setSelectedIndex] = useState(initialIndex);

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
        {/* Top 60%: Large Full-Resolution Preview of Selected Moment Frame */}
        <div style={{
          position: 'relative',
          height: '62%',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: 'var(--surface-1)',
        }}>
          <img
            src={`/scenes/moment-${selectedIndex}.jpg`}
            alt={`Selected moment frame ${selectedIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'opacity var(--dur-fast) var(--ease-out)',
            }}
          />

          {/* Top Scrim */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '120px',
            background: 'linear-gradient(to bottom, rgba(11, 11, 15, 0.8) 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          {/* Top Bar with Dismiss and Best Indicator */}
          <div style={{
            position: 'absolute',
            top: 'var(--safe-top)',
            left: 'var(--space-4)',
            right: 'var(--space-4)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10,
          }}>
            <IconButton icon={<X size={18} />} aria-label="Discard selection and return to camera" />

            <div style={{ position: 'relative' }}>
              <GlassChip icon={<Sparkles size={14} />} variant="accent">
                {selectedIndex === 3 ? 'AI Recommended Best' : `Frame ${selectedIndex + 1} of 7`}
              </GlassChip>

              {isAnnotated && (
                <span style={{
                  position: 'absolute',
                  top: -8,
                  right: -16,
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
                }}>1</span>
              )}
            </div>

            <IconButton icon={<Share2 size={18} />} aria-label="Share photo" />
          </div>

          {/* Toast Variant (if saved or active) */}
          {showSavedToast && (
            <div style={{
              position: 'absolute',
              bottom: 'var(--space-4)',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 30,
              width: '90%',
            }}>
              <Toast message="Saved to gallery" actionLabel="Undo" onAction={() => alert('Undo clicked')} />
            </div>
          )}
        </div>

        {/* Bottom 40%: The Moment Strip Component */}
        <div style={{ position: 'relative', height: '38%', width: '100%', zIndex: 20 }}>
          <MomentStrip
            selectedIndex={selectedIndex}
            bestIndex={3}
            onSelectFrame={setSelectedIndex}
            countdownProgress={0.7}
          />

          {isAnnotated && (
            <span style={{
              position: 'absolute',
              top: 12,
              right: 24,
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
              zIndex: 25,
            }}>2</span>
          )}

          {/* Save Action Floating Pill */}
          <div style={{
            position: 'absolute',
            bottom: 'calc(var(--safe-bottom) + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 'var(--space-3)',
          }}>
            <button
              type="button"
              onClick={() => { window.location.href = '/?screen=moments&selected=3&saved=1'; }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: 'var(--space-2) var(--space-6)',
                backgroundColor: 'var(--accent)',
                color: 'var(--bg)',
                border: 'none',
                borderRadius: 'var(--radius-pill)',
                fontFamily: 'var(--font-family-body)',
                fontSize: 'var(--text-small)',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(255, 176, 32, 0.4)',
              }}
            >
              <Check size={16} strokeWidth={2.5} />
              <span>Save Selection</span>
            </button>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
};
