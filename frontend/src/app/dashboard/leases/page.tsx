'use client';

const leases = [
  { tenant: 'Jane Wanjiku', unit: 'A-101', start: '2025-01-01', end: '2026-12-31', status: 'Active' },
  { tenant: 'Peter Kamau', unit: 'B-204', start: '2025-03-01', end: '2026-08-31', status: 'Expiring Soon' },
  { tenant: 'Mary Atieno', unit: 'A-305', start: '2024-06-01', end: '2026-05-31', status: 'Expired' },
  { tenant: 'John Odhiambo', unit: 'C-102', start: '2025-09-01', end: '2027-08-31', status: 'Active' },
];

const statusColors: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-700',
  'Expiring Soon': 'bg-amber-100 text-amber-700',
  Expired: 'bg-red-100 text-red-700',
};

export default function LeasesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-inherit">Leases</h1>
      <div className="timis-card-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {['Tenant','Unit','Start','End','Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium text-timis-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {leases.map((l, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-inherit">{l.tenant}</td>
                <td className="px-4 py-3 text-timis-muted">{l.unit}</td>
                <td className="px-4 py-3 text-timis-muted">{l.start}</td>
                <td className="px-4 py-3 text-timis-muted">{l.end}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[l.status]}`}>{l.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
