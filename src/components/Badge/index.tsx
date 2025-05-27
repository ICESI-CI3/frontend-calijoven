'use client';

import { ReactNode } from 'react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: 'full' | 'md';
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-purple-100 text-purple-800',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2 py-1 text-xs',
};

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  rounded = 'full',
  className = '',
}: BadgeProps) {
  const roundedStyles = rounded === 'full' ? 'rounded-full' : 'rounded-md';

  return (
    <span
      className={`inline-flex items-center font-medium ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyles} ${className}`}
    >
      {children}
    </span>
  );
}
