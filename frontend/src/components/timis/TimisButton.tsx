'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface TimisButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantStyles = {
  primary: 'bg-timis-accent text-timis-primary font-semibold',
  secondary: 'bg-timis-primary text-white dark:bg-timis-accent/10 dark:text-timis-accent dark:border dark:border-timis-accent',
  ghost: 'border border-current bg-transparent',
  danger: 'bg-timis-danger text-white',
};

const sizeStyles = { sm: 'px-3 py-1.5 text-sm', md: 'px-5 py-2.5 text-base', lg: 'px-7 py-3 text-lg' };

export default function TimisButton({ variant = 'primary', loading, size = 'md', disabled, children, className = '', ...props }: TimisButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg min-h-[44px] transition active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="60 30" /></svg>
      ) : children}
    </button>
  );
}
