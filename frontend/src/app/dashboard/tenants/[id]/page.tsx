'use client';
import { useState } from 'react';
import { ScoreGauge } from '@/components/score/ScoreGauge';

const tabs = ['Profile', 'Payments', 'Maintenance', 'Disputes', 'Score'] as const;

export default function TenantDetailPage() {
  const [active, setActive] = useState<typeof tabs[number]>('Profile');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-inherit">Tenant Details</h1>
      <div className="flex gap-2 border-b">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActive(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${active === tab ? 'border-[#1E3A5F] text-[#1E3A5F]' : 'border-transparent text-timis-muted hover:text-inherit'}`}>
            {tab}
          </button>
        ))}
      </div>
      <div className="timis-card-xl p-6 shadow-sm border">
        {active === 'Profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="text-timis-muted">Name:</span> <span className="font-medium">Jane Wanjiku</span></div>
            <div><span className="text-timis-muted">Phone:</span> <span className="font-medium">0712345678</span></div>
            <div><span className="text-timis-muted">ID Number:</span> <span className="font-medium">29384756</span></div>
            <div><span className="text-timis-muted">Unit:</span> <span className="font-medium">A-101, Sunrise Apartments</span></div>
            <div><span className="text-timis-muted">Lease Start:</span> <span className="font-medium">2025-01-01</span></div>
            <div><span className="text-timis-muted">Rent:</span> <span className="font-medium">KES 35,000/mo</span></div>
          </div>
        )}
        {active === 'Payments' && (
          <ul className="divide-y text-sm">
            {[{date:'2026-06-01',amount:'KES 35,000',status:'Paid'},{date:'2026-05-01',amount:'KES 35,000',status:'Paid'},{date:'2026-04-01',amount:'KES 35,000',status:'Late'}].map((p,i) => (
              <li key={i} className="py-3 flex justify-between">
                <span>{p.date}</span><span>{p.amount}</span>
                <span className={p.status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'}>{p.status}</span>
              </li>
            ))}
          </ul>
        )}
        {active === 'Maintenance' && <p className="text-sm text-timis-muted">No open maintenance requests.</p>}
        {active === 'Disputes' && <p className="text-sm text-timis-muted">No active disputes.</p>}
        {active === 'Score' && (
          <div className="flex flex-col items-center gap-4">
            <ScoreGauge score={720} size="lg" />
            <p className="text-sm text-timis-muted">Based on payment history, maintenance compliance, and lease adherence.</p>
          </div>
        )}
      </div>
    </div>
  );
}
