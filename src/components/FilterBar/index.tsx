'use client';

import { ReactNode, useState } from 'react';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/16/solid';

export interface FilterOption {
  label: string;
  value: string;
  icon?: ReactNode;
}

export interface FilterGroupProps {
  label: string;
  icon?: ReactNode;
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  className?: string;
  defaultExpanded?: boolean;
}

export function FilterGroup({
  label,
  icon,
  options,
  selectedValue,
  onChange,
  className = '',
  defaultExpanded = false,
}: FilterGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={cn('rounded-md bg-gray-50 p-2 pb-4 last:border-0 last:pb-0', className)}>
      <button
        type="button"
        className="flex w-full items-center justify-between py-2 text-left text-sm font-medium text-gray-700"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-1">
          {icon && <span className="text-gray-500">{icon}</span>}
          {label}
        </div>
        <ChevronDownIcon className="h-5 w-5 text-gray-500 transition-transform" />
      </button>

      {isExpanded && (
        <div className="mt-2 flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                selectedValue === option.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
              onClick={() => onChange(option.value)}
              type="button"
            >
              {option.icon && <span className="text-inherit">{option.icon}</span>}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export interface FilterBarProps {
  children: ReactNode;
  onClear?: () => void;
  className?: string;
}

export function FilterBar({ children, onClear, className = '' }: FilterBarProps) {
  return (
    <div className={cn('rounded-lg border border-gray-200 bg-white p-5', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold">
          <SparklesIcon className="h-5 w-5" />
          Filtros</h3>
        {onClear && (
          <Button variant="outline" size="sm" onClick={onClear} className="text-sm">
            <XMarkIcon className="h-4 w-4" />
            Limpiar Filtros
          </Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}
