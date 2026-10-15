import React from 'react';
import { Sparkles } from 'lucide-react';
import styles from './MomentStrip.module.css';

export interface MomentStripProps {
  frames?: string[];
  selectedIndex: number;
  bestIndex?: number;
  onSelectFrame?: (index: number) => void;
  countdownProgress?: number; // 0.0 to 1.0
  className?: string;
}

export const MomentStrip: React.FC<MomentStripProps> = ({
  frames = Array.from({ length: 7 }, (_, i) => `/scenes/moment-${i}.jpg`),
  selectedIndex,
  bestIndex = 3,
  onSelectFrame,
  countdownProgress = 0.65,
  className = '',
}) => {
  return (
    <div className={`${styles.container} ${className}`} role="region" aria-label="Moment Rewind Strip">
      <div className={styles.headerRow}>
        <span className={styles.title}>Pick your favourite moment</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent)', fontSize: 'var(--text-caption)', fontWeight: 600 }}>
          <Sparkles size={13} />
          <span>Rewind 3s</span>
        </div>
      </div>

      {/* 7-frame horizontal strip */}
      <div className={styles.stripScroll}>
        {frames.map((src, index) => {
          const isSelected = selectedIndex === index;
          const isBest = bestIndex === index;
          const isLockMoment = index === 3; // center frame = lock moment

          return (
            <button
              key={index}
              type="button"
              className={styles.thumbnailCard}
              data-selected={isSelected}
              onClick={() => onSelectFrame?.(index)}
              aria-label={`Frame ${index + 1} of 7${isBest ? ' (AI Best)' : ''}`}
            >
              <img src={src} alt={`Moment ${index + 1}`} className={styles.thumbImg} />
              {isBest && <span className={styles.bestBadge}>Best</span>}
              {isLockMoment && !isBest && <span className={styles.centerMarker} />}
            </button>
          );
        })}
      </div>

      {/* Autosave countdown bar and label */}
      <div className={styles.countdownBar}>
        <div
          className={styles.countdownFill}
          style={{ width: `${Math.round(countdownProgress * 100)}%` }}
        />
      </div>

      <div className={styles.savingText}>
        <span>Saving best moment…</span>
        <span className="tabular-nums">{(4 * (1 - countdownProgress)).toFixed(1)}s</span>
      </div>
    </div>
  );
};
