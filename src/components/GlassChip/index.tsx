import React from 'react';
import styles from './GlassChip.module.css';

export interface GlassChipProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'danger';
  isPill?: boolean;
  className?: string;
  onClick?: () => void;
}

export const GlassChip: React.FC<GlassChipProps> = ({
  children,
  icon,
  variant = 'default',
  isPill = false,
  className = '',
  onClick,
}) => {
  const Component = onClick ? 'button' : 'div';
  return (
    <Component
      className={`${styles.chip} ${isPill ? styles.pill : ''} ${className}`}
      data-variant={variant}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </Component>
  );
};
