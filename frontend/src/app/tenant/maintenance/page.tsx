'use client';

import Link from 'next/link';

const statusColors: Record<string, string> = {
  Open: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Resolved: 'bg-green-100 text-green-800',
};

export default function MaintenancePage() {
  const requests = [
    { id: 1, title: 'Leaking kitchen tap', status: 'In Progress', date: '5 Jun 2026' },
    { id: 2, title: 'Broken window latch', status: 'Open', date: '2 Jun 2026' },
    { id: 3, title: 'Electrical socket sparking', status: 'Resolved', date: '20 May 2026' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Maintenance</h1>
        <Link href="/tenant/maintenance/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm min-h-[44px] flex items-center">
          + New
        </Link>
      </div>

      {requests.map((r) => (
        <div key={r.id} className="timis-card-xl p-4 shadow-sm border">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium">{r.title}</p>
            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[r.status]}`}>{r.status}</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{r.date}</p>
        </div>
      ))}
    </div>
  );
}
