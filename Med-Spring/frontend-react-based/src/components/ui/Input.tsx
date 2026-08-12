import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col w-full space-y-1">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-mist uppercase tracking-wider">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full h-13 px-4 rounded-xl bg-frosted/60 border border-slate-200/80 text-sm font-medium text-slate-charcoal placeholder:text-mist/70 transition-all duration-300 focus:outline-none focus:border-cyan focus:bg-white focus:ring-4 focus:ring-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-coral focus:border-coral focus:ring-coral/20 bg-coral/5',
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <span className={cn('text-xs mt-1 font-medium', error ? 'text-coral' : 'text-mist')}>
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
