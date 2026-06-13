interface ActivityFeedItemProps {
  type: 'payment' | 'maintenance' | 'dispute' | 'lease';
  message: string;
  timestamp: string | Date;
  amount?: number;
}

const borderColors = {
  payment: 'border-l-timis-success',
  maintenance: 'border-l-timis-warning',
  dispute: 'border-l-timis-danger',
  lease: 'border-l-timis-accent',
};

function relativeTime(ts: string | Date) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ActivityFeedItem({ type, message, timestamp, amount }: ActivityFeedItemProps) {
  return (
    <div className={`border-l-4 ${borderColors[type]} pl-3 py-2 flex items-center justify-between`}>
      <div>
        <p className="text-sm text-timis-primary dark:text-white">{message}</p>
        <p className="text-xs text-timis-muted">{relativeTime(timestamp)}</p>
      </div>
      {amount != null && <span className="font-mono text-sm font-semibold text-timis-primary dark:text-white">KES {amount.toLocaleString()}</span>}
    </div>
  );
}
