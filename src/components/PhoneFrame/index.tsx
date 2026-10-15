import React from 'react';
import styles from './PhoneFrame.module.css';

interface PhoneFrameProps {
  children: React.ReactNode;
  className?: string;
  pureDevice?: boolean;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({ children, className = '', pureDevice = false }) => {
  const device = (
    <main className={`${styles.device} ${className}`} role="region" aria-label="Mobile Camera Screen">
      <div className={styles.speakerBar} aria-hidden="true" />
      <div className={styles.content}>
        {children}
      </div>
    </main>
  );

  if (pureDevice) return device;

  return (
    <div className={styles.wrapper}>
      {device}
    </div>
  );
};
