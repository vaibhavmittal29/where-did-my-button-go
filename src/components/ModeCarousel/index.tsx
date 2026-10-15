import React from 'react';
import styles from './ModeCarousel.module.css';

export type CameraMode = 'still' | 'group' | 'doc';

export interface ModeCarouselProps {
  activeMode: CameraMode;
  onModeChange?: (mode: CameraMode) => void;
  className?: string;
}

export const ModeCarousel: React.FC<ModeCarouselProps> = ({
  activeMode,
  onModeChange,
  className = '',
}) => {
  const modes: { id: CameraMode; label: string }[] = [
    { id: 'still', label: 'Still' },
    { id: 'group', label: 'Group' },
    { id: 'doc', label: 'Doc' },
  ];

  return (
    <div
      className={`${styles.carousel} ${className}`}
      role="tablist"
      aria-label="Camera Modes"
    >
      {modes.map((mode) => {
        const isSelected = activeMode === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-controls={`mode-${mode.id}`}
            id={`tab-${mode.id}`}
            className={styles.item}
            onClick={() => onModeChange?.(mode.id)}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
};
