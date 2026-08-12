import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'solid-danger' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, icon, children, ...props }, ref) => {
    
    const variantStyles: Record<string, string> = {
      primary: 'bg-gradient-to-r from-sapphire via-abyssal-teal to-cyan text-white shadow-[0_10px_25px_-5px_rgba(0,180,216,0.35)] hover:shadow-[0_15px_30px_-5px_rgba(0,180,216,0.5)] border border-white/20 hover:-translate-y-0.5',
      secondary: 'bg-white/90 backdrop-blur-md border border-slate-200/80 text-sapphire shadow-sm hover:bg-frosted hover:border-cyan hover:text-cyan hover:-translate-y-0.5',
      ghost: 'bg-transparent text-mist hover:bg-frosted hover:text-sapphire',
      danger: 'bg-coral/10 border border-coral/30 text-coral hover:bg-coral hover:text-white shadow-sm hover:-translate-y-0.5',
      'solid-danger': 'bg-coral text-white shadow-md hover:bg-coral/90 hover:-translate-y-0.5 border border-white/20',
      'icon-only': 'p-3 rounded-full bg-frosted hover:bg-white text-sapphire border border-slate-200/60 hover:border-cyan shadow-sm hover:-translate-y-0.5'
    };

    const sizeStyles: Record<string, string> = {
      sm: 'h-10 px-4 text-xs font-semibold rounded-xl gap-2',
      md: 'h-12 px-6 text-sm font-semibold rounded-xl gap-2.5',
      lg: 'h-13 sm:h-14 px-7 text-sm sm:text-base font-semibold rounded-2xl gap-3'
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={cn(
          'inline-flex flex-row items-center justify-center whitespace-nowrap shrink-0 transition-all duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none select-none cursor-pointer',
          variantStyles[variant],
          variant !== 'icon-only' && sizeStyles[size],
          isLoading && 'opacity-70 cursor-not-allowed',
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          icon && (
            <span className="w-5 h-5 flex items-center justify-center shrink-0">
              {icon}
            </span>
          )
        )}
        {children && <span>{children}</span>}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
