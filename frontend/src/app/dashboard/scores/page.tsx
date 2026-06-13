'use client';
import { Star } from 'lucide-react';

const tenantScores = [
  { name: 'Wanjiku Kamau', unit: 'A-204', score: 782, band: 'Excellent Tenant' },
  { name: 'Peter Ochieng', unit: 'B-102', score: 691, band: 'Good Standing' },
  { name: 'Mary Njeri', unit: 'A-105', score: 742, band: 'Good Standing' },
  { name: 'John Mwangi', unit: 'C-301', score: 453, band: 'Fair' },
  { name: 'Amina Hassan', unit: 'B-205', score: 324, band: 'At Risk' },
];

function scoreColor(score: number) {
  if (score >= 751) return 'text-timis-accent';
  if (score >= 601) return 'text-teal-400';
  if (score >= 401) return 'text-timis-warning';
  return 'text-timis-danger';
}

export default function ScoresPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Timis Scores</h1>
      <div className="timis-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-timis-border dark:border-timis-dark-border">
              <th className="text-left py-3 px-4 font-medium text-timis-muted">Tenant</th>
              <th className="text-left py-3 px-4 font-medium text-timis-muted">Unit</th>
              <th className="text-left py-3 px-4 font-medium text-timis-muted">Score</th>
              <th className="text-left py-3 px-4 font-medium text-timis-muted">Band</th>
            </tr>
          </thead>
          <tbody>
            {tenantScores.map((t) => (
              <tr key={t.name} className="border-b border-timis-border dark:border-timis-dark-border last:border-0">
                <td className="py-3 px-4 font-medium">{t.name}</td>
                <td className="py-3 px-4 text-timis-muted">{t.unit}</td>
                <td className={`py-3 px-4 font-money font-bold ${scoreColor(t.score)}`}>{t.score}</td>
                <td className="py-3 px-4 text-timis-muted">{t.band}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
