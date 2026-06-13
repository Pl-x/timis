'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TimisButton } from '@/components/timis';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export default function SettingsPage() {
  const router = useRouter();
  const [orgName, setOrgName] = useState('');
  const [plan, setPlan] = useState('free');
  const [orgId, setOrgId] = useState('');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const token = () => localStorage.getItem('timis_token') || localStorage.getItem('kiro_token') || '';

  useEffect(() => {
    const id = localStorage.getItem('timis_org') || '';
    setOrgId(id);
    if (id) {
      fetch(`${API}/orgs/${id}`, { headers: { Authorization: `Bearer ${token()}` } })
        .then((r) => r.ok ? r.json() : null)
        .then((d) => { if (d) { setOrgName(d.name); setPlan(d.plan); } })
        .catch(() => {});
    }
  }, []);

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const saveOrg = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/orgs/${orgId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ name: orgName }),
      });
      flash(res.ok ? 'Organization name updated ✓' : 'Failed to update');
    } catch { flash('Cannot reach server'); } finally { setSaving(false); }
  };

  const upgrade = async (newPlan: string) => {
    try {
      const res = await fetch(`${API}/orgs/${orgId}/upgrade`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` },
        body: JSON.stringify({ plan: newPlan }),
      });
      if (res.ok) { setPlan(newPlan); localStorage.setItem('timis_plan', newPlan); flash(`Upgraded to ${newPlan} ✓ — reload to see unlocked features`); }
      else flash('Upgrade failed');
    } catch { flash('Cannot reach server'); }
  };

  const deleteOrg = async () => {
    if (!confirm('Delete this organization permanently? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API}/orgs/${orgId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
      if (res.ok) {
        localStorage.clear();
        router.push('/register');
      } else flash('Delete failed');
    } catch { flash('Cannot reach server'); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display text-2xl font-bold">Settings</h1>

      {msg && <div className="p-3 rounded-lg bg-timis-success/10 text-timis-success text-sm">{msg}</div>}

      <div className="kiro-card space-y-4">
        <h2 className="font-display text-lg font-semibold">Organization</h2>
        <div>
          <label className="block text-sm font-medium text-timis-muted mb-1">Organization Name</label>
          <input value={orgName} onChange={(e) => setOrgName(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-timis-surface dark:bg-timis-dark-surface border border-timis-border dark:border-timis-dark-border focus:ring-2 focus:ring-timis-accent outline-none" />
        </div>
        <TimisButton variant="primary" onClick={saveOrg} loading={saving}>Save Changes</TimisButton>
      </div>

      <div className="kiro-card space-y-4">
        <h2 className="font-display text-lg font-semibold">Subscription</h2>
        <p className="text-timis-muted text-sm">Current plan: <span className="font-money font-semibold text-timis-accent uppercase">{plan}</span></p>
        <div className="flex flex-wrap gap-2">
          <TimisButton variant="secondary" size="sm" onClick={() => upgrade('starter')}>Starter — KES 1,500/mo</TimisButton>
          <TimisButton variant="secondary" size="sm" onClick={() => upgrade('pro')}>Pro — KES 4,000/mo</TimisButton>
          <TimisButton variant="secondary" size="sm" onClick={() => upgrade('enterprise')}>Enterprise</TimisButton>
        </div>
      </div>

      <div className="kiro-card space-y-4">
        <h2 className="font-display text-lg font-semibold text-timis-danger">Danger Zone</h2>
        <p className="text-sm text-timis-muted">Permanently delete this organization and all associated data.</p>
        <TimisButton variant="danger" onClick={deleteOrg}>Delete Organization</TimisButton>
      </div>
    </div>
  );
}
