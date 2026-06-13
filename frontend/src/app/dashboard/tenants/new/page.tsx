'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TimisButton } from '@/components/timis';

const steps = ['Personal Info', 'Documents', 'Unit Assignment'] as const;

export default function NewTenantPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    first_name: '', last_name: '', phone: '', id_number: '', email: '',
    property: '', unit: '', move_in_date: '', rent: '',
  });
  const [files, setFiles] = useState<{id_front?: File, id_back?: File, income?: File}>({});

  const uploadFile = async (tenantId: string, file: File, docType: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tenant_id', tenantId);
    formData.append('doc_type', docType);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/upload/document`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('timis_token') || localStorage.getItem('kiro_token') || ''}` },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Upload failed' }));
      console.error(`Upload failed for ${docType}:`, err);
      throw new Error(`${docType}: ${err.message}`);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/tenants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('timis_token') || localStorage.getItem('kiro_token') || ''}`,
        },
        body: JSON.stringify({
          first_name: form.first_name,
          last_name: form.last_name,
          phone: form.phone.replace(/\s/g, ''),
          id_type: 'national_id',
          id_number: form.id_number,
          email: form.email || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        // Upload documents
        try {
          if (files.id_front) await uploadFile(data.id, files.id_front, 'id_front');
          if (files.id_back) await uploadFile(data.id, files.id_back, 'id_back');
          if (files.income) await uploadFile(data.id, files.income, 'proof_of_income');
        } catch (uploadErr) {
          setError(`Tenant created but document upload failed: ${uploadErr instanceof Error ? uploadErr.message : 'unknown'}`);
          setLoading(false);
          return;
        }
        router.push('/dashboard/tenants');
      } else {
        const err = await res.json().catch(() => ({ message: 'Failed to create tenant' }));
        setError(err.message || `Error ${res.status}`);
      }
    } catch {
      setError('Cannot reach server');
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string, val: string) => setForm({ ...form, [key]: val });

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="font-display text-2xl font-bold">Onboard New Tenant</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i <= step ? 'bg-timis-accent text-timis-primary' : 'bg-timis-surface dark:bg-timis-dark-surface text-timis-muted'}`}>{i + 1}</div>
            <span className={`text-sm hidden sm:block ${i <= step ? 'font-medium' : 'text-timis-muted'}`}>{s}</span>
            {i < steps.length - 1 && <div className="w-6 h-px bg-timis-border dark:bg-timis-dark-border" />}
          </div>
        ))}
      </div>

      {error && <div className="p-3 rounded-lg bg-timis-danger/10 text-timis-danger text-sm">{error}</div>}

      <div className="kiro-card">
        {step === 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-timis-muted mb-1">First Name</label>
                <input value={form.first_name} onChange={(e) => set('first_name', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none" placeholder="Jane" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-timis-muted mb-1">Last Name</label>
                <input value={form.last_name} onChange={(e) => set('last_name', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none" placeholder="Wanjiku" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-timis-muted mb-1">Phone (M-Pesa)</label>
              <input value={form.phone} onChange={(e) => set('phone', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none" placeholder="254712345678" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-timis-muted mb-1">National ID Number</label>
              <input value={form.id_number} onChange={(e) => set('id_number', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none" placeholder="12345678" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-timis-muted mb-1">Email (optional)</label>
              <input value={form.email} onChange={(e) => set('email', e.target.value)} type="email" className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none" placeholder="jane@example.com" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-timis-muted">Upload tenant identification documents</p>
            <div>
              <label className="block text-sm font-medium text-timis-muted mb-1">ID Copy (Front)</label>
              <input type="file" accept="image/*,.pdf" onChange={(e) => setFiles({...files, id_front: e.target.files?.[0]})} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-timis-accent file:text-timis-primary file:font-medium" />
            </div>
            <div>
              <label className="block text-sm font-medium text-timis-muted mb-1">ID Copy (Back)</label>
              <input type="file" accept="image/*,.pdf" onChange={(e) => setFiles({...files, id_back: e.target.files?.[0]})} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-timis-accent file:text-timis-primary file:font-medium" />
            </div>
            <div>
              <label className="block text-sm font-medium text-timis-muted mb-1">Proof of Income (payslip/bank statement)</label>
              <input type="file" accept="image/*,.pdf" onChange={(e) => setFiles({...files, income: e.target.files?.[0]})} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-timis-accent file:text-timis-primary file:font-medium" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-timis-muted mb-1">Property</label>
              <select value={form.property} onChange={(e) => set('property', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none">
                <option value="">Select property...</option>
                <option>Sunrise Apartments</option>
                <option>Jamhuri Heights</option>
                <option>Mombasa View</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-timis-muted mb-1">Unit</label>
              <select value={form.unit} onChange={(e) => set('unit', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none">
                <option value="">Select unit...</option>
                <option>A-101</option>
                <option>A-102</option>
                <option>B-201</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-timis-muted mb-1">Move-in Date</label>
              <input type="date" value={form.move_in_date} onChange={(e) => set('move_in_date', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-timis-muted mb-1">Monthly Rent (KES)</label>
              <input type="number" value={form.rent} onChange={(e) => set('rent', e.target.value)} className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none font-money" placeholder="25000" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-timis-border dark:border-timis-dark-border">
          <TimisButton variant="ghost" size="md" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>Back</TimisButton>
          {step < 2 ? (
            <TimisButton variant="primary" size="md" onClick={() => setStep(step + 1)}>Next</TimisButton>
          ) : (
            <TimisButton variant="primary" size="md" onClick={handleSubmit} loading={loading}>Submit Tenant</TimisButton>
          )}
        </div>
      </div>
    </div>
  );
}
