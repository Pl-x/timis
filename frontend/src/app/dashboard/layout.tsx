'use client';
import { ReactNode, useState, useEffect, useRef } from 'react';
import { SidebarNav } from '@/components/timis';
import AIChatWidget from '@/components/timis/AIChatWidget';
import UpgradeModal from '@/components/timis/UpgradeModal';
import { Search, Bell, Sun, Moon, LogOut, User, Settings, CreditCard, HelpCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { getSession, getInitials, clearSession, SessionUser } from '@/lib/session';
import { getCurrentPlan, hasFeature, Plan } from '@/lib/plans';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [plan, setPlan] = useState<Plan>('free');
  const [showUpgrade, setShowUpgrade] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = getSession();
    setUser(s);
    setPlan(getCurrentPlan());
    // Show upgrade modal once after signup (read from URL without useSearchParams)
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('welcome') === '1') {
      setShowUpgrade(true);
    }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const notifications = [
    { id: 1, msg: 'Welcome to TIMIS! Add your first property to get started.', time: 'just now', type: 'lease' },
  ];

  const handleLogout = () => { clearSession(); router.push('/login'); };
  const initials = getInitials(user);
  const fullName = user ? `${user.first_name} ${user.last_name}` : 'User';

  return (
    <div className="flex min-h-screen bg-timis-surface dark:bg-timis-dark-surface transition-colors">
      <SidebarNav />
      <div className="flex-1 flex flex-col md:ml-[240px]">
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 h-16 border-b border-timis-border dark:border-timis-dark-border bg-timis-card/80 dark:bg-timis-dark-card/80 backdrop-blur-md">
          <div className="relative hidden md:block w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-timis-muted" />
            <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-timis-surface dark:bg-timis-dark-surface text-sm border border-timis-border dark:border-timis-dark-border focus:outline-none focus:ring-2 focus:ring-timis-accent" />
          </div>
          <div className="flex items-center gap-3">
            {/* Plan badge */}
            <span className="hidden sm:inline-block text-xs px-2 py-1 rounded-full bg-timis-accent/10 text-timis-accent font-medium uppercase">{plan}</span>

            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-lg hover:bg-timis-surface dark:hover:bg-white/5 transition">
              {theme === 'dark' ? <Sun className="w-5 h-5 text-timis-accent" /> : <Moon className="w-5 h-5 text-timis-muted" />}
            </button>

            <div className="relative" ref={notifRef}>
              <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }} className="relative p-2 rounded-lg hover:bg-timis-surface dark:hover:bg-white/5 transition">
                <Bell className="w-5 h-5 text-timis-muted" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-timis-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center">{notifications.length}</span>
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 rounded-xl p-4 border border-timis-border dark:border-timis-dark-border shadow-xl bg-timis-card dark:bg-timis-dark-card z-50">
                  <p className="font-semibold text-sm mb-3">Notifications</p>
                  {notifications.map((n) => (
                    <div key={n.id} className="flex gap-2 items-start py-2"><div className="w-2 h-2 rounded-full mt-1.5 bg-timis-accent flex-shrink-0" /><div><p className="text-sm">{n.msg}</p><p className="text-xs text-timis-muted">{n.time}</p></div></div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative" ref={profileRef}>
              <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }} className="flex items-center gap-2 p-1 rounded-lg hover:bg-timis-surface dark:hover:bg-white/5 transition">
                <div className="w-9 h-9 rounded-full bg-timis-primary dark:bg-timis-accent/20 flex items-center justify-center text-sm font-semibold text-white dark:text-timis-accent">{initials}</div>
                <span className="hidden md:block text-sm font-medium">{user?.first_name || ''}</span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-12 w-56 rounded-xl p-4 border border-timis-border dark:border-timis-dark-border shadow-xl bg-timis-card dark:bg-timis-dark-card z-50">
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-timis-border dark:border-timis-dark-border">
                    <div className="w-10 h-10 rounded-full bg-timis-primary dark:bg-timis-accent/20 flex items-center justify-center text-sm font-semibold text-white dark:text-timis-accent">{initials}</div>
                    <div>
                      <p className="text-sm font-semibold">{fullName}</p>
                      <p className="text-xs text-timis-muted">{user?.email || ''}</p>
                    </div>
                  </div>
                  <button onClick={() => { setProfileOpen(false); router.push('/dashboard/settings'); }} className="w-full flex items-center gap-2 text-sm py-2 px-2 rounded-lg hover:bg-timis-surface dark:hover:bg-white/5 transition"><User className="w-4 h-4 text-timis-muted" /> My Profile</button>
                  <button onClick={() => { setProfileOpen(false); router.push('/dashboard/settings'); }} className="w-full flex items-center gap-2 text-sm py-2 px-2 rounded-lg hover:bg-timis-surface dark:hover:bg-white/5 transition"><Settings className="w-4 h-4 text-timis-muted" /> Settings</button>
                  <button onClick={() => { setProfileOpen(false); setShowUpgrade(true); }} className="w-full flex items-center gap-2 text-sm py-2 px-2 rounded-lg hover:bg-timis-surface dark:hover:bg-white/5 transition"><CreditCard className="w-4 h-4 text-timis-muted" /> Billing & Plan</button>
                  <div className="mt-3 pt-3 border-t border-timis-border dark:border-timis-dark-border">
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 text-sm py-2 px-2 rounded-lg text-timis-danger hover:bg-timis-danger/10 transition"><LogOut className="w-4 h-4" /> Sign Out</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>

      {/* AI widget only if plan has AI */}
      {hasFeature(plan, 'ai') && <AIChatWidget />}

      {/* Post-signup / billing upgrade modal */}
      {showUpgrade && user && (
        <UpgradeModal
          currentPlan={plan}
          orgId={user.org_id}
          onClose={() => setShowUpgrade(false)}
          onUpgraded={(newPlan) => { setPlan(newPlan); setShowUpgrade(false); }}
        />
      )}
    </div>
  );
}
