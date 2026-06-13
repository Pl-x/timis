'use client';

function ScoreGauge({ score = 72 }: { score?: number }) {
  const color = score >= 70 ? '#22c55e' : score >= 40 ? '#eab308' : '#ef4444';
  const pct = (score / 100) * 251;
  return (
    <div className="flex flex-col items-center py-6">
      <svg width="160" height="90" viewBox="0 0 160 90">
        <path d="M15,80 A65,65 0 0,1 145,80" fill="none" stroke="#e5e7eb" strokeWidth="12" strokeLinecap="round" />
        <path d="M15,80 A65,65 0 0,1 145,80" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${pct * 0.65} 400`} />
      </svg>
      <span className="text-4xl font-bold -mt-4">{score}</span>
      <span className="text-sm text-timis-muted">Timis Score</span>
    </div>
  );
}

function FactorBar({ label, value, max = 100 }: { label: string; value: number; max?: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="text-timis-muted">{value}/{max}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full">
        <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${(value / max) * 100}%` }} />
      </div>
    </div>
  );
}

export default function ScorePage() {
  const factors = [
    { label: 'Payment Timeliness', value: 85 },
    { label: 'Property Care', value: 70 },
    { label: 'Communication', value: 90 },
    { label: 'Lease Compliance', value: 60 },
    { label: 'Tenure Length', value: 55 },
  ];

  const history = [65, 68, 70, 69, 72, 72];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Your Timis Score</h1>
      <ScoreGauge />

      <div className="timis-card-xl p-4 shadow-sm border space-y-3">
        <h2 className="font-semibold text-sm">Score Factors</h2>
        {factors.map((f) => <FactorBar key={f.label} {...f} />)}
      </div>

      <div className="timis-card-xl p-4 shadow-sm border">
        <h2 className="font-semibold text-sm mb-3">6-Month History</h2>
        <div className="flex items-end gap-2 h-20">
          {history.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-blue-200 rounded-t" style={{ height: `${(v / 100) * 100}%` }}>
                <div className="w-full bg-blue-600 rounded-t" style={{ height: `${(v / 100) * 100}%` }} />
              </div>
              <span className="text-[9px] text-gray-400 mt-1">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="timis-card-xl p-4 shadow-sm border">
        <h2 className="font-semibold text-sm mb-2">💡 Tips to Improve</h2>
        <ul className="text-sm text-timis-muted space-y-1">
          <li>• Pay rent before the due date</li>
          <li>• Report issues promptly</li>
          <li>• Keep your unit in good condition</li>
        </ul>
      </div>

      <button
        onClick={() => navigator.share?.({ title: 'My Timis Score', text: 'My Timis Score is 72!' })}
        className="w-full bg-gray-900 text-white py-4 rounded-xl text-base font-medium min-h-[56px]"
      >
        📤 Share Score
      </button>
    </div>
  );
}
