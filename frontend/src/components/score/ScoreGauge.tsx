interface ScoreGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export function ScoreGauge({ score, size = 'md' }: ScoreGaugeProps) {
  const percentage = (score / 850) * 100;
  const band = score >= 750 ? 'Excellent' : score >= 650 ? 'Good' : score >= 500 ? 'Fair' : score >= 350 ? 'Poor' : 'Very Poor';
  const color = score >= 750 ? '#10B981' : score >= 650 ? '#3B82F6' : score >= 500 ? '#F59E0B' : '#EF4444';

  const sizes = { sm: 'w-24 h-24', md: 'w-36 h-36', lg: 'w-48 h-48' };
  const textSizes = { sm: 'text-xl', md: 'text-3xl', lg: 'text-4xl' };

  return (
    <div className={`relative ${sizes[size]} flex items-center justify-center`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="8" />
        <circle
          cx="50" cy="50" r="45" fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${percentage * 2.83} ${283 - percentage * 2.83}`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-center">
        <span className={`font-bold ${textSizes[size]}`}>{score}</span>
        <p className="text-xs text-gray-500">{band}</p>
      </div>
    </div>
  );
}
