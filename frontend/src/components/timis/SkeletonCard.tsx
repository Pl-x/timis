interface SkeletonCardProps {
  variant?: 'stat' | 'unit' | 'score';
}

const layouts = {
  stat: (
    <>
      <div className="h-4 w-4 rounded bg-current/10" />
      <div className="h-3 w-20 rounded bg-current/10 mt-3" />
      <div className="h-6 w-28 rounded bg-current/10 mt-2" />
    </>
  ),
  unit: (
    <>
      <div className="h-4 w-32 rounded bg-current/10" />
      <div className="h-3 w-24 rounded bg-current/10 mt-2" />
      <div className="h-3 w-16 rounded bg-current/10 mt-2" />
    </>
  ),
  score: (
    <div className="flex flex-col items-center gap-2">
      <div className="h-20 w-20 rounded-full bg-current/10" />
      <div className="h-4 w-12 rounded bg-current/10" />
    </div>
  ),
};

export default function SkeletonCard({ variant = 'stat' }: SkeletonCardProps) {
  return (
    <div className="timis-card p-4 animate-pulse text-timis-muted dark:bg-timis-dark-card dark:text-timis-dark-border">
      {layouts[variant]}
    </div>
  );
}
