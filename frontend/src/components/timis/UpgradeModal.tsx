'use client';
import { useState } from 'react';
import { PLANS, Plan } from '@/lib/plans';
import { getToken } from '@/lib/session';
import { X, Check } from 'lucide-react';

interface UpgradeModalProps {
  currentPlan: Plan;
  orgId: string;
  onClose: () => void;
  onUpgraded: (plan: Plan) => void;
}

export default function UpgradeModal({ currentPlan, orgId, onClose, onUpgraded }: UpgradeModalProps) {
  const [loading, setLoading] = useState<Plan | null>(null);
  const [msg, setMsg] = useState('');

  const upgrade = async (plan: Plan) => {
    if (plan === 'free') { onClose(); return; }
    setLoading(plan);
    setMsg('');
    try {
      // M-Pesa not wired yet — simulate plan activation
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/orgs/${orgId}/upgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ plan }),
      });
      if (res.ok) {
        localStorage.setItem('timis_plan', plan);
        onUpgraded(plan);
      } else {
        setMsg('Upgrade failed. Try again.');
      }
    } catch {
      setMsg('Cannot reach server.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl bg-timis-dark-card rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-timis-muted hover:text-white" aria-label="Continue on Free">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <h2 className="font-display text-2xl font-bold text-white">Choose Your TIMIS Plan</h2>
          <p className="text-timis-muted mt-1 text-sm">Unlock more units, AI features, and dispute management. M-Pesa payment activates paid plans.</p>
        </div>

        {msg && <div className="mb-4 p-3 rounded-lg bg-timis-danger/10 text-timis-danger text-sm text-center">{msg}</div>}

        <div className="grid md:grid-cols-4 gap-4">
          {Object.values(PLANS).map((p) => (
            <div key={p.id} className={`rounded-card p-5 border-2 flex flex-col ${p.id === 'pro' ? 'border-timis-accent' : 'border-timis-dark-border'}`}>
              {p.id === 'pro' && <span className="text-xs font-bold text-timis-accent uppercase tracking-wider mb-1">Most Popular</span>}
              <h3 className="font-display font-bold text-white">{p.name}</h3>
              <p className="font-money text-2xl font-bold text-white mt-1">{p.priceLabel}</p>
              <ul className="mt-4 space-y-1.5 flex-1">
                {p.highlights.map((h) => (
                  <li key={h} className="text-xs text-timis-muted flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-timis-success flex-shrink-0 mt-0.5" />{h}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => upgrade(p.id)}
                disabled={loading !== null || p.id === currentPlan}
                className={`mt-4 py-2.5 rounded-lg text-sm font-semibold transition active:scale-[0.97] disabled:opacity-50 ${p.id === 'pro' ? 'bg-timis-accent text-timis-primary' : p.id === 'free' ? 'border border-timis-border text-white hover:bg-white/5' : 'bg-timis-primary text-white hover:bg-timis-primary/80'}`}
              >
                {loading === p.id ? 'Processing...' : p.id === currentPlan ? 'Current Plan' : p.id === 'free' ? 'Continue Free' : `Choose ${p.name}`}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-timis-muted mt-6">
          You can continue on the Free plan (up to 5 units) and upgrade later from Settings.
        </p>
      </div>
    </div>
  );
}
