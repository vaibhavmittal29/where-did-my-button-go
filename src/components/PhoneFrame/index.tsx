import React from 'react';
import styles from './PhoneFrame.module.css';

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, className = '' }) => {
  return (
    <div className={styles.wrapper}>
      <main className={`${styles.device} ${className}`} role="region" aria-label="Mobile Camera Screen">
        <div className={styles.speakerBar} aria-hidden="true" />
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
};
