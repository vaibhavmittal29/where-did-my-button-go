import React from 'react';
import { Sparkles } from 'lucide-react';
import styles from './MomentStrip.module.css';
import { getAssetPath } from '../../utils/assetPath';

export interface MomentStripProps {
  frames?: string[];
  selectedIndex: number;
  bestIndex?: number;
  onSelectFrame?: (index: number) => void;
  countdownProgress?: number; // 0.0 to 1.0
  className?: string;
}

export const MomentStrip: React.FC<MomentStripProps> = ({
  frames = Array.from({ length: 7 }, (_, i) => getAssetPath(`scenes/moment-${i}.jpg`)),
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
      <div className={styles.stripScroll} role="group" aria-label="7 candidate burst frames">
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
              aria-label={`Frame ${index + 1} of 7${isBest ? ' (Suggested moment)' : ''}${isSelected ? ' (Selected)' : ''}`}
              aria-pressed={isSelected}
            >
              <img src={src} alt={`Moment ${index + 1}`} className={styles.thumbImg} />
              {isBest && <span className={styles.bestBadge}>Suggested</span>}
              {isLockMoment && !isBest && <span className={styles.centerMarker} />}
            </button>
          );
        })}
      </div>

      {/* Autosave countdown bar and label */}
      <div
        className={styles.countdownBar}
        role="progressbar"
        aria-label="Autosave countdown"
        aria-valuenow={Math.round(countdownProgress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={styles.countdownFill}
          style={{ width: `${Math.round(countdownProgress * 100)}%` }}
        />
      </div>

      <div className={styles.savingText}>
        <span>{selectedIndex === bestIndex ? 'Saving suggested moment…' : 'Saving selection…'}</span>
        <span className="tabular-nums">{(4 * Math.max(0, 1 - countdownProgress)).toFixed(1)}s</span>
      </div>
    </div>
  );
};
