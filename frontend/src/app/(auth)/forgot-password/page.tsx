'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-timis-dark-surface px-4">
      <div className="w-full max-w-md timis-card">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-timis-accent rounded-xl mx-auto mb-3 flex items-center justify-center">
            <span className="text-timis-primary font-bold text-xl">T</span>
          </div>
          <h1 className="font-display text-2xl font-bold">Reset Password</h1>
          <p className="text-timis-muted mt-1">We&apos;ll send you a reset link</p>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <p className="text-timis-success font-medium">Check your email</p>
            <p className="text-timis-muted text-sm mt-2">If an account exists for {email}, you&apos;ll receive a password reset link.</p>
            <Link href="/login" className="inline-block mt-6 text-timis-accent hover:underline font-medium text-sm">Back to Sign In</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent focus:border-transparent outline-none" required />
            </div>
            <button type="submit" className="w-full bg-timis-accent hover:bg-timis-accent/90 text-timis-primary py-3 rounded-lg font-semibold transition active:scale-[0.97]">Send Reset Link</button>
            <p className="text-center text-sm text-timis-muted">
              <Link href="/login" className="text-timis-accent hover:underline">Back to Sign In</Link>
            </p>
          </form>
        )}
      </div>
    </main>
  );
}
