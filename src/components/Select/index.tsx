import { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';

export type SelectProps = {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function Select({
  label,
  error,
  helperText,
  fullWidth,
  options,
  value,
  onChange,
  disabled,
}: SelectProps) {
  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={cn('w-full', fullWidth && 'w-full')}>
      {label && <label className="mb-2 block text-sm font-medium text-foreground">{label}</label>}
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        <div className="relative">
          <Listbox.Button
            className={cn(
              'relative w-full cursor-default rounded-lg border border-input bg-background py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              error && 'border-error',
              disabled && 'cursor-not-allowed opacity-50'
            )}
          >
            <span className="block truncate">{selectedOption?.label || 'Seleccionar...'}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-base shadow-lg ring-1 ring-border focus:outline-none sm:text-sm">
              {options.map((option) => (
                <Listbox.Option
                  key={option.value}
                  className={({ active }) =>
                    cn(
                      'relative cursor-default select-none py-2 pl-10 pr-4',
                      active ? 'bg-primary text-primary-foreground' : 'text-foreground'
                    )
                  }
                  value={option.value}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={cn('block truncate', selected ? 'font-medium' : 'font-normal')}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span
                          className={cn(
                            'absolute inset-y-0 left-0 flex items-center pl-3',
                            active ? 'text-primary-foreground' : 'text-primary'
                          )}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      {(error || helperText) && (
        <p className={cn('mt-1 text-sm', error ? 'text-error' : 'text-muted-foreground')}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
