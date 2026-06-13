'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TimisButton } from '@/components/timis';
import { Plus } from 'lucide-react';

interface Property { id: string; name: string; address: string; city: string; county: string; total_units: number; }

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1'}/properties`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('timis_token') || localStorage.getItem('kiro_token') || ''}` },
    })
      .then((r) => r.ok ? r.json() : [])
      .then(setProperties)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Properties</h1>
        <Link href="/dashboard/properties/new">
          <TimisButton variant="primary" size="sm"><Plus className="w-4 h-4 mr-1.5" />Add Property</TimisButton>
        </Link>
      </div>

      {loading ? (
        <div className="kiro-card h-40 animate-pulse bg-timis-surface dark:bg-timis-dark-surface" />
      ) : properties.length === 0 ? (
        <div className="kiro-card text-center py-12">
          <p className="text-timis-muted">No properties yet — add your first property to get started.</p>
          <Link href="/dashboard/properties/new" className="inline-block mt-4">
            <TimisButton variant="primary">Add Property</TimisButton>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((p) => (
            <div key={p.id} className="kiro-card hover:ring-1 hover:ring-timis-accent/30 transition">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm text-timis-muted mt-1">{p.address}, {p.city}</p>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-timis-muted">{p.county} County</span>
                <span className="font-money text-timis-accent">{p.total_units} units</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
