import { InputHTMLAttributes } from 'react';

interface TimisInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefix?: string;
}

export function TimisInput({ label, error, helperText, prefix, className = '', ...props }: TimisInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-primary dark:text-white">{label}</label>}
      <div className={`flex items-center rounded-lg border ${error ? 'border-danger' : 'border-border dark:border-[#1E3A5F]'} bg-card dark:bg-[#112240] overflow-hidden focus-within:ring-2 focus-within:ring-accent`}>
        {prefix && <span className="pl-3 text-sm text-muted font-money">{prefix}</span>}
        <input
          className={`flex-1 px-3 py-2.5 bg-transparent text-sm text-primary dark:text-white placeholder:text-muted outline-none ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
      {!error && helperText && <p className="text-xs text-muted">{helperText}</p>}
    </div>
  );
}
