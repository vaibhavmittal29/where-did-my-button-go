import React from 'react';
import styles from './CoachMark.module.css';

export interface CoachMarkProps {
  text?: string;
  className?: string;
}

export const CoachMark: React.FC<CoachMarkProps> = ({
  text = 'Tap what you want to keep',
  className = '',
}) => {
  return (
    <div className={`${styles.coachContainer} ${className}`} role="status">
      <span className={styles.dot} aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
};
