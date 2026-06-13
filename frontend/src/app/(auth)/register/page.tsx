'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSession } from '@/lib/session';
import { PLANS, Plan } from '@/lib/plans';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', org_name: '' });
  const [plan, setPlan] = useState<Plan>('free');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const [first_name, ...rest] = form.name.trim().split(' ');
      const last_name = rest.join(' ') || first_name;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email, password: form.password, first_name, last_name,
          phone: form.phone.replace(/\s/g, '').replace('+', ''), org_name: form.org_name, plan,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        saveSession(data.access_token, data.user);
        // Send to upgrade gate (paid plans need M-Pesa; free continues)
        router.push('/dashboard?welcome=1');
      } else {
        const err = await res.json().catch(() => ({ message: 'Registration failed' }));
        setError(err.message || `Error ${res.status}`);
      }
    } catch {
      setError('Cannot reach server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-timis-dark-surface px-4 py-12">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
        {/* Form */}
        <div className="kiro-card">
          <div className="mb-6">
            <div className="w-12 h-12 bg-timis-accent rounded-xl mb-3 flex items-center justify-center">
              <span className="text-timis-primary font-bold text-xl">T</span>
            </div>
            <h1 className="font-display text-2xl font-bold">Create your account</h1>
            <p className="text-timis-muted mt-1 text-sm">Start managing properties with TIMIS</p>
          </div>

          {error && <div className="mb-4 p-3 rounded-lg bg-timis-danger/10 text-timis-danger text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none" required />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none" required />
            <input type="tel" placeholder="Phone (254...)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none" required />
            <input type="password" placeholder="Password (min 8 chars)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none" required minLength={8} />
            <input type="text" placeholder="Organization Name" value={form.org_name} onChange={(e) => setForm({ ...form, org_name: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none" required />
            <button type="submit" disabled={loading} className="w-full bg-timis-accent hover:bg-timis-accent/90 text-timis-primary py-3 rounded-lg font-semibold transition active:scale-[0.97] disabled:opacity-50">
              {loading ? 'Creating account...' : `Create Account — ${PLANS[plan].name}`}
            </button>
          </form>

          <p className="text-center text-sm text-timis-muted mt-6">
            Already have an account? <Link href="/login" className="text-timis-accent hover:underline font-medium">Sign in</Link>
          </p>
        </div>

        {/* Plan selector */}
        <div className="space-y-3">
          <h2 className="font-display text-lg font-semibold text-white">Choose your plan</h2>
          {(Object.values(PLANS)).map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPlan(p.id)}
              className={`w-full text-left rounded-card p-4 border-2 transition ${plan === p.id ? 'border-timis-accent bg-timis-accent/5' : 'border-timis-dark-border bg-timis-dark-card hover:border-timis-muted'}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-display font-semibold text-white">{p.name}</span>
                <span className="font-money text-timis-accent text-sm">{p.priceLabel}</span>
              </div>
              <p className="text-xs text-timis-muted mt-1">{p.highlights.slice(0, 3).join(' · ')}</p>
            </button>
          ))}
          <p className="text-xs text-timis-muted">Paid plans activate after M-Pesa payment. You can start on Free and upgrade anytime.</p>
        </div>
      </div>
    </main>
  );
}
