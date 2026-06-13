'use client';
import { useState, useEffect } from 'react';
import { StatCard, ActivityFeedItem } from '@/components/timis';
import { Home, Wallet, Wrench, Scale } from 'lucide-react';

interface DashboardData {
  stats: { occupied: string; collected: string; maintenance: string; disputes: string };
  properties: { name: string; paid: number; total: number }[];
  expiringLeases: { tenant: string; unit: string; days: number }[];
  activities: { type: 'payment' | 'maintenance' | 'dispute' | 'lease'; message: string; timestamp: string }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // Try to load from API
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/dashboard/overview`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('timis_token') || ''}` },
        });
        if (res.ok) {
          setData(await res.json());
        } else {
          // Fallback: load from DB via GraphQL or show empty state
          setData(null);
        }
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Show empty state when no data
  const stats = data?.stats || { occupied: '0 / 0', collected: 'KES 0', maintenance: '0', disputes: '0' };
  const properties = data?.properties || [];
  const expiringLeases = data?.expiringLeases || [];
  const activities = data?.activities || [];

  const statCards = [
    { icon: <Home className="w-5 h-5" />, label: 'Units Occupied', value: stats.occupied },
    { icon: <Wallet className="w-5 h-5" />, label: 'Rent Collected', value: stats.collected },
    { icon: <Wrench className="w-5 h-5" />, label: 'Pending Maintenance', value: stats.maintenance },
    { icon: <Scale className="w-5 h-5" />, label: 'Active Disputes', value: stats.disputes },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="timis-card h-28 animate-pulse bg-timis-surface dark:bg-timis-dark-surface" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-stagger">
        {statCards.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Two Column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rent Progress */}
        <div className="timis-card">
          <h2 className="font-display text-lg font-semibold mb-4">Rent Collection</h2>
          {properties.length === 0 ? (
            <p className="text-sm text-timis-muted">No properties yet. Add a property to start tracking rent collection.</p>
          ) : (
            <div className="space-y-4">
              {properties.map((p) => (
                <div key={p.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{p.name}</span>
                    <span className="font-money text-timis-muted">{p.paid}/{p.total} units paid</span>
                  </div>
                  <div className="h-2 rounded-full bg-timis-surface dark:bg-timis-dark-surface overflow-hidden">
                    <div className="h-full rounded-full bg-timis-success transition-all" style={{ width: `${p.total > 0 ? (p.paid / p.total) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Expiring Leases */}
        <div className="timis-card">
          <h2 className="font-display text-lg font-semibold mb-4">Expiring Leases</h2>
          {expiringLeases.length === 0 ? (
            <p className="text-sm text-timis-muted">No leases expiring in the next 30 days.</p>
          ) : (
            <div className="space-y-3">
              {expiringLeases.map((l) => (
                <div key={l.unit} className="flex items-center justify-between py-2 border-b border-timis-border dark:border-timis-dark-border last:border-0">
                  <div>
                    <p className="font-medium text-sm">{l.tenant}</p>
                    <p className="text-xs text-timis-muted">{l.unit}</p>
                  </div>
                  <span className={`font-money text-xs px-2 py-1 rounded-full font-medium ${l.days <= 7 ? 'bg-timis-danger/10 text-timis-danger' : l.days <= 30 ? 'bg-timis-warning/10 text-timis-warning' : 'bg-timis-success/10 text-timis-success'}`}>
                    {l.days} days
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="timis-card">
        <h2 className="font-display text-lg font-semibold mb-4">Recent Activity</h2>
        {activities.length === 0 ? (
          <p className="text-sm text-timis-muted">No activity yet. Events will appear here as you manage properties.</p>
        ) : (
          <div className="space-y-1">
            {activities.map((a, i) => <ActivityFeedItem key={i} {...a} />)}
          </div>
        )}
      </div>
    </div>
  );
}
