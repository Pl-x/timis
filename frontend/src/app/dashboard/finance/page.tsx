'use client';
import Link from 'next/link';

const arrears = [
  { tenant: 'Mary Atieno', unit: 'A-305', amount: 'KES 70,000', months: 2 },
  { tenant: 'John Odhiambo', unit: 'C-102', amount: 'KES 45,000', months: 1 },
  { tenant: 'Grace Mwende', unit: 'B-108', amount: 'KES 130,000', months: 4 },
];

const recentPayments = [
  { tenant: 'Jane Wanjiku', amount: 'KES 35,000', date: '2026-06-01', method: 'M-Pesa' },
  { tenant: 'Peter Kamau', amount: 'KES 28,000', date: '2026-06-02', method: 'M-Pesa' },
  { tenant: 'Sarah Njeri', amount: 'KES 22,000', date: '2026-06-03', method: 'Bank' },
];

export default function FinancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-inherit">Finance</h1>
        <Link href="/dashboard/finance/invoices" className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">View Invoices</Link>
      </div>
      <div className="timis-card-xl p-5 shadow-sm border">
        <h2 className="font-semibold text-inherit mb-4">Rent Collected vs Expected</h2>
        <div className="h-48 flex items-end gap-4">
          {[{c:80,e:100},{c:90,e:100},{c:75,e:100},{c:95,e:100},{c:88,e:100},{c:92,e:100}].map((d, i) => (
            <div key={i} className="flex-1 flex gap-1 items-end">
              <div className="flex-1 bg-emerald-500 rounded-t" style={{ height: `${d.c}%` }} title="Collected" />
              <div className="flex-1 bg-gray-200 rounded-t" style={{ height: `${d.e}%` }} title="Expected" />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          {['Jan','Feb','Mar','Apr','May','Jun'].map(m => <span key={m}>{m}</span>)}
        </div>
        <div className="flex gap-4 mt-3 text-xs"><span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded" />Collected</span><span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-200 rounded border" />Expected</span></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="timis-card-xl p-5 shadow-sm border">
          <h2 className="font-semibold text-inherit mb-4">Arrears</h2>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-timis-muted"><th className="pb-2">Tenant</th><th className="pb-2">Unit</th><th className="pb-2">Amount</th><th className="pb-2">Months</th></tr></thead>
            <tbody className="divide-y">
              {arrears.map((a, i) => (
                <tr key={i}><td className="py-2">{a.tenant}</td><td className="py-2">{a.unit}</td><td className="py-2 text-red-600 font-medium">{a.amount}</td><td className="py-2">{a.months}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="timis-card-xl p-5 shadow-sm border">
          <h2 className="font-semibold text-inherit mb-4">Recent Payments</h2>
          <ul className="divide-y text-sm">
            {recentPayments.map((p, i) => (
              <li key={i} className="py-3 flex justify-between items-center">
                <div><p className="font-medium text-inherit">{p.tenant}</p><p className="text-timis-muted text-xs">{p.date} · {p.method}</p></div>
                <span className="text-emerald-600 font-medium">{p.amount}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
