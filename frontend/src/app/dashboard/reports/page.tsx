'use client';
import { TimisButton } from '@/components/timis';
import { Download } from 'lucide-react';

const reports = [
  { name: 'Monthly Rent Collection', desc: 'Rent collected vs expected, per property', period: 'June 2026' },
  { name: 'Arrears Report', desc: 'All tenants with outstanding balances', period: 'As of today' },
  { name: 'Occupancy Report', desc: 'Vacancy rates across all properties', period: 'June 2026' },
  { name: 'KRA Rental Income Tax', desc: '2025 Finance Act tiered rates summary', period: 'June 2026' },
  { name: 'Maintenance Costs', desc: 'Total spend per property and category', period: 'Q2 2026' },
];

function downloadCSV(reportName: string) {
  const csv = `Report,${reportName}\nPeriod,June 2026\nGenerated,${new Date().toISOString()}\n\nProperty,Collected,Expected,Rate\nKileleshwa Block A,KES 450000,KES 600000,75%\nNyeri Heights,KES 320000,KES 400000,80%\nMombasa Court,KES 200000,KES 250000,80%`;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${reportName.replace(/\s/g, '_').toLowerCase()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadPDF(reportName: string) {
  // Generate a simple text-based PDF placeholder
  const content = `TIMIS Report: ${reportName}\nGenerated: ${new Date().toLocaleDateString('en-KE')}\n\nThis is a placeholder. Full PDF generation requires backend integration.`;
  const blob = new Blob([content], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${reportName.replace(/\s/g, '_').toLowerCase()}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Reports</h1>
      <div className="grid gap-4">
        {reports.map((r) => (
          <div key={r.name} className="timis-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold">{r.name}</h3>
              <p className="text-sm text-timis-muted">{r.desc}</p>
              <p className="text-xs text-timis-muted mt-1">Period: {r.period}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <TimisButton variant="secondary" size="sm" onClick={() => downloadPDF(r.name)}>
                <Download className="w-3.5 h-3.5 mr-1.5" />PDF
              </TimisButton>
              <TimisButton variant="ghost" size="sm" onClick={() => downloadCSV(r.name)}>
                <Download className="w-3.5 h-3.5 mr-1.5" />CSV
              </TimisButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
