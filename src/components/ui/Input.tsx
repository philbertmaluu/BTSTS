import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, helperText, className = '', ...props }, ref) => {
    const inputClasses = `
      block w-full rounded-md 
      ${leftIcon ? 'pl-10' : 'pl-4'} 
      ${rightIcon ? 'pr-10' : 'pr-4'} 
      py-2 
      bg-white dark:bg-neutral-800 
      border ${error ? 'border-error-500' : 'border-neutral-300 dark:border-neutral-600'} 
      text-neutral-900 dark:text-white
      placeholder-neutral-400
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
      transition-colors
      disabled:opacity-50 disabled:cursor-not-allowed
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
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={inputClasses}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightIcon}
            </div>
          )}
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

Input.displayName = 'Input';