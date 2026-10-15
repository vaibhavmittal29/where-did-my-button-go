import React from 'react';
import styles from './IconButton.module.css';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  'aria-label': string; // Mandatory for accessibility
  variant?: 'glass' | 'accent' | 'ghost';
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  'aria-label': ariaLabel,
  variant = 'glass',
  className = '',
  ...rest
}) => {
  return (
    <button
      type="button"
      className={`${styles.button} ${className}`}
      data-variant={variant}
      aria-label={ariaLabel}
      {...rest}
    >
      {icon}
    </button>
  );
};
