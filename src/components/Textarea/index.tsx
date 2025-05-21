import { forwardRef } from 'react';
import { Textarea as HeadlessTextarea } from '@headlessui/react';
import { cn } from '@/lib/utils';

export type TextareaProps = {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
  className?: string;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      label,
      helperText,
      fullWidth,
      value,
      onChange,
      disabled,
      placeholder,
      rows = 4,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn('w-full', fullWidth && 'w-full')}>
        {label && <label className="mb-2 block text-sm font-medium text-foreground">{label}</label>}
        <HeadlessTextarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          rows={rows}
          className={cn(
            'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-error',
            className
          )}
          ref={ref}
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

Textarea.displayName = 'Textarea';

export { Textarea };
