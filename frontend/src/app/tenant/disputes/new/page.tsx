'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewDisputePage() {
  const router = useRouter();
  const [form, setForm] = useState({ category: '', subject: '', description: '', evidence: null as File | null });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST to /api/disputes
    router.push('/tenant/disputes');
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">New Dispute</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-inherit block mb-1">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            required
            className="w-full border rounded-xl p-3 min-h-[48px] text-base bg-timis-card dark:bg-timis-dark-card"
          >
            <option value="">Select category</option>
            <option>Billing</option>
            <option>Deposit</option>
            <option>Repairs</option>
            <option>Lease Terms</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-inherit block mb-1">Subject</label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
            className="w-full border rounded-xl p-3 min-h-[48px] text-base"
            placeholder="Brief subject..."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-inherit block mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={4}
            className="w-full border rounded-xl p-3 text-base"
            placeholder="Explain the dispute..."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-inherit block mb-1">Evidence (optional)</label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setForm({ ...form, evidence: e.target.files?.[0] || null })}
            className="w-full min-h-[48px] text-base"
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl text-base font-medium min-h-[56px]">
          Submit Dispute
        </button>
      </form>
    </div>
  );
}
