'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewMaintenancePage() {
  const router = useRouter();
  const [form, setForm] = useState({ category: '', description: '', urgency: 'medium', photo: null as File | null });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST to /api/maintenance
    router.push('/tenant/maintenance');
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">New Request</h1>
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
            <option>Plumbing</option>
            <option>Electrical</option>
            <option>Structural</option>
            <option>Appliance</option>
            <option>Pest Control</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-inherit block mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={4}
            className="w-full border rounded-xl p-3 text-base"
            placeholder="Describe the issue..."
          />
        </div>

        <div>
          <label className="text-sm font-medium text-inherit block mb-1">Urgency</label>
          <div className="flex gap-2">
            {['low', 'medium', 'high'].map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setForm({ ...form, urgency: u })}
                className={`flex-1 py-3 rounded-xl text-sm capitalize min-h-[48px] border ${form.urgency === u ? 'bg-blue-600 text-white border-blue-600' : 'bg-timis-card dark:bg-timis-dark-card text-inherit'}`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-inherit block mb-1">Photo</label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setForm({ ...form, photo: e.target.files?.[0] || null })}
            className="w-full min-h-[48px] text-base"
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl text-base font-medium min-h-[56px]">
          Submit Request
        </button>
      </form>
    </div>
  );
}
