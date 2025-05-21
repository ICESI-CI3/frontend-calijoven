import { Fragment } from 'react';
import { Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';

export type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  show?: boolean;
};

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
};

export function Spinner({ size = 'md', className, show = true }: SpinnerProps) {
  return (
    <Transition
      show={show}
      as={Fragment}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-current border-t-transparent',
          sizeClasses[size],
          className
        )}
      />
    </Transition>
  );
}
