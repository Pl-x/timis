# TIMIS Intelligence™ — Claude API Integration

## Architecture

```
Client Request → GraphQL Mutation (askAI) → AI Router → Feature Handler → Claude API → Response + Logging
```

## Features Map

| # | Feature | Trigger | System Prompt Strategy |
|---|---------|---------|----------------------|
| 1 | Legal Assistant | User asks legal Q | Kenya law corpus + disclaimers |
| 2 | Lease Analyzer | PDF upload | Clause extraction + risk flags |
| 3 | Dispute Advisor | Dispute created | Category + evidence + comms context |
| 4 | Anomaly Detection | Scheduled / on-demand | Payment data window (30d) |
| 5 | Score Explainer | Score changes | Factor delta + natural language |
| 6 | Vacancy Copy | Landlord request | Unit specs + market optimization |
| 7 | Renewal Briefing | Pre-renewal trigger | Tenant history + CPI data |

## Rate Limits & Cost Control

- Max 50 AI requests per org per day (Free plan)
- Max 200/day (Starter), 1000/day (Pro), unlimited (Enterprise)
- Token budget per request: 4096 output tokens max
- Cached responses for identical legal queries (Redis, 1hr TTL)
- All interactions logged to `ai_interactions` table for audit

## Error Handling

- Timeout: 30s per Claude request, retry once
- Rate limit (Anthropic 429): exponential backoff, queue for later
- Invalid response: return graceful fallback message
- Network failure: return cached response if available, else error

## Context Injection Pattern

Each feature injects relevant context from the database into the prompt:
1. Org context (property names, locations)
2. User role (tenant vs landlord — shapes response tone)
3. Feature-specific data (payment records, lease text, dispute details)
4. Kenyan legal framework references (always injected for legal/dispute features)
