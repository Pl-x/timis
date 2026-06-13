import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'password';
}

export function Input({ label, error, helperText, className = '', id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      {label && <label htmlFor={inputId} className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        id={inputId}
        className={`rounded border px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-amber-500 ${error ? 'border-red-500' : 'border-gray-300'} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {!error && helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}
