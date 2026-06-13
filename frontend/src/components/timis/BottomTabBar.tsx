'use client';

import { Home, Wallet, Wrench, Scale, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const tabs = [
  { label: 'Home', icon: Home, href: '/tenant' },
  { label: 'Pay Rent', icon: Wallet, href: '/tenant/pay' },
  { label: 'Maintenance', icon: Wrench, href: '/tenant/maintenance' },
  { label: 'Disputes', icon: Scale, href: '/tenant/disputes' },
  { label: 'Profile', icon: User, href: '/tenant/settings' },
];

export default function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 md:hidden bg-[#0D2B4E] min-h-[64px] flex items-center justify-around pb-[env(safe-area-inset-bottom)] z-50">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || (tab.href !== '/tenant' && pathname.startsWith(tab.href));
        return (
          <Link key={tab.label} href={tab.href} className={`flex flex-col items-center gap-0.5 min-w-[48px] min-h-[44px] justify-center ${isActive ? 'text-timis-accent' : 'text-timis-muted'}`}>
            <tab.icon size={24} />
            <span className="text-[11px]">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
