import React, { useRef } from 'react';
import styles from './ModeCarousel.module.css';

export type CameraMode = 'still' | 'group' | 'doc';

export interface ModeCarouselProps {
  activeMode: CameraMode;
  onModeChange?: (mode: CameraMode) => void;
  className?: string;
}

const MODES: { id: CameraMode; label: string }[] = [
  { id: 'still', label: 'Still' },
  { id: 'group', label: 'Group' },
  { id: 'doc', label: 'Doc' },
];

export const ModeCarousel: React.FC<ModeCarouselProps> = ({
  activeMode,
  onModeChange,
  className = '',
}) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = (index + 1) % MODES.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = (index - 1 + MODES.length) % MODES.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = MODES.length - 1;
    } else {
      return;
    }

    const nextMode = MODES[nextIndex].id;
    onModeChange?.(nextMode);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      className={`${styles.carousel} ${className}`}
      role="tablist"
      aria-label="Camera Modes"
    >
      {MODES.map((mode, index) => {
        const isSelected = activeMode === mode.id;
        return (
          <button
            key={mode.id}
            ref={(el) => { tabRefs.current[index] = el; }}
            type="button"
            role="tab"
            aria-selected={isSelected}
            tabIndex={isSelected ? 0 : -1}
            id={`tab-${mode.id}`}
            className={styles.item}
            onClick={() => onModeChange?.(mode.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
};
