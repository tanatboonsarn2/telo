import React from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && <label className="block text-sm font-medium text-text-primary mb-1.5">{label}</label>}
        <input
          ref={ref}
          className={cn(
            'w-full h-10 px-3 py-2 bg-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-text-secondary/50',
            error && 'border-error focus:border-error focus:ring-error/20',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-text-secondary">{helperText}</p>}
      </div>
    );
  }
);
