import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing — TIMIS',
  description: 'Simple, transparent pricing for Kenyan landlords. Start free.',
};

const plans = [
  { name: 'Starter', price: 'Free', units: 'Up to 5 units', features: ['M-Pesa collection', 'Basic invoicing', 'SMS receipts', 'Tenant profiles'], popular: false },
  { name: 'Pro', price: 'KES 4,000', period: '/mo', units: 'Up to 100 units', features: ['Everything in Starter', 'Timis Score™', 'AI Legal Assistant', 'Dispute management', 'KRA reports', 'Maintenance tracking', 'Vendor management'], popular: true },
  { name: 'Enterprise', price: 'Custom', units: 'Unlimited', features: ['Everything in Pro', 'Dedicated support', 'Custom integrations', 'White-label option', 'SLA guarantee', 'Priority onboarding'], popular: false },
];

export default function PricingPage() {
  return (
    <div className="dark bg-timis-dark-surface text-white min-h-screen py-20">
      <div className="max-w-5xl mx-auto px-5">
        <h1 className="font-display text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h1>
        <p className="text-center text-timis-muted mb-12 text-lg">All prices in KES. No hidden fees. Cancel anytime.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div key={p.name} className={`rounded-card p-6 relative ${p.popular ? 'bg-timis-primary border-2 border-timis-accent' : 'bg-timis-dark-card border border-white/10'}`}>
              {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-timis-accent text-timis-primary text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>}
              <h3 className="font-display text-xl font-bold">{p.name}</h3>
              <p className="mt-2"><span className="font-money text-3xl font-bold">{p.price}</span>{p.period && <span className="text-timis-muted text-sm">{p.period}</span>}</p>
              <p className="text-sm text-timis-muted mt-1">{p.units}</p>
              <ul className="mt-6 space-y-2">
                {p.features.map((f) => <li key={f} className="text-sm flex items-center gap-2"><span className="text-timis-success">✓</span>{f}</li>)}
              </ul>
              <Link href="/register" className={`mt-6 block text-center py-3 rounded-lg font-semibold transition active:scale-[0.97] ${p.popular ? 'bg-timis-accent text-timis-primary' : 'border border-white/20 hover:bg-white/5'}`}>Get Started</Link>
            </div>
          ))}
        </div>

        <p className="text-center text-timis-muted mt-12 text-sm">All plans include M-Pesa integration and Kenya Data Protection Act compliance.</p>
      </div>
    </div>
  );
}
