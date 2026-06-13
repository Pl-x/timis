'use client';
import { TimisScoreCard, TimisButton } from '@/components/timis';
import { Wrench, Scale, FileText, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const quickActions = [
  { icon: <Wrench className="w-6 h-6" />, label: 'Request Maintenance', href: '/tenant/maintenance/new' },
  { icon: <Scale className="w-6 h-6" />, label: 'Log Dispute', href: '/tenant/disputes/new' },
  { icon: <FileText className="w-6 h-6" />, label: 'View Lease', href: '/tenant/lease' },
  { icon: <MessageCircle className="w-6 h-6" />, label: 'Contact Landlord', href: '/tenant/messages' },
];

export default function TenantHome() {
  return (
    <div>
      {/* Top Dark Section */}
      <div className="bg-timis-primary dark:bg-timis-dark-surface rounded-b-3xl px-5 pt-8 pb-10">
        <p className="font-display text-xl text-white font-semibold">Habari, James 👋</p>
        <p className="text-timis-muted text-sm mt-1">Unit 3A, Greenview Apartments, Nyeri</p>
        <div className="flex justify-center mt-6">
          <TimisScoreCard score={742} size="full" animated />
        </div>
        <Link href="/tenant/score" className="block text-center text-timis-accent text-sm font-medium mt-3 hover:underline">
          View score breakdown →
        </Link>
      </div>

      {/* Balance Card */}
      <div className="px-5 -mt-4">
        <div className="timis-card">
          <p className="text-xs uppercase tracking-wider text-timis-muted font-medium">Current Balance</p>
          <p className="font-money text-3xl font-bold text-timis-warning mt-1">KES 18,500</p>
          <p className="text-sm text-timis-muted mt-1">Due 1st July 2026</p>
          <div className="mt-4">
            <TimisButton variant="primary" size="lg" className="w-full">Pay with M-Pesa</TimisButton>
          </div>
          {/* Recent receipts */}
          <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {['Jun', 'May', 'Apr'].map((m) => (
              <div key={m} className="flex-shrink-0 px-4 py-2 rounded-lg bg-timis-surface dark:bg-timis-dark-surface text-xs">
                <p className="font-money font-medium">KES 18,500</p>
                <p className="text-timis-muted">{m} 2026</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mt-6 grid grid-cols-2 gap-3">
        {quickActions.map((a) => (
          <Link key={a.label} href={a.href} className="timis-card flex flex-col items-center justify-center py-5 gap-2 hover:ring-1 hover:ring-timis-accent transition min-h-[100px]">
            <span className="text-timis-accent">{a.icon}</span>
            <span className="text-xs font-medium text-center">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
