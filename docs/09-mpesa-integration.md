# TIMIS M-Pesa Daraja Integration

## Overview

Full Safaricom Daraja API integration for:
- **STK Push** (Lipa Na M-Pesa Online) — tenant-initiated rent payment
- **C2B** (Customer to Business) — paybill payments with account reference
- **B2C** (Business to Customer) — landlord payouts, deposit refunds
- **Transaction Query** — verify payment status
- **Reconciliation** — match M-Pesa transactions to invoices

## Credentials Setup

```bash
# .env
MPESA_CONSUMER_KEY=your_consumer_key
MPESA_CONSUMER_SECRET=your_consumer_secret
MPESA_PASSKEY=your_lipa_na_mpesa_passkey
MPESA_SHORTCODE=174379         # Paybill number
MPESA_CALLBACK_URL=https://api.timis.co.ke/api/v1/mpesa/callback
MPESA_ENVIRONMENT=sandbox      # or "production"
```

## Payment Flow

1. Tenant taps "Pay Rent" → frontend calls GraphQL `initiateMpesaPayment`
2. Backend sends STK Push to Safaricom → tenant gets prompt on phone
3. Tenant enters PIN → Safaricom processes payment
4. Safaricom POSTs callback to `/api/v1/mpesa/callback`
5. Backend validates signature, matches invoice, records payment
6. Updates: invoice status, arrears, Timis Score, generates receipt
7. Sends SMS receipt + WebSocket notification

## Account Reference Format

Tenants paying via paybill use account reference: `INV-{short_id}` or `{unit_number}`
This allows C2B validation to match payments to the correct invoice/unit.
