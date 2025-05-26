'use client';

import { cn } from '@/lib/utils';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  labelPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function Toggle({
  checked,
  onChange,
  label,
  labelPosition = 'right',
  size = 'md',
  className = '',
  disabled = false,
}: ToggleProps) {
  const handleClick = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const toggleSizes = {
    sm: 'h-5 w-9',
    md: 'h-6 w-11',
    lg: 'h-7 w-14',
  };

  const roundSizes = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg'
  }

  const knobTransforms = {
    sm: checked ? 'translate-x-3' : '',
    md: checked ? 'translate-x-4' : '',
    lg: checked ? 'translate-x-6' : '',
  };

  const toggleClasses = cn(
    'relative inline-flex flex-shrink-0 cursor-pointer items-center rounded-md transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-opacity-75',
    checked ? 'bg-primary' : 'bg-gray-200',
    toggleSizes[size],
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  const labelClasses = cn(
    'text-sm font-medium text-gray-700',
    disabled && 'text-gray-400'
  );

  return (
    <div className="flex items-center gap-2">
      {label && labelPosition === 'left' && <span className={labelClasses}>{label}</span>}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`${toggleClasses} p-1`}
        onClick={handleClick}
      >
        <span
          className={cn(
            'pointer-events-none h-full w-1/2 inline-block transform bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
            knobTransforms[size],
            roundSizes[size]
          )}
        />
      </button>
      {label && labelPosition === 'right' && <span className={labelClasses}>{label}</span>}
    </div>
  );
} 