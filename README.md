# TIMIS — Tenancy Information Management Integrated System

> Intelligent property management for the Kenyan real estate market.
> M-Pesa rent collection · Tenant credit scoring · AI legal assistance · Dispute resolution.

[![Rust](https://img.shields.io/badge/backend-Rust%20%2B%20Axum-orange)]()
[![Next.js](https://img.shields.io/badge/frontend-Next.js%2014-black)]()
[![License](https://img.shields.io/badge/license-BUSL--1.1-blue)]()

---

## Overview

TIMIS is a multi-tenant SaaS platform that helps Kenyan landlords and property
agencies manage tenants, collect rent via M-Pesa, track maintenance, resolve
disputes, and stay compliant with KRA tax requirements and the Data Protection
Act (2019).

Built for everyone from a single-bedsitter landlord in Nyeri to a 500+ unit
agency in Westlands.

### Key Features

| Feature | Description |
|---------|-------------|
| 💚 **M-Pesa Collection** | STK Push + C2B paybill, auto-reconciliation, instant SMS receipts |
| ⭐ **Timis Score™** | Kenya's first tenant credit score (0–850) based on payment behavior |
| 🤖 **Timis Intelligence™** | Claude/Groq-powered legal assistant, lease analyzer, dispute advisor |
| ⚖️ **Dispute Resolution** | Evidence logging + AI-generated legal docs citing Cap 296 / Cap 301 |
| 🔧 **Maintenance** | Request tracking, vendor (fundi) management, SLA monitoring |
| 📊 **KRA Tax Reports** | Auto-generated monthly rental income tax (2025 Finance Act) |
| 🔐 **Compliance** | Data Protection Act 2019, RBAC, audit logs, encrypted PII |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Rust (Axum), GraphQL (async-graphql) + REST |
| Database | PostgreSQL (Supabase), MongoDB (optional, logs/media) |
| Cache | Redis (Upstash) |
| Frontend | Next.js 14 (App Router), TailwindCSS, Apollo Client |
| Auth | OAuth 2.0 + JWT, Argon2, TOTP MFA |
| AI | Pluggable: Anthropic Claude / Groq / OpenAI / Ollama |
| Payments | Safaricom Daraja API (M-Pesa) |
| SMS | Africa's Talking |
| Storage | Supabase Storage / MinIO |
| Deploy | Docker, Render (backend), Netlify (frontend) |

---

## Project Structure

```
timis/
├── backend/                    # Rust workspace
│   └── crates/
│       ├── timis-api/          # Axum HTTP server (GraphQL + REST)
│       ├── timis-worker/       # Background jobs (lease alerts, invoicing, scoring)
│       ├── timis-core/         # Shared models, config, errors
│       ├── timis-db/           # DB pool, repos, migrations, multi-tenancy
│       ├── timis-auth/         # JWT, password hashing, RBAC
│       ├── timis-mpesa/        # Daraja: STK Push, C2B, B2C, reconciliation
│       ├── timis-ai/           # Claude/LLM client + 7 AI features
│       └── timis-comms/        # SMS (Africa's Talking), email (SendGrid)
├── frontend/                   # Next.js app
│   └── src/
│       ├── app/                # Routes: (public), (auth), dashboard, tenant
│       ├── components/timis/   # Design system (TimisScoreCard, etc.)
│       └── lib/                # plans, session, formatters, apollo
├── api/
│   ├── openapi.yaml            # Webhook-focused OpenAPI 3.0 spec
│   └── swagger.yaml            # Full REST API spec (Swagger UI ready)
├── graphql/schema.graphql      # GraphQL SDL
├── database/schema.sql         # Full PostgreSQL schema (all 10 modules)
├── Dockerfile                  # Backend (api + worker)
├── Dockerfile.frontend         # Frontend (Next.js standalone)
├── render.yaml                 # Render Blueprint (IaC)
└── netlify.toml                # Netlify frontend config
```

---

## Local Development

### Prerequisites
- Rust 1.89+ (`rustup`)
- Node.js 20+
- A PostgreSQL DB (Supabase) and Redis (Upstash) — or run locally

### Backend

```bash
cd backend
cp ../.env.example .env       # fill in DATABASE_URL, REDIS_URL, AI_API_KEY, etc.

# Run API + Worker together
cargo run --bin timis-api & cargo run --bin timis-worker & wait

# Or individually
cargo run --bin timis-api      # → http://localhost:8080
cargo run --bin timis-worker   # background jobs
```

Tables auto-create on first startup (migrations run automatically).

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
npm run dev                         # → http://localhost:3000
```

---

## API Documentation

### Swagger UI (interactive)
When the backend is running, visit:
```
http://localhost:8080/docs        # Swagger UI
http://localhost:8080/openapi.yaml # Raw spec
```

### Or view the spec online
1. Go to [editor.swagger.io](https://editor.swagger.io)
2. File → Import → paste contents of `api/swagger.yaml`

### GraphQL Playground
```
http://localhost:8080/graphql
```

---

## Environment Variables

See `.env.example` for the full list. Key ones:

```bash
DATABASE_URL=postgresql://...supabase.com:5432/postgres?sslmode=require
REDIS_URL=rediss://...upstash.io:6379
JWT_SECRET=<openssl rand -hex 32>

# M-Pesa (Safaricom Daraja)
MPESA_CONSUMER_KEY=...
MPESA_CONSUMER_SECRET=...
MPESA_SHORTCODE=174379

# AI — switch between free (Groq) and paid (Claude)
AI_PROVIDER=groq                  # anthropic | groq | openai | ollama
AI_API_KEY=gsk_...
AI_MODEL=llama-3.1-8b-instant
AI_BASE_URL=https://api.groq.com/openai/v1

# Storage
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
SUPABASE_BUCKET=timis
```

---

## Deployment

### Backend → Render
1. Push to GitHub
2. Render → New → Blueprint → select repo (reads `render.yaml`)
3. Fill in secret env vars (DATABASE_URL, AI_API_KEY, etc.)
4. Deploy

### Frontend → Netlify
1. Connect repo
2. Netlify reads `netlify.toml` (base: `frontend`)
3. Set `NEXT_PUBLIC_API_URL` to your Render backend URL
4. Deploy

---

## Subscription Plans

| Plan | Price | Units | Features |
|------|-------|-------|----------|
| Free | KES 0 | 5 | M-Pesa, invoicing, SMS, tenants |
| Starter | KES 1,500/mo | 30 | + maintenance, reports |
| Pro | KES 4,000/mo | 100 | + Timis Score, AI, disputes, KRA |
| Enterprise | Custom | ∞ | + dedicated support, white-label |

---

## License

BUSL-1.1 — Business Source License. See [LICENSE](LICENSE).

---

Built for the Kenyan market 🇰🇪
