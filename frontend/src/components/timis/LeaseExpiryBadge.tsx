interface LeaseExpiryBadgeProps {
  daysRemaining: number;
}

export function LeaseExpiryBadge({ daysRemaining }: LeaseExpiryBadgeProps) {
  const urgency = daysRemaining <= 7 ? 'danger' : daysRemaining <= 30 ? 'warning' : 'success';
  const classes = {
    danger: 'bg-danger/10 text-danger animate-pulse',
    warning: 'bg-warning/10 text-warning',
    success: 'bg-success/10 text-success',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${classes[urgency]}`}>
      {daysRemaining}d remaining
    </span>
  );
}
