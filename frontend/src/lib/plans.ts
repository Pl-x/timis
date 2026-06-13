// TIMIS subscription plans and feature gating

export type Plan = 'free' | 'starter' | 'pro' | 'enterprise';

export interface PlanConfig {
  id: Plan;
  name: string;
  priceKes: number;
  priceLabel: string;
  maxUnits: number;
  features: string[];   // feature keys this plan unlocks
  highlights: string[]; // human-readable for display
}

// Feature keys used for gating
export const FEATURES = {
  PAYMENTS: 'payments',
  INVOICING: 'invoicing',
  SMS: 'sms',
  TENANTS: 'tenants',
  PROPERTIES: 'properties',
  SCORE: 'score',
  AI: 'ai',
  DISPUTES: 'disputes',
  MAINTENANCE: 'maintenance',
  KRA_REPORTS: 'kra_reports',
  REPORTS: 'reports',
} as const;

export const PLANS: Record<Plan, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Free',
    priceKes: 0,
    priceLabel: 'Free',
    maxUnits: 5,
    features: ['payments', 'invoicing', 'sms', 'tenants', 'properties'],
    highlights: ['Up to 5 units', 'M-Pesa rent collection', 'Basic invoicing', 'SMS receipts', 'Tenant profiles'],
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    priceKes: 1500,
    priceLabel: 'KES 1,500/mo',
    maxUnits: 30,
    features: ['payments', 'invoicing', 'sms', 'tenants', 'properties', 'maintenance', 'reports'],
    highlights: ['6–30 units', 'Everything in Free', 'Maintenance tracking', 'Basic reports'],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceKes: 4000,
    priceLabel: 'KES 4,000/mo',
    maxUnits: 100,
    features: ['payments', 'invoicing', 'sms', 'tenants', 'properties', 'maintenance', 'reports', 'score', 'ai', 'disputes', 'kra_reports'],
    highlights: ['31–100 units', 'Everything in Starter', 'Timis Score™', 'AI Legal Assistant', 'Dispute management', 'KRA tax reports'],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    priceKes: 0,
    priceLabel: 'Custom',
    maxUnits: 100000,
    features: ['payments', 'invoicing', 'sms', 'tenants', 'properties', 'maintenance', 'reports', 'score', 'ai', 'disputes', 'kra_reports'],
    highlights: ['Unlimited units', 'Everything in Pro', 'Dedicated support', 'Custom integrations', 'White-label'],
  },
};

export function hasFeature(plan: Plan, feature: string): boolean {
  return PLANS[plan]?.features.includes(feature) ?? false;
}

export function getCurrentPlan(): Plan {
  if (typeof window === 'undefined') return 'free';
  return (localStorage.getItem('timis_plan') as Plan) || 'free';
}
