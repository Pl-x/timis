# TIMIS Platform — MVP Scope & Roadmap

## MVP Target: Ship by December 2025

### Guiding Principle

Ship the smallest version that delivers value a Kenyan landlord will pay for,
while laying the architectural foundation for full platform expansion.

**MVP user archetype**: A landlord in Nyeri with 8–30 units, currently using
a spreadsheet and WhatsApp, losing KES 15,000–50,000/month to late payments
and poor tracking.

---

## Phase 1: MVP (July–December 2025)

### What Ships

| Module | MVP Scope | What's Excluded |
|--------|-----------|-----------------|
| **Tenant Onboarding** | Basic profile (name, phone, ID), unit assignment, document upload | Automated vetting workflow, reference automation |
| **Lease Management** | Property → Building → Unit hierarchy, active lease tracking, basic expiry alerts (30/7 days) | Rent review scheduling, floor plans, condition logging |
| **Rent Collection** | M-Pesa STK Push + C2B paybill, automated invoice generation, receipt (SMS + PDF), arrears tracking | Bank transfers, payment plans, utility split-billing |
| **Timis Score** | Basic score (payment punctuality + completeness only, 0–850), visible to tenant and landlord | Full 7-factor model, benchmarking, portable sharing |
| **Communications** | SMS notifications (Africa's Talking): payment reminders, receipts, lease alerts | In-app messaging, broadcast, WhatsApp, email |
| **Reporting** | Basic dashboard: occupancy, rent collected vs expected, arrears list | Full P&L, KRA reports, custom exports |
| **Auth & Multi-tenancy** | JWT auth, 3 roles (LandlordAdmin, PropertyManager, Tenant), schema-per-org | MFA, Accountant/Maintenance roles, SSO |
| **Frontend** | Landlord dashboard (web), Tenant portal (mobile PWA — pay rent + view receipts) | Public landing page, dark mode, Swahili |

### What's NOT in MVP

- AI/Claude integration (all 7 features)
- Dispute management system
- Maintenance & vendor management
- Full financial engine (chart of accounts, bank reconciliation, payouts)
- KRA eTIMS integration
- WhatsApp integration
- Public landing page / SEO
- Landlord scoring
- Multi-currency

### MVP Success Metrics

| Metric | Target (by March 2026) |
|--------|------------------------|
| Landlords onboarded | 50 |
| Units managed | 500 |
| Monthly M-Pesa transactions processed | 400+ |
| Collection rate improvement | >15% for active landlords |
| Monthly recurring revenue | KES 75,000 |

### MVP Timeline

```
July 2025:     Backend core (auth, DB, multi-tenancy, basic CRUD)
August 2025:   M-Pesa integration (STK Push + C2B) — Daraja sandbox → production
September 2025: Invoice generation, SMS notifications, arrears tracking
October 2025:  Frontend — Landlord dashboard + Tenant PWA
November 2025: Timis Score v1 (2-factor: punctuality + completeness)
December 2025: Beta launch (10 landlords in Nairobi/Nyeri), iterate on feedback
```

### MVP Pricing

| Plan | Units | Price | Revenue Target |
|------|-------|-------|----------------|
| Free | 1–5 | KES 0 | Lead generation |
| Starter | 6–30 | KES 1,500/mo | Main revenue |
| Pro | 31–100 | KES 4,000/mo | Growth segment |

---

## Phase 2: Post-MVP (Q1–Q2 2026)

### Priority 1: Revenue & Retention

| Feature | Why Now |
|---------|---------|
| **Full Timis Score** (7 factors + history + sharing) | Competitive moat; tenant stickiness |
| **Maintenance module** | #1 requested feature after payments (landlord feedback expected) |
| **In-app messaging** | Reduce WhatsApp dependency; creates audit trail |
| **KRA rental income reports** | 2025 Finance Act compliance pressure; landlords need this monthly |
| **Utility billing** (water, electricity) | Directly increases revenue captured per unit |

### Priority 2: Differentiation

| Feature | Why Now |
|---------|---------|
| **AI — Legal Assistant** | First-to-market in Kenya; drives organic traffic |
| **AI — Score Explainer** | Immediate value for engaged tenants |
| **Dispute logging** (basic) | Immutable log creation; not full resolution yet |
| **Public landing page** (SEO) | Start capturing "property management Kenya" traffic |
| **Bank transfer support** | Enterprise landlords demand it |

### Priority 3: Scale (Q3 2026+)

| Feature | Why |
|---------|-----|
| **Full dispute resolution** + legal doc generation | Deep differentiation |
| **AI — Lease Analyzer** | Premium feature for Pro/Enterprise plans |
| **AI — Vacancy Copy** | Upsell for landlords with multiple vacancies |
| **AI — Anomaly Detection** | Enterprise value |
| **AI — Renewal Briefing** | Premium automation |
| **WhatsApp integration** | Mass market reach |
| **Landlord payouts** (B2C) | Full financial loop |
| **Chart of accounts + P&L** | Accountant role; enterprise |
| **eTIMS integration** | Regulatory compliance |
| **Portable Timis Score** | Network effect; tenant acquisition |
| **Mobile app** (React Native or Expo) | If PWA proves insufficient |

---

## Technical Debt & Foundation Work (Ongoing)

| Item | Priority | When |
|------|----------|------|
| CI/CD pipeline (GitHub Actions) | High | Month 1 |
| `cargo audit` + `npm audit` in CI | High | Month 1 |
| Integration tests (M-Pesa mock, DB) | High | Months 1–2 |
| Monitoring (Prometheus + Grafana) | Medium | Month 3 |
| CDN (Cloudflare — Nairobi PoP) | Medium | At launch |
| Load testing (50 concurrent landlords) | Medium | Month 4 |
| Backup/restore drill | High | Monthly from launch |
| Security pentest | High | Pre-launch (Nov 2025) |

---

## Go-To-Market Strategy

### MVP Launch (December 2025)

1. **Pilot**: 10 landlords in Nairobi (Westlands, Kilimani) + 5 in Nyeri
2. **Channel**: Direct outreach via property management WhatsApp groups
3. **Pitch**: "Never chase rent again. M-Pesa auto-collection + instant receipts."
4. **Pricing**: Free for first 3 months, then Starter plan
5. **Feedback loop**: Weekly calls with pilot landlords; NPS tracking

### Growth (Q1 2026)

1. **SEO**: Public landing page targeting "M-Pesa rent collection software Kenya"
2. **Content**: Blog posts on "2025 Finance Act rental income tax guide"
3. **Referral**: Landlord refers landlord → 1 month free
4. **Partnerships**: Estate agents, property valuers, legal firms

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Safaricom Daraja onboarding delays | High | High | Start application in July; have sandbox ready; backup: manual bank reconciliation |
| Low landlord adoption (spreadsheet inertia) | Medium | High | Free tier; emphasize "5 minutes to set up"; SMS-first (no app required for tenants) |
| M-Pesa callback reliability | Medium | Medium | Transaction query fallback; daily reconciliation job |
| Competitor launches similar features | Low | Medium | Speed to market; Timis Score as unique moat; deep Kenya compliance |
| Data Protection Commissioner audit | Low | High | KDPA compliance baked in from day 1; DPO assigned; consent records |
| Server costs exceed revenue | Medium | Medium | Start single VPS (KES 8k/mo); 15 Starter plans cover costs |

---

## Decision Log

| Decision | Rationale | Reversible? |
|----------|-----------|-------------|
| Axum over Actix-Web | Better Tower/async-graphql integration; subscription support | Yes (same Rust ecosystem) |
| Schema-per-org over row-level isolation | Stronger KDPA compliance; easier per-org backup; cleaner mental model | Hard to reverse (migration) |
| Africa's Talking over Twilio | 3x cheaper in Kenya; local support; USSD future capability | Easy to swap |
| M-Pesa first, bank later | 80%+ of target users prefer M-Pesa; faster to integrate | N/A (additive) |
| PWA over native app for MVP | Faster to ship; works on low-end Android; no app store gatekeeping | Can add native later |
| Timis Score in MVP (simplified) | Early data collection creates moat over time; even 2 factors useful | N/A |
| Skip AI for MVP | Complex to get right; not needed for core payment value prop; ship faster | Added in Phase 2 |
