import React, { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  onChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, onChange, className = '', ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    const selectClasses = `
      block w-full rounded-md
      pl-4 pr-10 py-2
      bg-white dark:bg-neutral-800
      border ${error ? 'border-error-500' : 'border-neutral-300 dark:border-neutral-600'}
      text-neutral-900 dark:text-white
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
      transition-colors
      disabled:opacity-50 disabled:cursor-not-allowed
      appearance-none
      ${className}
    `;

    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={selectClasses}
            onChange={handleChange}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500">
            <ChevronDown size={16} />
          </div>
        </div>
        {helperText && !error && (
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {helperText}
          </p>
        )}
        {error && (
          <p className="mt-1 text-sm text-error-500 dark:text-error-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';