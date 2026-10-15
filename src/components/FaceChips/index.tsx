import React from 'react';
import styles from './FaceChips.module.css';

export interface FaceData {
  id: string;
  name: string;
  top: string;
  left: string;
  width: string;
  height: string;
  isReady: boolean;
}

export interface FaceChipsProps {
  faces: FaceData[];
  className?: string;
}

export const FaceChips: React.FC<FaceChipsProps> = ({ faces, className = '' }) => {
  return (
    <div className={className} aria-label="Detected faces in group mode">
      {faces.map((face) => (
        <div
          key={face.id}
          className={styles.faceBox}
          data-ready={face.isReady}
          style={{
            top: face.top,
            left: face.left,
            width: face.width,
            height: face.height,
          }}
        >
          <div className={styles.statusIndicator} data-ready={face.isReady}>
            <div className={styles.statusDot} />
          </div>
          <span className={styles.label}>{face.name}</span>
        </div>
      ))}
    </div>
  );
};
