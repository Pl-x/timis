'use client';
import { useState } from 'react';
import {
  HomeIcon,
  BuildingOfficeIcon,
  CubeIcon,
  UsersIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', icon: HomeIcon },
  { name: 'Properties', icon: BuildingOfficeIcon },
  { name: 'Units', icon: CubeIcon },
  { name: 'Tenants', icon: UsersIcon },
  { name: 'Leases', icon: DocumentTextIcon },
  { name: 'Finance', icon: BanknotesIcon },
  { name: 'Disputes', icon: ExclamationTriangleIcon },
  { name: 'Maintenance', icon: WrenchScrewdriverIcon },
  { name: 'Communications', icon: ChatBubbleLeftRightIcon },
  { name: 'AI', icon: SparklesIcon },
  { name: 'Reports', icon: ChartBarIcon },
  { name: 'Settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden md:flex flex-col h-screen transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}
      style={{ backgroundColor: '#1E3A5F' }}
    >
      <div className="flex items-center justify-between p-4 text-white">
        {!collapsed && <span className="font-bold text-lg">Timis</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded hover:bg-white/10">
          {collapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {navItems.map(({ name, icon: Icon }) => (
          <a
            key={name}
            href={`/${name.toLowerCase()}`}
            className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span className="text-sm">{name}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );
}
