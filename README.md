# TIMIS

**Tenancy Information Management Integrated System** — property management for the Kenyan market.

M-Pesa rent collection · Tenant credit scoring · AI assistance · Dispute resolution.

---

## Tech Stack

- **Backend:** Rust (Axum) — GraphQL + REST
- **Frontend:** Next.js 14, TailwindCSS
- **Database:** PostgreSQL, Redis
- **Payments:** M-Pesa (Safaricom Daraja)

## Getting Started

```bash
# Backend
cd backend
cp .env.example .env    # configure your environment
cargo run --bin timis-api

# Frontend
cd frontend
npm install
npm run dev
```

See `.env.example` for required configuration.

## License

BUSL-1.1 — see [LICENSE](LICENSE).

---

Built for the Kenyan market 🇰🇪
