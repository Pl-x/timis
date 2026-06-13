'use client';

interface TimisScoreCardProps {
  score: number;
  size?: 'full' | 'compact' | 'mini';
  animated?: boolean;
}

function getScoreColor(score: number) {
  if (score <= 400) return '#C0392B';
  if (score <= 600) return '#E87C2B';
  if (score <= 750) return '#2DD4BF';
  return '#F5A623';
}

function getScoreLabel(score: number) {
  if (score <= 400) return 'At Risk';
  if (score <= 600) return 'Fair';
  if (score <= 750) return 'Good Standing';
  return 'Excellent Tenant';
}

const sizes = { full: 200, compact: 120, mini: 60 };

export default function TimisScoreCard({ score, size = 'full', animated = true }: TimisScoreCardProps) {
  const dim = sizes[size];
  const r = dim * 0.38;
  const circumference = 2 * Math.PI * r;
  const progress = (score / 850) * circumference;
  const offset = circumference - progress;
  const color = getScoreColor(score);
  const label = getScoreLabel(score);
  const center = dim / 2;

  return (
    <div className="timis-card flex flex-col items-center justify-center p-4 dark:bg-timis-dark-card" style={{ width: dim + 32 }}>
      <svg width={dim} height={dim} className="rotate-[-90deg]">
        <circle cx={center} cy={center} r={r} fill="none" stroke="currentColor" strokeWidth={size === 'mini' ? 4 : 8} className="text-timis-border dark:text-timis-dark-border" />
        <circle
          cx={center} cy={center} r={r} fill="none"
          stroke={color} strokeWidth={size === 'mini' ? 4 : 8} strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={animated ? 'animate-score-fill' : ''}
          style={animated ? { '--score-offset': `${offset}` } as React.CSSProperties : undefined}
        />
      </svg>
      {size !== 'mini' && (
        <div className="flex flex-col items-center -mt-[calc(50%+0.5rem)]">
          <span className={`font-mono font-bold ${size === 'full' ? 'text-4xl' : 'text-xl'}`} style={{ color }}>{score}</span>
          {size === 'full' && <span className="text-xs text-timis-muted mt-1">{label}</span>}
        </div>
      )}
      {size === 'mini' && (
        <span className="font-mono text-xs font-bold -mt-10" style={{ color }}>{score}</span>
      )}
    </div>
  );
}
