interface PaymentStatusPillProps {
  status: 'paid' | 'partial' | 'overdue' | 'pending';
}

const config = {
  paid: { dot: 'bg-timis-success', text: 'text-timis-success', label: 'Paid' },
  partial: { dot: 'bg-timis-accent', text: 'text-timis-accent', label: 'Partial' },
  overdue: { dot: 'bg-timis-danger', text: 'text-timis-danger', label: 'Overdue' },
  pending: { dot: 'bg-timis-muted', text: 'text-timis-muted', label: 'Pending' },
};

export default function PaymentStatusPill({ status }: PaymentStatusPillProps) {
  const { dot, text, label } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${text} bg-current/5`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {label}
    </span>
  );
}
