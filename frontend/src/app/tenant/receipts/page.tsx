'use client';

// NOTE: Receipts are cached via service worker for offline access.
// Register SW in _app or layout to cache /api/receipts responses.

export default function ReceiptsPage() {
  const receipts = [
    { id: 'RCP-0601', month: 'May 2026', amount: 'KES 25,000', date: '28 May 2026' },
    { id: 'RCP-0501', month: 'Apr 2026', amount: 'KES 25,000', date: '25 Apr 2026' },
    { id: 'RCP-0401', month: 'Mar 2026', amount: 'KES 25,000', date: '30 Mar 2026' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Receipts</h1>
      <p className="text-xs text-gray-400">📶 Available offline</p>

      {receipts.map((r) => (
        <div key={r.id} className="timis-card-xl p-4 shadow-sm border flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">{r.month}</p>
            <p className="text-xs text-gray-400">{r.id} • {r.date}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold">{r.amount}</p>
            <button className="text-xs text-blue-600 min-h-[44px] min-w-[44px]">Download</button>
          </div>
        </div>
      ))}
    </div>
  );
}
