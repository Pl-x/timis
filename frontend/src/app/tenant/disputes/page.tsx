'use client';

import Link from 'next/link';

const statusColors: Record<string, string> = {
  Open: 'bg-yellow-100 text-yellow-800',
  'Under Review': 'bg-blue-100 text-blue-800',
  Resolved: 'bg-green-100 text-green-800',
};

export default function DisputesPage() {
  const disputes = [
    { id: 1, subject: 'Overcharged water bill', status: 'Under Review', date: '8 Jun 2026' },
    { id: 2, subject: 'Deposit deduction dispute', status: 'Open', date: '1 Jun 2026' },
    { id: 3, subject: 'Late fee incorrectly applied', status: 'Resolved', date: '15 May 2026' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Disputes</h1>
        <Link href="/tenant/disputes/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm min-h-[44px] flex items-center">
          + New
        </Link>
      </div>

      {disputes.map((d) => (
        <div key={d.id} className="timis-card-xl p-4 shadow-sm border">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium">{d.subject}</p>
            <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${statusColors[d.status]}`}>{d.status}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{d.date}</p>
        </div>
      ))}
    </div>
  );
}
