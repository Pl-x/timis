'use client';

const disputes = [
  { id: 'D-001', tenant: 'Mary Atieno', subject: 'Overcharged water bill', status: 'Open', filed: '2026-06-05', timeline: ['Filed','Under Review'] },
  { id: 'D-002', tenant: 'John Odhiambo', subject: 'Security deposit deduction', status: 'In Progress', filed: '2026-05-20', timeline: ['Filed','Under Review','Mediation'] },
  { id: 'D-003', tenant: 'Grace Mwende', subject: 'Unauthorized entry', status: 'Resolved', filed: '2026-04-10', timeline: ['Filed','Under Review','Mediation','Resolved'] },
];

const statusColors: Record<string, string> = {
  Open: 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-amber-100 text-amber-700',
  Resolved: 'bg-emerald-100 text-emerald-700',
};

const allSteps = ['Filed', 'Under Review', 'Mediation', 'Resolved'];

export default function DisputesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-inherit">Disputes</h1>
      <div className="space-y-4">
        {disputes.map(d => (
          <div key={d.id} className="timis-card-xl p-5 shadow-sm border">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-inherit">{d.subject}</h3>
                <p className="text-sm text-timis-muted">{d.tenant} · {d.id} · Filed {d.filed}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[d.status]}`}>{d.status}</span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {allSteps.map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${d.timeline.includes(step) ? 'bg-[#1E3A5F] text-white' : 'bg-gray-200 text-gray-400'}`}>{i + 1}</div>
                  <span className={`text-xs ${d.timeline.includes(step) ? 'text-inherit' : 'text-gray-400'}`}>{step}</span>
                  {i < allSteps.length - 1 && <div className={`w-6 h-px ${d.timeline.includes(allSteps[i + 1]) ? 'bg-[#1E3A5F]' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
