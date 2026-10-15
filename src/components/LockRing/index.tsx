import React from 'react';
import styles from './LockRing.module.css';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface LockRingProps {
  progress?: number; // 0.0 to 1.0
  state?: 'idle' | 'locking' | 'captured' | 'danger';
  size?: number;     // px diameter, defaults to 96
  strokeWidth?: number; // defaults to 4
  showBrackets?: boolean;
  className?: string;
}

export const LockRing: React.FC<LockRingProps> = ({
  progress = 0,
  state = 'locking',
  size = 96,
  strokeWidth = 4,
  showBrackets = true,
  className = '',
}) => {
  const reducedMotion = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Under reduced motion: step progress into 0, 0.33, 0.66, 1.0
  let effectiveProgress = Math.max(0, Math.min(1, progress));
  if (reducedMotion && state === 'locking') {
    if (effectiveProgress >= 0.99) effectiveProgress = 1;
    else if (effectiveProgress >= 0.66) effectiveProgress = 0.66;
    else if (effectiveProgress >= 0.33) effectiveProgress = 0.33;
    else effectiveProgress = 0;
  }

  const strokeDashoffset = circumference * (1 - effectiveProgress);

  return (
    <div
      className={`${styles.container} ${className}`}
      data-state={state}
      data-reduced-motion={reducedMotion}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-label="Capture stability progress"
      aria-valuenow={Math.round(effectiveProgress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <svg
        className={styles.svg}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background track circle */}
        <circle
          className={styles.track}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Dynamic progress arc */}
        <circle
          className={styles.arc}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      {/* Center anchor pin or percentage text */}
      {reducedMotion && state === 'locking' ? (
        <span className={styles.steppedText}>{Math.round(effectiveProgress * 100)}%</span>
      ) : (
        <div className={styles.centerDot} />
      )}

      {/* Viewfinder framing brackets */}
      {showBrackets && (
        <div className={styles.brackets} aria-hidden="true">
          <span className={styles.bracketTL} />
          <span className={styles.bracketTR} />
          <span className={styles.bracketBL} />
          <span className={styles.bracketBR} />
        </div>
      )}
    </div>
  );
};
