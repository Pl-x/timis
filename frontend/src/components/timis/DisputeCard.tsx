import { AlertTriangle, MessageSquare, DollarSign, FileText } from 'lucide-react';

interface DisputeCardProps {
  category: string;
  status: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
  subject: string;
}

const icons: Record<string, typeof AlertTriangle> = {
  billing: DollarSign,
  maintenance: AlertTriangle,
  noise: MessageSquare,
  default: FileText,
};

const severityColors = {
  low: 'bg-success/10 text-success',
  medium: 'bg-warning/10 text-warning',
  high: 'bg-danger/10 text-danger',
};

export function DisputeCard({ category, status, date, severity, subject }: DisputeCardProps) {
  const Icon = icons[category] || icons.default;
  return (
    <div className="rounded-xl bg-card dark:bg-[#112240] shadow-card dark:shadow-card-dark p-4 border border-border dark:border-[#1E3A5F]">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${severityColors[severity]}`}>
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold text-primary dark:text-white truncate">{subject}</h4>
            <span className="text-caption px-2 py-0.5 rounded-full bg-accent/10 text-accent shrink-0">{status}</span>
          </div>
          <p className="text-xs text-muted mt-1">{date}</p>
        </div>
      </div>
    </div>
  );
}
