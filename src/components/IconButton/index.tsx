import React from 'react';
import { twMerge } from 'tailwind-merge';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function IconButton({ children, title, className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      title={title}
      className={twMerge(
        'rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
} 