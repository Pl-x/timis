'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TimisButton } from '@/components/timis';

export default function NewPropertyPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', address: '', city: '', county: '', property_type: 'residential' });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/properties`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('timis_token') || localStorage.getItem('kiro_token') || ''}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/dashboard/properties');
      } else {
        const err = await res.json().catch(() => ({ message: 'Failed' }));
        setError(err.message || 'Failed to create property');
      }
    } catch {
      setError('Cannot reach server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="font-display text-2xl font-bold">Add Property</h1>
      {error && <div className="p-3 rounded-lg bg-timis-danger/10 text-timis-danger text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="kiro-card space-y-4">
        <div>
          <label className="block text-sm font-medium text-timis-muted mb-1">Property Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sunrise Apartments" className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-timis-muted mb-1">Address</label>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="e.g. Tom Mboya Street" className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-timis-muted mb-1">City</label>
            <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Nairobi" className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-timis-muted mb-1">County</label>
            <input value={form.county} onChange={(e) => setForm({ ...form, county: e.target.value })} placeholder="Nairobi" className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-timis-muted mb-1">Type</label>
          <select value={form.property_type} onChange={(e) => setForm({ ...form, property_type: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none">
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="mixed">Mixed Use</option>
          </select>
        </div>
        <TimisButton variant="primary" size="lg" className="w-full" loading={loading}>Create Property</TimisButton>
      </form>
    </div>
  );
}
