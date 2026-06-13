import { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string;
  trend?: { direction: 'up' | 'down'; percent: number };
}

export default function StatCard({ icon, label, value, trend }: StatCardProps) {
  return (
    <div className="timis-card p-4 dark:bg-timis-dark-card">
      <div className="mb-2 text-timis-muted">{icon}</div>
      <p className="text-xs text-timis-muted mb-1">{label}</p>
      <p className="font-mono text-2xl font-bold text-timis-primary dark:text-white">{value}</p>
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.direction === 'up' ? 'text-timis-success' : 'text-timis-danger'}`}>
          <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
          <span>{trend.percent}%</span>
        </div>
      )}
    </div>
  );
}
