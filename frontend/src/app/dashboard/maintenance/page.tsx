'use client';

type Request = { id: string; title: string; unit: string; tenant: string; priority: string };

const columns: { title: string; color: string; items: Request[] }[] = [
  { title: 'New', color: 'border-blue-400', items: [
    { id: 'M-001', title: 'Leaking tap in kitchen', unit: 'A-101', tenant: 'Jane Wanjiku', priority: 'Medium' },
    { id: 'M-002', title: 'Broken window latch', unit: 'B-204', tenant: 'Peter Kamau', priority: 'Low' },
  ]},
  { title: 'In Progress', color: 'border-amber-400', items: [
    { id: 'M-003', title: 'Electrical fault - socket', unit: 'A-305', tenant: 'Mary Atieno', priority: 'High' },
  ]},
  { title: 'Completed', color: 'border-emerald-400', items: [
    { id: 'M-004', title: 'Repaint bedroom walls', unit: 'C-102', tenant: 'John Odhiambo', priority: 'Low' },
    { id: 'M-005', title: 'Fix door lock', unit: 'B-108', tenant: 'Grace Mwende', priority: 'High' },
  ]},
];

const priorityColors: Record<string, string> = {
  High: 'text-red-600 bg-red-50',
  Medium: 'text-amber-600 bg-amber-50',
  Low: 'text-timis-muted bg-gray-100',
};

export default function MaintenancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-inherit">Maintenance Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(col => (
          <div key={col.title} className={`bg-gray-50 rounded-xl p-4 border-t-4 ${col.color}`}>
            <h2 className="font-semibold text-inherit mb-3">{col.title} <span className="text-gray-400 font-normal">({col.items.length})</span></h2>
            <div className="space-y-3">
              {col.items.map(item => (
                <div key={item.id} className="timis-card-lg p-3 shadow-sm border">
                  <p className="font-medium text-sm text-inherit">{item.title}</p>
                  <p className="text-xs text-timis-muted mt-1">{item.unit} · {item.tenant}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[item.priority]}`}>{item.priority}</span>
                    <span className="text-xs text-gray-400">{item.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
