import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'TIMIS — Manage Every Tenant. Collect Every Shilling.',
  description: 'M-Pesa rent collection, tenant credit scoring, AI-powered lease management, and dispute resolution — built for the Kenyan real estate market.',
  keywords: ['property management software Kenya', 'tenant management system Nairobi', 'M-Pesa rent collection', 'landlord software Kenya', 'rental management'],
};

const features = [
  { title: 'M-Pesa Rent Collection', desc: 'Collect rent via STK Push. Automatic reconciliation. Instant SMS receipts. No more chasing tenants.', badge: 'Core' },
  { title: 'Timis Score™', desc: "Kenya's first tenant credit system. Rate tenants 0–850 based on payment history, disputes, and tenancy behavior.", badge: 'Exclusive' },
  { title: 'Dispute Resolution', desc: 'Log disputes with evidence. AI generates demand letters and eviction notices citing Cap 296 and Cap 301.', badge: 'AI-Powered' },
  { title: 'Smart Lease Analysis', desc: 'Upload any tenancy agreement. Get clause-by-clause risk analysis. Flag illegal terms automatically.', badge: 'AI-Powered' },
  { title: 'KRA Tax Reports', desc: 'Monthly rental income tax reports auto-generated. 2025 Finance Act tiered rates. One-click iTax filing.', badge: 'Compliance' },
];

const pricing = [
  { name: 'Starter', price: 'Free', units: 'Up to 5 units', features: ['M-Pesa collection', 'Basic invoicing', 'SMS receipts', 'Tenant profiles'], popular: false },
  { name: 'Pro', price: 'KES 4,000', period: '/mo', units: 'Up to 100 units', features: ['Everything in Starter', 'Timis Score™', 'AI Legal Assistant', 'Dispute management', 'KRA reports', 'Maintenance tracking'], popular: true },
  { name: 'Enterprise', price: 'Custom', units: 'Unlimited', features: ['Everything in Pro', 'Dedicated support', 'Custom integrations', 'White-label option', 'SLA guarantee'], popular: false },
];

export default function LandingPage() {
  return (
    <div className="dark bg-timis-dark-surface text-white">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Abstract building pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 80px, rgba(245,166,35,0.1) 80px, rgba(245,166,35,0.1) 82px), repeating-linear-gradient(0deg, transparent, transparent 120px, rgba(245,166,35,0.05) 120px, rgba(245,166,35,0.05) 122px)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-64 opacity-10" style={{ background: 'linear-gradient(to top, rgba(13,43,78,0.8), transparent), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 100\'%3E%3Crect x=\'20\' y=\'30\' width=\'40\' height=\'70\' fill=\'%23F5A623\' opacity=\'0.3\'/%3E%3Crect x=\'80\' y=\'10\' width=\'50\' height=\'90\' fill=\'%23F5A623\' opacity=\'0.2\'/%3E%3Crect x=\'150\' y=\'40\' width=\'35\' height=\'60\' fill=\'%23F5A623\' opacity=\'0.25\'/%3E%3Crect x=\'210\' y=\'20\' width=\'60\' height=\'80\' fill=\'%23F5A623\' opacity=\'0.15\'/%3E%3Crect x=\'290\' y=\'35\' width=\'45\' height=\'65\' fill=\'%23F5A623\' opacity=\'0.2\'/%3E%3Crect x=\'350\' y=\'50\' width=\'30\' height=\'50\' fill=\'%23F5A623\' opacity=\'0.3\'/%3E%3C/svg%3E") repeat-x bottom' }} />

        <div className="relative max-w-7xl mx-auto px-5 md:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-display leading-tight">Manage Every Tenant.<br /><span className="text-timis-accent">Collect Every Shilling.</span></h1>
            <p className="mt-6 text-lg text-gray-300 max-w-lg">TIMIS brings M-Pesa rent collection, lease management, tenant credit scoring, and dispute resolution into one platform — built for Kenya.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register" className="inline-flex items-center px-6 py-3 rounded-lg bg-timis-accent text-timis-primary font-semibold hover:bg-timis-accent/90 transition active:scale-[0.97]">Start Free — Up to 5 Units</Link>
              <Link href="#features" className="inline-flex items-center px-6 py-3 rounded-lg border border-white/30 text-white font-medium hover:bg-white/5 transition">See It in Action →</Link>
            </div>
          </div>
          {/* Score Card Mockup */}
          <div className="hidden md:flex justify-center">
            <div className="relative">
              <div className="bg-timis-dark-card rounded-2xl p-8 shadow-2xl rotate-2 border border-white/5">
                <svg width="180" height="180" viewBox="0 0 100 100" className="-rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#F5A623" strokeWidth="8" strokeDasharray={`${(742/850)*264} 264`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center rotate-[-2deg]">
                    <p className="font-mono text-4xl font-bold text-timis-accent">742</p>
                    <p className="text-xs text-timis-muted mt-1">Good Standing</p>
                  </div>
                </div>
              </div>
              {/* Receipt overlay */}
              <div className="absolute -bottom-4 -left-8 bg-timis-success/90 text-white px-4 py-2 rounded-lg text-xs font-medium shadow-lg -rotate-3">✓ KES 25,000 received</div>
              {/* Lease alert */}
              <div className="absolute -top-3 -right-6 bg-timis-warning/90 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg rotate-3">⏰ Lease expires in 7 days</div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-8 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-5 flex flex-wrap items-center justify-center gap-3">
          <span className="text-sm text-timis-muted">Trusted by landlords across</span>
          {['Nairobi', 'Mombasa', 'Nyeri', 'Kisumu', 'Nakuru'].map((c) => (
            <span key={c} className="px-3 py-1 rounded-full border border-white/20 text-xs text-white/80">{c}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-5 md:px-8">
        <h2 className="font-display text-3xl font-bold text-center mb-16">Everything a Kenyan Landlord Needs</h2>
        <div className="space-y-16">
          {features.map((f, i) => (
            <div key={f.title} className={`flex flex-col ${i % 2 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 items-center`}>
              <div className="flex-1">
                <span className="text-xs font-medium text-timis-accent uppercase tracking-wider">{f.badge}</span>
                <h3 className="font-display text-2xl font-bold mt-2">{f.title}</h3>
                <p className="text-gray-400 mt-3 text-lg leading-relaxed">{f.desc}</p>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="w-full max-w-sm h-48 rounded-card bg-timis-dark-card border border-white/5 p-6 flex flex-col justify-between">
                  <span className="text-xs text-timis-accent uppercase tracking-wider font-medium">{f.badge}</span>
                  <div>
                    <p className="font-money text-2xl font-bold text-white">{i === 0 ? 'KES 1,247,500' : i === 1 ? '742' : i === 2 ? '3 Active' : i === 3 ? '12 Clauses' : 'KES 48,200'}</p>
                    <p className="text-timis-muted text-sm mt-1">{i === 0 ? 'Collected this month' : i === 1 ? 'Timis Score — Good Standing' : i === 2 ? 'Disputes tracked' : i === 3 ? 'Analyzed in 4 seconds' : 'Tax payable this month'}</p>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-timis-accent" style={{ width: `${[87, 87, 40, 92, 100][i]}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-timis-primary/30">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <h2 className="font-display text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-center text-timis-muted mb-12">All prices in KES. No hidden fees. Cancel anytime.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {pricing.map((p) => (
              <div key={p.name} className={`rounded-card p-6 ${p.popular ? 'bg-timis-primary border-2 border-timis-accent ring-1 ring-timis-accent/20' : 'bg-timis-dark-card border border-white/5'} relative`}>
                {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-timis-accent text-timis-primary text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>}
                <h3 className="font-display text-xl font-bold">{p.name}</h3>
                <p className="mt-2"><span className="font-money text-3xl font-bold">{p.price}</span>{p.period && <span className="text-timis-muted text-sm">{p.period}</span>}</p>
                <p className="text-sm text-timis-muted mt-1">{p.units}</p>
                <ul className="mt-6 space-y-2">
                  {p.features.map((feat) => <li key={feat} className="text-sm flex items-center gap-2"><span className="text-timis-success">✓</span>{feat}</li>)}
                </ul>
                <Link href="/register" className={`mt-6 block text-center py-3 rounded-lg font-semibold transition active:scale-[0.97] ${p.popular ? 'bg-timis-accent text-timis-primary' : 'border border-white/20 hover:bg-white/5'}`}>Get Started</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="font-display text-xl font-bold text-timis-accent">TIMIS</p>
            <p className="text-sm text-timis-muted mt-1">Built for the Kenyan market 🇰🇪 · Nairobi, Kenya</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-timis-muted">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Data Protection Act Compliance</a>
            <a href="#" className="hover:text-white transition">Contact</a>
            <a href="#" className="hover:text-white transition">API Docs</a>
          </div>
        </div>
        <p className="text-center text-xs text-timis-muted mt-8">© 2026 TIMIS PropTech Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}
