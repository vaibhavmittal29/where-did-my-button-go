import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import styles from './Toast.module.css';

export interface ToastProps {
  message: string;
  type?: 'success' | 'warn' | 'neutral';
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`${styles.container} ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className={styles.content}>
        <span className={styles.icon} aria-hidden="true">
          {type === 'success' && <Check size={16} strokeWidth={2.5} />}
          {type === 'warn' && <AlertCircle size={16} strokeWidth={2.5} />}
        </span>
        <span className={styles.message}>{message}</span>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          className={styles.undoBtn}
          onClick={onAction}
          aria-label={`${actionLabel} action`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
