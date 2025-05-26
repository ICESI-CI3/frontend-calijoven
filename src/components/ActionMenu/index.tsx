'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export interface Action {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export interface ActionMenuProps {
  actions: Action[];
  label?: string;
  className?: string;
  align?: 'left' | 'right';
}

export function ActionMenu({
  actions,
  label = 'Acciones',
  className = '',
  align = 'right',
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={cn('relative inline-block text-left', className)} ref={menuRef}>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
        <ChevronDownIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {actions.map((action, index) => (
              <button
                key={index}
                className={cn(
                  'flex w-full items-center gap-2 px-4 py-2 text-left text-sm',
                  action.variant === 'danger'
                    ? 'text-red-700 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                role="menuitem"
              >
                {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
