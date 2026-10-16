import React, { useRef } from 'react';
import styles from './ModeCarousel.module.css';

export type CameraMode = 'still' | 'group' | 'doc';

export interface ModeCarouselProps {
  activeMode: CameraMode;
  onModeChange?: (mode: CameraMode) => void;
  className?: string;
  disabled?: boolean;
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
  disabled = false,
}) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (disabled) return;
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
      className={`${styles.carousel} ${disabled ? styles.disabled : ''} ${className}`}
      role="tablist"
      aria-label="Camera Modes"
      aria-disabled={disabled ? 'true' : undefined}
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
            aria-disabled={disabled ? 'true' : undefined}
            tabIndex={disabled ? -1 : (isSelected ? 0 : -1)}
            id={`tab-${mode.id}`}
            className={`${styles.item} ${disabled ? styles.disabled : ''}`}
            onClick={() => {
              if (disabled) return;
              onModeChange?.(mode.id);
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {mode.label}
          </button>
        );
      })}
    </div>
  );
};
