# TIMIS Platform — Security Threat Model

## 1. Overview

This document covers the security architecture, threat model, and compliance posture for the TIMIS property management platform operating in the Kenyan market.

**Regulatory Framework:**
- Kenya Data Protection Act, 2019 (KDPA)
- GDPR (for diaspora landlords with EU exposure)
- CBK Guidelines (financial data handling)
- Safaricom Daraja security requirements

---

## 2. OWASP Top 10 Coverage

### A01:2021 — Broken Access Control

| Threat | Mitigation | Status |
|--------|-----------|--------|
| Tenant accessing another tenant's data | Schema-based multi-tenancy (physical isolation per org) | ✅ Implemented |
| Horizontal privilege escalation | JWT contains org_id + role; every query scoped to org schema | ✅ Implemented |
| Vertical privilege escalation | RBAC middleware checks role against resource+action before resolver execution | ✅ Implemented |
| Direct object reference | All entity lookups scoped to org schema; UUID (unguessable) as IDs | ✅ Implemented |
| Missing function-level access | `check_permission(role, resource, action)` enforced at middleware layer | ✅ Implemented |

### A02:2021 — Cryptographic Failures

| Threat | Mitigation | Status |
|--------|-----------|--------|
| PII exposed in database | AES-256-GCM encryption at rest for: ID numbers, bank details, KRA PINs | ✅ Designed |
| Weak password storage | Argon2id with default params (memory: 19MiB, iterations: 2, parallelism: 1) | ✅ Implemented |
| Data in transit exposure | TLS 1.3 only (Nginx terminates); HSTS header with 1-year max-age | ✅ Configured |
| JWT secret compromise | 256-bit random secret; short-lived tokens (24h); refresh token rotation | ✅ Implemented |
| M-Pesa callback tampering | HMAC-SHA256 signature verification on all Daraja callbacks | ✅ Designed |

### A03:2021 — Injection

| Threat | Mitigation | Status |
|--------|-----------|--------|
| SQL injection | sqlx parameterized queries (`$1, $2`); no string interpolation in queries | ✅ Implemented |
| NoSQL injection | MongoDB driver parameterized queries; input validation before DB ops | ✅ Designed |
| GraphQL injection | async-graphql handles input parsing; depth limiting (max 10); complexity limiting | ✅ Designed |
| XSS via user input | React auto-escapes; CSP headers; server-side input sanitization | ✅ Configured |
| Command injection | No shell exec in backend; all file operations via MinIO SDK (no system calls) | ✅ By design |

### A04:2021 — Insecure Design

| Threat | Mitigation | Status |
|--------|-----------|--------|
| Unbounded AI requests | Per-org daily quota enforced via Redis counter | ✅ Designed |
| Lease document manipulation | Signed PDFs stored in immutable MinIO bucket; hash stored in PostgreSQL | ⚠️ Post-MVP |
| Score gaming | Multiple input signals; smoothing algorithm; anomaly detection flags sudden changes | ✅ Designed |
| Dispute evidence tampering | Immutable message log (trigger blocks UPDATE/DELETE on audit tables) | ✅ Implemented |

### A05:2021 — Security Misconfiguration

| Threat | Mitigation | Status |
|--------|-----------|--------|
| Default credentials in prod | `.env.example` with placeholder values; CI checks for default passwords | ✅ Documented |
| Exposed admin panels | RabbitMQ management (15672), MinIO console (9001) bound to internal network only | ✅ Configured |
| Debug mode in production | `RUST_LOG` defaults to `info`; no debug endpoints in release build | ✅ By design |
| CORS misconfiguration | Production: explicit origin whitelist (*.timis.co.ke); no wildcard | ⚠️ Needs hardening |

### A06:2021 — Vulnerable and Outdated Components

| Threat | Mitigation | Status |
|--------|-----------|--------|
| Dependency vulnerabilities | `cargo audit` in CI; `npm audit` for frontend; Dependabot/Renovate | ⚠️ CI not set up yet |
| Outdated base images | Docker images pinned to specific versions; monthly update cycle | ✅ Pinned |
| Supply chain attack | Pinned exact versions in Cargo.toml; lockfile committed | ✅ Implemented |

### A07:2021 — Identification and Authentication Failures

| Threat | Mitigation | Status |
|--------|-----------|--------|
| Brute force login | Rate limiting: 5 req/s on auth endpoints; exponential backoff after 5 failures | ✅ Configured |
| Credential stuffing | MFA (TOTP) available for all users; mandatory for LandlordAdmin/SuperAdmin | ✅ Implemented |
| Session hijacking | JWT short-lived; refresh token single-use with rotation; Redis blacklist on logout | ✅ Designed |
| Weak passwords | Minimum 8 chars enforced; common password dictionary check | ✅ Designed |

### A08:2021 — Software and Data Integrity Failures

| Threat | Mitigation | Status |
|--------|-----------|--------|
| Tampered M-Pesa callbacks | HMAC signature validation; IP whitelist for Safaricom source IPs | ✅ Designed |
| Modified audit logs | PostgreSQL trigger prevents UPDATE/DELETE on audit_log table | ✅ Implemented |
| Build pipeline compromise | Docker multi-stage builds; no secrets in images; build from clean state | ✅ Implemented |

### A09:2021 — Security Logging and Monitoring Failures

| Threat | Mitigation | Status |
|--------|-----------|--------|
| Undetected breaches | Full audit log: every mutation logged with user_id, timestamp, IP, old/new values | ✅ Implemented |
| Log tampering | Audit log in PostgreSQL with immutability trigger; also mirrored to MongoDB | ✅ Implemented |
| Missing alerting | RabbitMQ dead-letter queue monitoring; failed payment alerts | ⚠️ Post-MVP |

### A10:2021 — Server-Side Request Forgery (SSRF)

| Threat | Mitigation | Status |
|--------|-----------|--------|
| SSRF via file upload URLs | File uploads go directly to MinIO via presigned URLs (not proxied through app) | ✅ By design |
| SSRF via AI context | Claude API calls use hardcoded Anthropic endpoint; no user-controlled URLs | ✅ By design |

---

## 3. Rust-Specific Security Considerations

### Memory Safety

| Concern | TIMIS Approach |
|---------|--------------|
| Buffer overflows | Rust's ownership system prevents by default; no `unsafe` blocks in application code |
| Use-after-free | Borrow checker eliminates; only safe abstractions used |
| Data races | Tokio async runtime + `Arc<Mutex<>>` for shared state; `Send + Sync` bounds enforced |
| Integer overflow | Debug builds panic; release builds use `checked_*` operations for financial calculations |

### `unsafe` Audit

TIMIS application code contains **zero `unsafe` blocks**. Any `unsafe` exists only in:
- Dependency crates (sqlx, tokio, hyper) — all widely audited
- Standard library internals

### Financial Precision

- All monetary values use `NUMERIC(12,2)` in PostgreSQL (not floating point)
- Rust-side uses `f64` for display but `Decimal` (via `rust_decimal`) recommended for computation
- M-Pesa amounts are integers (KES whole numbers) — no precision loss

### Denial of Service

- GraphQL query depth limit: 10
- GraphQL complexity limit: 1000
- Request body size limit: 10MB (tower-http)
- File upload size: 50MB max (Nginx + MinIO policy)
- Connection pool: max 20 PostgreSQL connections

---

## 4. Kenya Data Protection Act (2019) Compliance

### Data Collection Principles

| Principle | Implementation |
|-----------|---------------|
| Lawfulness | Explicit consent collected at onboarding (stored in `consent_records` table) |
| Purpose limitation | Data collected only for tenancy management; AI features use data within stated purpose |
| Data minimization | Only required fields are mandatory; optional fields clearly marked |
| Accuracy | Tenant can update profile; landlord can flag incorrect information |
| Storage limitation | Configurable retention policy; vacated tenant data anonymized after 7 years |
| Integrity | Encryption at rest (AES-256-GCM); in transit (TLS 1.3); access logging |
| Accountability | DPO contact displayed; data processing register maintained |

### Data Subject Rights

| Right | Implementation |
|-------|---------------|
| Right to access | `data_requests` table; tenant can request all their data (JSON export) |
| Right to rectification | Tenant profile editable; correction requests logged |
| Right to deletion | Tenant can request deletion; org must comply within 30 days (KDPA s.40) |
| Right to portability | Timis Score + payment history exportable as JSON/PDF |
| Right to object | Tenant can revoke consent for AI processing, marketing comms |

### Cross-Border Transfer

- Primary data center: Kenya (Nairobi-based VPS or local cloud)
- Backups: encrypted before any off-shore transfer
- Diaspora landlord data: processed in same Kenyan infrastructure
- Claude API calls: only anonymized context sent (no raw PII in prompts)

---

## 5. M-Pesa Security

| Control | Implementation |
|---------|---------------|
| API credentials | Consumer key/secret stored in env vars (not in code) |
| Callback validation | HMAC-SHA256 signature check on all callbacks |
| IP whitelisting | Nginx allowlist for Safaricom IP ranges on callback endpoints |
| Idempotency | `CheckoutRequestID` used as idempotency key; duplicate callbacks ignored |
| Timeout handling | 30s timeout on STK Push; async status query as fallback |
| Reconciliation | Daily automated reconciliation matches M-Pesa statement to recorded payments |

---

## 6. Backup & Recovery

| Component | Strategy | Frequency | Retention |
|-----------|----------|-----------|-----------|
| PostgreSQL | `pg_dump` compressed + encrypted (GPG) | Daily (02:00 EAT) | 30 days |
| MongoDB | `mongodump` compressed + encrypted | Daily (02:30 EAT) | 30 days |
| MinIO | Versioning enabled; cross-region sync | Continuous | 90 days |
| Redis | RDB snapshot | Every 6 hours | 7 days |
| Backups storage | Encrypted → separate server/Backblaze B2 | — | As above |

### Recovery Time Objectives

- **RTO** (Recovery Time Objective): 4 hours
- **RPO** (Recovery Point Objective): 24 hours (last backup)
- Tested quarterly via restore drill

---

## 7. Incident Response

1. **Detection**: Anomalous login patterns, failed payment spikes, audit log alerts
2. **Containment**: Revoke JWT (Redis blacklist), disable org schema, block IP
3. **Notification**: KDPA requires notification to Data Commissioner within 72 hours of breach
4. **Recovery**: Restore from backup, rotate all credentials, deploy patched version
5. **Post-mortem**: Root cause analysis, update threat model, notify affected users

---

## 8. Penetration Testing Readiness

### Scope for Pentest

- [ ] GraphQL API: auth bypass, injection, depth attacks, batching abuse
- [ ] REST webhooks: signature bypass, replay attacks, callback forgery
- [ ] Nginx: path traversal, header injection, rate limit bypass
- [ ] Auth: brute force, token prediction, MFA bypass
- [ ] Multi-tenancy: cross-schema data leakage, privilege escalation
- [ ] File upload: malicious file types, path traversal, oversized files
- [ ] M-Pesa flow: callback replay, amount manipulation, reference collision

### Pre-Pentest Checklist

- [ ] All default passwords changed
- [ ] Debug/development endpoints removed from production build
- [ ] Error messages do not leak internal details (stack traces, SQL errors)
- [ ] Rate limiting active on all endpoints
- [ ] CORS restricted to production domains
- [ ] CSP headers configured
- [ ] No secrets in Docker images or git history
