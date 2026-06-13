'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveSession } from '@/lib/session';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        saveSession(data.access_token, data.user);
        router.push('/dashboard');
      } else {
        const err = await res.json().catch(() => ({ message: 'Login failed' }));
        setError(err.message || 'Invalid email or password');
      }
    } catch {
      setError('Cannot reach server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-timis-dark-surface px-4">
      <div className="w-full max-w-md timis-card">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-timis-accent rounded-xl mx-auto mb-3 flex items-center justify-center">
            <span className="text-timis-primary font-bold text-xl">T</span>
          </div>
          <h1 className="font-display text-2xl font-bold">Sign in to TIMIS</h1>
          <p className="text-timis-muted mt-1">Property management powered by M-Pesa</p>
        </div>

        {error && <div className="mb-4 p-3 rounded-lg bg-timis-danger/10 text-timis-danger text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
            <input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent focus:border-transparent outline-none" required />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
            <input id="password" type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent focus:border-transparent outline-none" required />
          </div>
          <div className="flex justify-between items-center text-sm">
            <Link href="/forgot-password" className="text-timis-accent hover:underline">Forgot password?</Link>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-timis-accent hover:bg-timis-accent/90 text-timis-primary py-3 rounded-lg font-semibold transition active:scale-[0.97] disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-timis-muted mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-timis-accent hover:underline font-medium">Create one</Link>
        </p>
      </div>
    </main>
  );
}
