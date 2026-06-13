# TIMIS/TIMIS — System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              INTERNET / CLIENTS                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐    │
│  │  Landlord    │   │   Tenant     │   │   Public     │   │  3rd Party   │    │
│  │  Portal      │   │   Portal     │   │   Landing    │   │  Integrators │    │
│  │  (Next.js)   │   │   (PWA)      │   │   (SSR)      │   │  (API)       │    │
│  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘   └──────┬───────┘    │
│         │                   │                   │                   │            │
└─────────┼───────────────────┼───────────────────┼───────────────────┼────────────┘
          │                   │                   │                   │
          ▼                   ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         NGINX REVERSE PROXY / LOAD BALANCER                      │
│                                                                                 │
│  • TLS 1.3 termination               • Rate limiting (IP + org tenant)          │
│  • Subdomain routing:                 • Brotli/Gzip compression                 │
│    {slug}.timis.co.ke → org context   • WebSocket upgrade (/ws)                  │
│  • Static asset cache (immutable)     • Security headers (CSP, HSTS)            │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
              ┌──────────────────────────┼──────────────────────────┐
              │                          │                          │
              ▼                          ▼                          ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│   GRAPHQL GATEWAY    │  │    REST API SERVER    │  │   WEBSOCKET SERVER   │
│   /graphql           │  │    /api/v1/*          │  │   /ws                │
│                      │  │                       │  │                      │
│  • Primary client    │  │  • M-Pesa callbacks   │  │  • Payment confirms  │
│    interface         │  │  • KRA eTIMS          │  │  • Maintenance       │
│  • JWT auth on all   │  │  • SMS delivery       │  │    status updates    │
│    resolvers         │  │  • Bank webhooks      │  │  • Dispute responses │
│  • Dataloader N+1   │  │  • OpenAPI 3.0 docs   │  │  • Score changes     │
│    prevention        │  │  • HMAC-signed        │  │  • Notifications     │
└──────────┬───────────┘  └──────────┬────────────┘  └──────────┬───────────┘
           │                         │                          │
           └─────────────────────────┼──────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        RUST APPLICATION CORE (Axum)                              │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                    MIDDLEWARE LAYER                                      │    │
│  │  • JWT validation  • Org tenant resolution  • Rate limiting             │    │
│  │  • Request logging • RBAC enforcement       • Input sanitization        │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│  │  mod_auth   │ │ mod_tenant  │ │ mod_lease   │ │ mod_finance │             │
│  │             │ │             │ │             │ │             │             │
│  │ • OAuth 2.0 │ │ • Onboard   │ │ • Units     │ │ • Invoices  │             │
│  │ • JWT issue │ │ • Profile   │ │ • Leases    │ │ • Payments  │             │
│  │ • MFA/OTP  │ │ • Vetting   │ │ • Alerts    │ │ • M-Pesa    │             │
│  │ • RBAC     │ │ • Agreement │ │ • Vacancy   │ │ • Arrears   │             │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘             │
│                                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│  │ mod_score   │ │ mod_dispute │ │mod_maint    │ │ mod_comms   │             │
│  │             │ │             │ │             │ │             │             │
│  │ • Calculate │ │ • Submit    │ │ • Requests  │ │ • Messages  │             │
│  │ • History   │ │ • Timeline  │ │ • Assign    │ │ • Broadcast │             │
│  │ • Share     │ │ • Legal docs│ │ • Vendors   │ │ • SMS (AT)  │             │
│  │ • Benchmark │ │ • Escalate  │ │ • SLA track │ │ • Email     │             │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘             │
│                                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐                              │
│  │ mod_ai      │ │ mod_report  │ │mod_compliance│                             │
│  │             │ │             │ │             │                              │
│  │ • Claude API│ │ • Portfolio │ │ • Audit log │                              │
│  │ • 7 features│ │ • Financial │ │ • Consent   │                              │
│  │ • Context   │ │ • KRA tax   │ │ • Encryption│                              │
│  │   injection │ │ • Export    │ │ • Backups   │                              │
│  └─────────────┘ └─────────────┘ └─────────────┘                              │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                    SHARED SERVICES                                       │    │
│  │  • Event bus (tokio broadcast)   • File upload (presigned → MinIO)      │    │
│  │  • Background scheduler          • PDF generation (printpdf)            │    │
│  │  • Multi-tenancy context         • Encryption service (AES-256-GCM)     │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└────┬──────────────┬──────────────┬──────────────┬──────────────┬────────────────┘
     │              │              │              │              │
     ▼              ▼              ▼              ▼              ▼
┌─────────┐  ┌─────────┐  ┌─────────────┐  ┌─────────┐  ┌─────────────────┐
│PostgreSQL│  │ MongoDB │  │    Redis     │  │RabbitMQ │  │  MinIO (S3)     │
│         │  │         │  │             │  │         │  │                 │
│• Schema │  │• Media  │  │• Sessions   │  │• SMS    │  │• ID documents   │
│  per org│  │  metadata│ │• JWT blackl │  │  queue  │  │• Condition      │
│• All    │  │• Audit  │  │• Rate limit │  │• Email  │  │  photos/video   │
│  modules│  │  logs   │  │  counters   │  │  queue  │  │• Lease PDFs     │
│• RBAC   │  │• Comms  │  │• Timis Score │  │• Report │  │• Evidence       │
│• Indexes│  │  archive│  │  cache      │  │  gen    │  │  uploads        │
│         │  │• Evidence│ │• Pub/sub    │  │• Payment│  │                 │
└─────────┘  └─────────┘  └─────────────┘  └─────────┘  └─────────────────┘

                         EXTERNAL INTEGRATIONS
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐   │
│  │  Safaricom    │  │  Africa's     │  │  Anthropic    │  │  KRA          │   │
│  │  Daraja API   │  │  Talking      │  │  Claude API   │  │  iTax/eTIMS   │   │
│  │  (M-Pesa)     │  │  (SMS/USSD)   │  │  (AI Layer)   │  │  (Tax)        │   │
│  └───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘   │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                      │
│  │  Bank APIs    │  │  WhatsApp     │  │  SendGrid     │                      │
│  │  (Equity/KCB) │  │  Business     │  │  (Email)      │                      │
│  └───────────────┘  └───────────────┘  └───────────────┘                      │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Multi-Tenancy Model (Schema-Based Isolation)

```
┌─────────────────────────────────────────────────────────┐
│                    PostgreSQL Instance                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   public    │  │  org_abc123 │  │  org_def456 │    │
│  │   schema    │  │  schema     │  │  schema     │    │
│  │             │  │             │  │             │    │
│  │ • orgs      │  │ • tenants   │  │ • tenants   │    │
│  │ • users     │  │ • units     │  │ • units     │    │
│  │ • plans     │  │ • leases    │  │ • leases    │    │
│  │ • billing   │  │ • payments  │  │ • payments  │    │
│  │ • global    │  │ • disputes  │  │ • disputes  │    │
│  │   config    │  │ • scores    │  │ • scores    │    │
│  └─────────────┘  └─────────────┘  └─────────────┘    │
│                                                         │
│  Flow:                                                  │
│  1. Nginx: {slug}.timis.co.ke → X-Org-Slug header      │
│  2. Middleware: slug → org_id lookup (Redis cached)    │
│  3. SET search_path TO org_{id}, public;               │
│  4. All queries isolated to org schema                  │
└─────────────────────────────────────────────────────────┘
```

## M-Pesa Payment Flow

```
Tenant Phone              TIMIS Backend                    Safaricom Daraja
     │                         │                               │
     │  1. Tap "Pay Rent"      │                               │
     ├────────────────────────►│                               │
     │                         │  2. POST /mpesa/stkpush       │
     │                         ├──────────────────────────────►│
     │                         │  3. CheckoutRequestID         │
     │                         │◄──────────────────────────────┤
     │  4. STK Push prompt     │                               │
     │◄───────────────────────────────────────────────────────┤
     │                         │                               │
     │  5. Enter PIN           │                               │
     ├────────────────────────────────────────────────────────►│
     │                         │                               │
     │                         │  6. Callback (ResultCode=0)   │
     │                         │◄──────────────────────────────┤
     │                         │                               │
     │                         │  7. Process:                  │
     │                         │     • Verify HMAC signature   │
     │                         │     • Match invoice           │
     │                         │     • Record payment          │
     │                         │     • Update arrears          │
     │                         │     • Recalculate Timis Score  │
     │                         │     • Generate receipt        │
     │                         │     • Queue SMS + push notif  │
     │                         │     • WebSocket broadcast     │
     │                         │                               │
     │  8. "Payment received"  │                               │
     │◄────────────────────────┤                               │
     │  9. SMS receipt         │                               │
     │◄────────────────────────┤                               │
```

## Timis Score Calculation Flow

```
┌──────────────────────────────────────────────────────┐
│              TIMIS SCORE ENGINE (0–850)                │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Input Signals (weighted):                           │
│  ┌────────────────────────────────┬────────┐        │
│  │ Payment punctuality            │  35%   │        │
│  │ Payment completeness           │  25%   │        │
│  │ Tenancy duration               │  15%   │        │
│  │ Dispute history (outcomes)     │  10%   │        │
│  │ Maintenance behavior           │   5%   │        │
│  │ Vacate-notice compliance       │   5%   │        │
│  │ Reference quality              │   5%   │        │
│  └────────────────────────────────┴────────┘        │
│                                                      │
│  Score Bands:                                        │
│  • 750–850: Excellent (top 10%)                     │
│  • 650–749: Good                                     │
│  • 500–649: Fair                                     │
│  • 350–499: Poor                                     │
│  • 0–349:   Very Poor / Insufficient data           │
│                                                      │
│  Recalculation triggers:                            │
│  • Payment received/missed                          │
│  • Dispute resolved                                 │
│  • Lease renewed/terminated                         │
│  • Monthly batch recalc (1st of month)             │
└──────────────────────────────────────────────────────┘
```

## Deployment Topology

```
MVP (Single VPS — Hetzner/DigitalOcean, ~KES 8,000/mo):
┌────────────────────────────────────────┐
│  Ubuntu 22.04 LTS (4 vCPU, 8GB RAM)   │
│                                        │
│  Docker Compose:                       │
│  ├── nginx        (80, 443)           │
│  ├── timis-api     (8080)              │
│  ├── timis-worker  (background tasks)  │
│  ├── postgresql   (5432)              │
│  ├── mongodb      (27017)            │
│  ├── redis        (6379)              │
│  ├── rabbitmq     (5672, 15672)       │
│  └── minio        (9000, 9001)       │
│                                        │
│  Volumes: /data/{pg,mongo,minio,redis} │
│  Backups: Daily encrypted → offsite    │
└────────────────────────────────────────┘

Scale-out path:
• DB → Managed PostgreSQL (Supabase/Neon)
• API → 2+ replicas behind Nginx upstream
• Cache → Redis Sentinel
• Storage → Cloudflare R2 (Nairobi PoP)
• CDN → Cloudflare (free tier covers Kenya)
```

## Technology Decisions

| Decision | Kenya-Market Rationale |
|----------|------------------------|
| Axum over Actix-Web | Tower ecosystem, native async, better GraphQL subscription support |
| Schema-based multi-tenancy | Data Protection Act 2019 compliance; per-org backup/deletion |
| MongoDB for docs/logs | Flexible schema for evidence, comms archive; avoids PG TOAST bloat |
| Redis for score cache | Sub-ms Timis Score lookups; rate limit counters; session store |
| RabbitMQ | Reliable SMS/email delivery; dead-letter for failed M-Pesa callbacks |
| MinIO | Self-hostable S3; no vendor lock-in; stores ID docs, photos, PDFs |
| PWA for tenant portal | Installable on Tecno/Infinix; offline receipts; works on 3G |
| SSR (Next.js) | SEO for public pages; fast TTFB on slow Kenyan mobile connections |
| Africa's Talking over Twilio | Local Kenyan SMS gateway; cheaper; USSD support; KES billing |
