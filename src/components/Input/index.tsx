'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, helperText, fullWidth, ...props }, ref) => {
    return (
      <div className={cn('w-full', fullWidth && 'w-full')}>
        {label && <label className="mb-2 block text-sm font-medium text-foreground">{label}</label>}
        <input
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error',
            className
          )}
          ref={ref}
          data-testid={props.id ? `input-${props.id}` : undefined}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn('mt-1 text-sm', error ? 'text-error' : 'text-muted-foreground')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
