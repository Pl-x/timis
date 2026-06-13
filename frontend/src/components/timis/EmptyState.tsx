import { ReactNode } from 'react';
import TimisButton from './TimisButton';

interface EmptyStateProps {
  icon: ReactNode;
  headline: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, headline, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="text-muted mb-4">{icon}</div>
      <h3 className="text-h3 text-primary dark:text-white mb-2">{headline}</h3>
      <p className="text-body text-muted max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <TimisButton onClick={onAction}>{actionLabel}</TimisButton>
      )}
    </div>
  );
}
