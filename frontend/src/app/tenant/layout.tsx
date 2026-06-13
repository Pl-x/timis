'use client';
import { ReactNode } from 'react';
import { BottomTabBar } from '@/components/timis';

export default function TenantLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-timis-surface dark:bg-timis-dark-surface pb-20">
      <div className="max-w-lg mx-auto">{children}</div>
      <BottomTabBar />
    </div>
  );
}
