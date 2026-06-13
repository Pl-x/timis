import React from 'react';

interface CardProps {
  header?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const paddings = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-8' };

export function Card({ header, padding = 'md', children, className = '' }: CardProps) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
      {header && <div className="border-b border-gray-200 px-5 py-3 font-medium">{header}</div>}
      <div className={paddings[padding]}>{children}</div>
    </div>
  );
}
