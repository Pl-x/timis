import { Check } from 'lucide-react';

interface Step {
  label: string;
  status: 'completed' | 'current' | 'pending';
}

interface MaintenanceTimelineProps {
  steps: Step[];
}

export function MaintenanceTimeline({ steps }: MaintenanceTimelineProps) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
              step.status === 'completed' ? 'bg-success text-white' :
              step.status === 'current' ? 'bg-accent' : 'bg-border dark:bg-[#1E3A5F]'
            }`}>
              {step.status === 'completed' && <Check size={14} />}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-0.5 h-8 ${step.status === 'completed' ? 'bg-success' : 'bg-border dark:bg-[#1E3A5F]'}`} />
            )}
          </div>
          <p className={`text-sm pt-0.5 ${step.status === 'pending' ? 'text-muted' : 'text-primary dark:text-white'}`}>
            {step.label}
          </p>
        </div>
      ))}
    </div>
  );
}
