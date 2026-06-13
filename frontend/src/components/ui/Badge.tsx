import React from 'react';

type BadgeStatus = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  status?: BadgeStatus;
  children: React.ReactNode;
}

const styles: Record<BadgeStatus, string> = {
  success: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-800',
};

export function Badge({ status = 'neutral', children }: BadgeProps) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>{children}</span>;
}
