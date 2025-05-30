'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type TagColor = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface TagProps {
  children: ReactNode;
  color?: TagColor;
  onRemove?: () => void;
  className?: string;
  clickable?: boolean;
  onClick?: () => void;
}

const colorStyles: Record<TagColor, string> = {
  default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  primary: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  success: 'bg-green-100 text-green-800 hover:bg-green-200',
  warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  danger: 'bg-red-100 text-red-800 hover:bg-red-200',
  info: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
};

export function Tag({
  children,
  color = 'default',
  onRemove,
  className = '',
  clickable = false,
  onClick,
}: TagProps) {
  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        colorStyles[color],
        clickable && 'cursor-pointer',
        className
      )}
      onClick={handleClick}
    >
      {children}
      {onRemove && (
        <button
          type="button"
          className="ml-1.5 inline-flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full text-current hover:bg-current hover:bg-opacity-10 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
            <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
          </svg>
        </button>
      )}
    </span>
  );
}
