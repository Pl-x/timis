import PaymentStatusPill from './PaymentStatusPill';

interface UnitCardProps {
  unitNumber: string;
  tenantName?: string;
  status: 'paid' | 'partial' | 'overdue' | 'pending';
  amountDue: string;
  unitType?: string;
}

export function UnitCard({ unitNumber, tenantName, status, amountDue, unitType }: UnitCardProps) {
  return (
    <div className="rounded-xl bg-card dark:bg-[#112240] shadow-card dark:shadow-card-dark p-4 border border-border dark:border-[#1E3A5F]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-h3 text-primary dark:text-white">{unitNumber}</span>
        {unitType && <span className="text-caption text-muted">{unitType}</span>}
      </div>
      {tenantName && <p className="text-sm text-muted mb-3">{tenantName}</p>}
      <div className="flex items-center justify-between">
        <PaymentStatusPill status={status} />
        <span className="font-money text-primary dark:text-white">{amountDue}</span>
      </div>
    </div>
  );
}
