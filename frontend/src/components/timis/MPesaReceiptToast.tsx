'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface MPesaReceiptToastProps {
  name: string;
  amount: number;
  unit: string;
  onDismiss: () => void;
}

export default function MPesaReceiptToast({ name, amount, unit, onDismiss }: MPesaReceiptToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    const interval = setInterval(() => setProgress((p) => Math.max(0, p - 2)), 100);
    return () => { clearTimeout(timer); clearInterval(interval); };
  }, [onDismiss]);

  return (
    <div className="fixed top-4 inset-x-4 md:left-auto md:right-4 md:w-96 z-[100] animate-fade-up">
      <div className="bg-timis-success text-white rounded-lg p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <CheckCircle size={20} className="shrink-0 mt-0.5" />
          <p className="flex-1 text-sm font-medium">KES {amount.toLocaleString()} received from {name} — {unit}</p>
          <button onClick={onDismiss}><X size={16} /></button>
        </div>
        <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white/60 transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
