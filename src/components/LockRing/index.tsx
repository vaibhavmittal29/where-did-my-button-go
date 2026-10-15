import React from 'react';
import styles from './LockRing.module.css';

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
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const strokeDashoffset = circumference * (1 - clampedProgress);

  return (
    <div
      className={`${styles.container} ${className}`}
      data-state={state}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-label="Capture stability progress"
      aria-valuenow={Math.round(clampedProgress * 100)}
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

      {/* Center anchor pin */}
      <div className={styles.centerDot} />

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
