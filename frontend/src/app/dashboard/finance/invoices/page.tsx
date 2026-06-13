'use client';
import { useState } from 'react';

const invoices = [
  { id: 'INV-001', tenant: 'Jane Wanjiku', amount: 'KES 35,000', date: '2026-06-01', status: 'Paid' },
  { id: 'INV-002', tenant: 'Peter Kamau', amount: 'KES 28,000', date: '2026-06-01', status: 'Paid' },
  { id: 'INV-003', tenant: 'Mary Atieno', amount: 'KES 35,000', date: '2026-06-01', status: 'Overdue' },
  { id: 'INV-004', tenant: 'John Odhiambo', amount: 'KES 45,000', date: '2026-06-01', status: 'Pending' },
  { id: 'INV-005', tenant: 'Grace Mwende', amount: 'KES 30,000', date: '2026-05-01', status: 'Overdue' },
];

const statusColors: Record<string, string> = {
  Paid: 'bg-emerald-100 text-emerald-700',
  Pending: 'bg-amber-100 text-amber-700',
  Overdue: 'bg-red-100 text-red-700',
};

export default function InvoicesPage() {
  const [filter, setFilter] = useState('All');

  const filtered = filter === 'All' ? invoices : invoices.filter(i => i.status === filter);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-inherit">Invoices</h1>
      <div className="flex gap-2">
        {['All', 'Paid', 'Pending', 'Overdue'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm ${filter === f ? 'bg-[#1E3A5F] text-white' : 'bg-gray-100 text-timis-muted hover:bg-gray-200'}`}>{f}</button>
        ))}
      </div>
      <div className="timis-card-xl shadow-sm border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>{['Invoice','Tenant','Amount','Date','Status'].map(h => <th key={h} className="px-4 py-3 text-left font-medium text-timis-muted">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(inv => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-inherit">{inv.id}</td>
                <td className="px-4 py-3 text-timis-muted">{inv.tenant}</td>
                <td className="px-4 py-3 text-inherit">{inv.amount}</td>
                <td className="px-4 py-3 text-timis-muted">{inv.date}</td>
                <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[inv.status]}`}>{inv.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
