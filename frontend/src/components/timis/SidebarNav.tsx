'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Building2, Users, Wallet, Wrench, Scale, BarChart3, Star, Settings, ChevronsLeft, ChevronsRight, Bot, Lock } from 'lucide-react';
import { hasFeature, getCurrentPlan, Plan } from '@/lib/plans';

const navItems = [
  { label: 'Dashboard', icon: Home, href: '/dashboard', feature: null },
  { label: 'Properties', icon: Building2, href: '/dashboard/properties', feature: 'properties' },
  { label: 'Tenants', icon: Users, href: '/dashboard/tenants', feature: 'tenants' },
  { label: 'Rent & Payments', icon: Wallet, href: '/dashboard/finance', feature: 'payments' },
  { label: 'Maintenance', icon: Wrench, href: '/dashboard/maintenance', feature: 'maintenance' },
  { label: 'Disputes', icon: Scale, href: '/dashboard/disputes', feature: 'disputes' },
  { label: 'Timis AI', icon: Bot, href: '/dashboard/ai', feature: 'ai' },
  { label: 'Reports', icon: BarChart3, href: '/dashboard/reports', feature: 'reports' },
  { label: 'Timis Scores', icon: Star, href: '/dashboard/scores', feature: 'score' },
  { label: 'Settings', icon: Settings, href: '/dashboard/settings', feature: null },
];

export default function SidebarNav() {
  const [collapsed, setCollapsed] = useState(false);
  const [plan, setPlan] = useState<Plan>('free');
  const pathname = usePathname();

  useEffect(() => { setPlan(getCurrentPlan()); }, [pathname]);

  return (
    <aside className={`hidden md:flex flex-col bg-[#0D2B4E] h-screen sticky top-0 transition-all ${collapsed ? 'w-16' : 'w-60'}`}>
      <div className="p-4 flex items-center justify-center">
        <span className="text-timis-accent font-display font-bold text-xl">{collapsed ? 'T' : 'TIMIS'}</span>
      </div>
      <nav className="flex-1 flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const locked = item.feature !== null && !hasFeature(plan, item.feature);
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          if (locked) {
            return (
              <Link key={item.label} href="/dashboard/settings" title={`Upgrade to unlock ${item.label}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-timis-muted/50 hover:bg-white/5 cursor-pointer">
                <item.icon size={20} />
                {!collapsed && <span className="flex-1">{item.label}</span>}
                {!collapsed && <Lock size={14} />}
              </Link>
            );
          }
          return (
            <Link key={item.label} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${isActive ? 'border-l-4 border-timis-accent bg-white/5 text-white' : 'text-timis-muted hover:bg-white/5 hover:text-white'}`}>
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <button onClick={() => setCollapsed(!collapsed)} className="p-4 text-timis-muted hover:text-white flex justify-center">
        {collapsed ? <ChevronsRight size={20} /> : <ChevronsLeft size={20} />}
      </button>
    </aside>
  );
}
