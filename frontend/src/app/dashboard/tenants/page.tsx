'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TimisButton, PaymentStatusPill } from '@/components/timis';
import { Plus } from 'lucide-react';

interface Tenant {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  status: string;
  email?: string;
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/tenants`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('timis_token') || localStorage.getItem('kiro_token') || ''}` },
        });
        if (res.ok) setTenants(await res.json());
      } catch { /* empty */ } finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Tenants</h1>
        <Link href="/dashboard/tenants/new">
          <TimisButton variant="primary" size="sm"><Plus className="w-4 h-4 mr-1.5" />Onboard Tenant</TimisButton>
        </Link>
      </div>

      {loading ? (
        <div className="kiro-card h-40 animate-pulse bg-timis-surface dark:bg-timis-dark-surface" />
      ) : tenants.length === 0 ? (
        <div className="kiro-card text-center py-12">
          <p className="text-timis-muted">No tenants yet — onboard your first tenant to get started.</p>
          <Link href="/dashboard/tenants/new" className="inline-block mt-4">
            <TimisButton variant="primary">Onboard Tenant</TimisButton>
          </Link>
        </div>
      ) : (
        <div className="kiro-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-timis-border dark:border-timis-dark-border">
                <th className="text-left py-3 px-4 font-medium text-timis-muted">Name</th>
                <th className="text-left py-3 px-4 font-medium text-timis-muted">Phone</th>
                <th className="text-left py-3 px-4 font-medium text-timis-muted">Email</th>
                <th className="text-left py-3 px-4 font-medium text-timis-muted">Status</th>
                <th className="text-left py-3 px-4 font-medium text-timis-muted">Action</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t.id} className="border-b border-timis-border dark:border-timis-dark-border last:border-0">
                  <td className="py-3 px-4 font-medium">{t.first_name} {t.last_name}</td>
                  <td className="py-3 px-4 text-timis-muted font-money">{t.phone}</td>
                  <td className="py-3 px-4 text-timis-muted">{t.email || '—'}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${t.status === 'active' ? 'bg-timis-success/10 text-timis-success' : t.status === 'applicant' ? 'bg-timis-warning/10 text-timis-warning' : 'bg-timis-muted/10 text-timis-muted'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link href={`/dashboard/tenants/${t.id}`} className="text-timis-accent hover:underline">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
