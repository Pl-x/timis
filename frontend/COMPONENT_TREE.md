# TIMIS Frontend — Component Tree

## Directory Structure

```
frontend/
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker (offline receipts)
│   ├── icons/                 # PWA icons (192, 512)
│   └── locales/
│       ├── en.json            # English translations
│       └── sw.json            # Swahili translations
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── layout.tsx         # Root layout (providers, fonts)
│   │   ├── page.tsx           # Public landing → /
│   │   │
│   │   ├── (public)/          # PUBLIC LANDING (SSR, SEO)
│   │   │   ├── page.tsx       # Hero, features, pricing
│   │   │   ├── pricing/page.tsx
│   │   │   ├── features/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   └── contact/page.tsx
│   │   │
│   │   ├── (auth)/            # AUTH PAGES
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── verify-otp/page.tsx
│   │   │
│   │   ├── dashboard/         # LANDLORD/MANAGER PORTAL
│   │   │   ├── layout.tsx     # Sidebar + topbar shell
│   │   │   ├── page.tsx       # Portfolio overview
│   │   │   ├── properties/
│   │   │   │   ├── page.tsx   # Property list
│   │   │   │   ├── [id]/page.tsx  # Property detail
│   │   │   │   └── new/page.tsx   # Add property
│   │   │   ├── units/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   └── vacancy/page.tsx  # Vacancy dashboard
│   │   │   ├── tenants/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   ├── new/page.tsx   # Onboarding form
│   │   │   │   └── vetting/page.tsx
│   │   │   ├── leases/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── expiring/page.tsx
│   │   │   ├── finance/
│   │   │   │   ├── page.tsx       # Financial overview
│   │   │   │   ├── invoices/page.tsx
│   │   │   │   ├── payments/page.tsx
│   │   │   │   ├── arrears/page.tsx
│   │   │   │   ├── payouts/page.tsx
│   │   │   │   └── tax/page.tsx   # KRA reports
│   │   │   ├── disputes/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── maintenance/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/page.tsx
│   │   │   │   └── vendors/page.tsx
│   │   │   ├── communications/
│   │   │   │   ├── page.tsx       # Inbox
│   │   │   │   └── broadcast/page.tsx
│   │   │   ├── scores/
│   │   │   │   └── page.tsx       # Tenant scores overview
│   │   │   ├── reports/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── financial/page.tsx
│   │   │   │   ├── occupancy/page.tsx
│   │   │   │   └── export/page.tsx
│   │   │   ├── ai/
│   │   │   │   ├── page.tsx       # AI features hub
│   │   │   │   ├── legal/page.tsx
│   │   │   │   ├── lease-analyzer/page.tsx
│   │   │   │   └── vacancy-copy/page.tsx
│   │   │   └── settings/
│   │   │       ├── page.tsx
│   │   │       ├── profile/page.tsx
│   │   │       ├── billing/page.tsx
│   │   │       └── team/page.tsx
│   │   │
│   │   └── tenant/             # TENANT PORTAL (PWA)
│   │       ├── layout.tsx      # Bottom nav, mobile shell
│   │       ├── page.tsx        # Tenant home (pay rent CTA)
│   │       ├── pay/page.tsx    # Pay rent (M-Pesa)
│   │       ├── receipts/page.tsx
│   │       ├── lease/page.tsx
│   │       ├── maintenance/
│   │       │   ├── page.tsx
│   │       │   └── new/page.tsx
│   │       ├── disputes/
│   │       │   ├── page.tsx
│   │       │   └── new/page.tsx
│   │       ├── score/page.tsx   # Timis Score view
│   │       ├── messages/page.tsx
│   │       └── settings/page.tsx
│   │
│   ├── components/
│   │   ├── ui/                 # DESIGN SYSTEM
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Tabs.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   └── ProgressBar.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   ├── BottomNav.tsx    # Tenant mobile nav
│   │   │   ├── ThemeToggle.tsx
│   │   │   └── LangToggle.tsx  # EN/SW switch
│   │   │
│   │   ├── dashboard/
│   │   │   ├── PortfolioCards.tsx
│   │   │   ├── OccupancyChart.tsx
│   │   │   ├── RevenueChart.tsx
│   │   │   ├── ArrearsTable.tsx
│   │   │   └── RecentActivity.tsx
│   │   │
│   │   ├── tenants/
│   │   │   ├── TenantCard.tsx
│   │   │   ├── TenantForm.tsx
│   │   │   ├── VettingChecklist.tsx
│   │   │   ├── TenantProfile.tsx
│   │   │   └── DocumentUploader.tsx
│   │   │
│   │   ├── units/
│   │   │   ├── UnitCard.tsx
│   │   │   ├── UnitGrid.tsx
│   │   │   ├── UnitForm.tsx
│   │   │   └── VacancyBoard.tsx
│   │   │
│   │   ├── leases/
│   │   │   ├── LeaseTimeline.tsx
│   │   │   ├── LeaseForm.tsx
│   │   │   ├── ExpiryAlerts.tsx
│   │   │   └── AgreementViewer.tsx
│   │   │
│   │   ├── finance/
│   │   │   ├── InvoiceTable.tsx
│   │   │   ├── PaymentHistory.tsx
│   │   │   ├── MpesaPayButton.tsx   # Triggers STK Push
│   │   │   ├── ArrearsEscalation.tsx
│   │   │   ├── PayoutSchedule.tsx
│   │   │   └── KRATaxSummary.tsx
│   │   │
│   │   ├── score/
│   │   │   ├── ScoreGauge.tsx       # Circular score display
│   │   │   ├── ScoreHistory.tsx     # Line chart over time
│   │   │   ├── ScoreFactors.tsx     # Breakdown bars
│   │   │   ├── ScoreBenchmark.tsx   # "Top 20% in Nyeri"
│   │   │   ├── ScoreShareModal.tsx
│   │   │   └── ScoreTips.tsx        # AI-generated tips
│   │   │
│   │   ├── disputes/
│   │   │   ├── DisputeForm.tsx
│   │   │   ├── DisputeTimeline.tsx
│   │   │   ├── EvidenceUploader.tsx
│   │   │   ├── DisputeDocViewer.tsx
│   │   │   └── EscalationGuide.tsx
│   │   │
│   │   ├── maintenance/
│   │   │   ├── RequestForm.tsx
│   │   │   ├── RequestCard.tsx
│   │   │   ├── VendorPicker.tsx
│   │   │   ├── SLAIndicator.tsx
│   │   │   └── CompletionVerify.tsx
│   │   │
│   │   ├── communications/
│   │   │   ├── MessageThread.tsx
│   │   │   ├── ConversationList.tsx
│   │   │   ├── BroadcastForm.tsx
│   │   │   └── NotificationFeed.tsx
│   │   │
│   │   ├── ai/
│   │   │   ├── LegalChat.tsx        # Chat UI for legal Q&A
│   │   │   ├── LeaseUploadAnalyzer.tsx
│   │   │   ├── DisputeAdvisorCard.tsx
│   │   │   ├── VacancyCopyGenerator.tsx
│   │   │   └── RenewalBriefing.tsx
│   │   │
│   │   └── reports/
│   │       ├── ReportFilters.tsx
│   │       ├── FinancialSummary.tsx
│   │       ├── ExportButton.tsx
│   │       └── ChartWrapper.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useGraphQL.ts
│   │   ├── useTimisScore.ts
│   │   ├── useMpesa.ts
│   │   ├── useNotifications.ts
│   │   ├── useOffline.ts         # PWA offline detection
│   │   └── useWebSocket.ts
│   │
│   ├── lib/
│   │   ├── apollo-client.ts
│   │   ├── auth.ts
│   │   ├── constants.ts
│   │   ├── formatters.ts         # KES currency, dates
│   │   └── validators.ts         # Phone (254...), KRA PIN
│   │
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── notificationStore.ts
│   │   └── themeStore.ts
│   │
│   └── styles/
│       ├── globals.css
│       └── tailwind/
│           └── timis-theme.ts     # Deep blue + amber palette
```

## Design Tokens (tailwind timis-theme)

```typescript
// src/styles/tailwind/timis-theme.ts
export const timisTheme = {
  colors: {
    timis: {
      blue: {
        50: '#EFF6FF',
        500: '#1E40AF',  // Primary action
        700: '#1E3A5F',  // Deep blue (trust)
        900: '#0F1B2D',  // Dark mode bg
      },
      amber: {
        400: '#FBBF24',  // Accent (warmth)
        500: '#F59E0B',  // CTA buttons
      },
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      neutral: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        800: '#1F2937',
        900: '#111827',
      }
    }
  },
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
  }
}
```

## Portal Layouts

### Landlord Portal (Desktop + Responsive)
```
┌─────────────────────────────────────────────┐
│  TopBar [Logo] [Search] [Notifications] [👤]│
├────────┬────────────────────────────────────┤
│        │                                    │
│ Sidebar│         Main Content               │
│        │                                    │
│ • Home │   ┌──────┐ ┌──────┐ ┌──────┐     │
│ • Props│   │Card 1│ │Card 2│ │Card 3│     │
│ • Units│   └──────┘ └──────┘ └──────┘     │
│ • Tenants                                   │
│ • Leases│        [Charts / Tables]          │
│ • Finance                                   │
│ • Disputes                                  │
│ • Maint │                                   │
│ • Comms │                                   │
│ • AI    │                                   │
│ • Reports                                   │
│ • Settings                                  │
└────────┴────────────────────────────────────┘
```

### Tenant Portal (Mobile-First PWA)
```
┌─────────────────────┐
│  TIMIS     🔔  ☰    │
├─────────────────────┤
│                     │
│   ┌─────────────┐   │
│   │ Timis Score  │   │
│   │    742      │   │
│   │   ●●●●○    │   │
│   └─────────────┘   │
│                     │
│   ┌─────────────┐   │
│   │ PAY RENT    │   │
│   │ KES 25,000  │   │
│   │ Due: Jun 1  │   │
│   │  [Pay Now]  │   │
│   └─────────────┘   │
│                     │
│   Recent Activity   │
│   • Receipt Jun...  │
│   • Maint fixed...  │
│                     │
├─────────────────────┤
│ 🏠  💰  🔧  💬  👤 │
│Home Pay Maint Msg Me│
└─────────────────────┘
```
