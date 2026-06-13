import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  showPercent?: boolean;
  className?: string;
}

export function ProgressBar({ value, max = 100, showPercent = true, className = '' }: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
        <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      {showPercent && <span className="text-xs text-gray-600">{pct}%</span>}
    </div>
  );
}
