# TIMIS Production Deployment on Render

## Architecture on Render

```
┌──────────────────────────────────────────────────┐
│                  Render Platform                   │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌─────────────────┐   ┌─────────────────────┐  │
│  │  Web Service     │   │  Web Service         │  │
│  │  timis-api       │   │  timis-frontend      │  │
│  │  (Docker)        │   │  (Docker)            │  │
│  │  Port 8080       │   │  Port 3000           │  │
│  └────────┬─────────┘   └─────────────────────┘  │
│           │                                       │
│  ┌────────┴─────────┐                           │
│  │  Background Worker│                           │
│  │  timis-worker     │                           │
│  │  (same Docker img)│                           │
│  └──────────────────┘                           │
└──────────────────────────────────────────────────┘
         │
         ▼ External Services (already running)
┌─────────────────────────────────────────────────┐
│  Supabase (PostgreSQL + Storage)                 │
│  Upstash (Redis)                                 │
│  Groq/Claude (AI)                                │
└─────────────────────────────────────────────────┘
```

## Step-by-Step Deployment

### Prerequisites
- GitHub repo with the TIMIS code pushed
- Render account (render.com)
- Supabase project (already set up)
- Upstash Redis (already set up)

---

### Step 1: Push to GitHub

```bash
cd /mnt/sub0_2/timis
git init
git add .
git commit -m "TIMIS v1.0 — production ready"
git remote add origin https://github.com/YOUR_USERNAME/timis.git
git push -u origin main
```

---

### Step 2: Deploy Backend API (Render Web Service)

1. Go to render.com → Dashboard → **New** → **Web Service**
2. Connect your GitHub repo
3. Configure:

| Setting | Value |
|---------|-------|
| Name | `timis-api` |
| Region | Frankfurt (closest to Kenya) or Oregon |
| Branch | `main` |
| Root Directory | `.` |
| Runtime | Docker |
| Dockerfile Path | `./Dockerfile` |
| Docker Command | `timis-api` |
| Instance Type | Starter ($7/mo) or Standard |

4. Add Environment Variables:

```
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require
REDIS_URL=rediss://default:xxx@golden-bison-92253.upstash.io:6379
JWT_SECRET=<your-64-char-secret>
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
SUPABASE_BUCKET=timis
AI_PROVIDER=groq
AI_API_KEY=gsk_xxx
AI_MODEL=llama-3.1-8b-instant
AI_BASE_URL=https://api.groq.com/openai/v1
RUST_LOG=timis_api=info
```

5. Click **Create Web Service** → wait for build (~5–10 min first time)

Note the URL: `https://timis-api.onrender.com`

---

### Step 3: Deploy Background Worker (Render Background Worker)

1. **New** → **Background Worker**
2. Same repo, same Docker image
3. Configure:

| Setting | Value |
|---------|-------|
| Name | `timis-worker` |
| Root Directory | `.` |
| Runtime | Docker |
| Dockerfile Path | `./Dockerfile` |
| Docker Command | `timis-worker` |

4. Same environment variables as the API
5. Click **Create Background Worker**

---

### Step 4: Deploy Frontend (Render Web Service)

1. **New** → **Web Service**
2. Same repo
3. Configure:

| Setting | Value |
|---------|-------|
| Name | `timis-frontend` |
| Root Directory | `.` |
| Runtime | Docker |
| Dockerfile Path | `./Dockerfile.frontend` |
| Instance Type | Starter |

4. Add Environment Variables:

```
NEXT_PUBLIC_API_URL=https://timis-api.onrender.com/api/v1
NEXT_PUBLIC_GRAPHQL_URL=https://timis-api.onrender.com/graphql
NEXT_PUBLIC_WS_URL=wss://timis-api.onrender.com/ws
```

5. Click **Create Web Service**

Note the URL: `https://timis-frontend.onrender.com`

---

### Step 5: Custom Domain (Optional)

1. In Render → `timis-frontend` → Settings → Custom Domains
2. Add `app.timis.co.ke` (or your domain)
3. Point DNS: CNAME → `timis-frontend.onrender.com`
4. For API: add `api.timis.co.ke` → CNAME `timis-api.onrender.com`

---

### Step 6: Verify Deployment

```bash
# Health check
curl https://timis-api.onrender.com/api/v1/health

# Test registration
curl -X POST https://timis-api.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234","first_name":"Test","last_name":"User","phone":"254700000000","org_name":"Test Org"}'
```

---

## render.yaml (Infrastructure as Code)

Create this file to auto-deploy all services:
