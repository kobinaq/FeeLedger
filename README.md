# FeeLedger

FeeLedger is a focused private school fee collection platform for billing, family accounts, payment recording, receipts, reminders, payment plans, arrears visibility, parent portal access, and management reports.

It is intentionally not a general school management system. There is no attendance, exams, timetable, payroll, LMS, library, or hostel module.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, Storage, and RLS
- React Hook Form and Zod-ready validators
- Recharts reports
- Mock SMS and email providers (swap to Resend / HTTP SMS for production)
- Manual payment recording + Paystack online payments

## Demo Auth (live client walkthroughs)

On `/login`, when demo auth is enabled, one-click role buttons sign into the Gracefield demo school:

- Proprietor, Headteacher, Accountant, Cashier, Parent, Platform

Configure with:

```bash
NEXT_PUBLIC_DEMO_AUTH=enabled
NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS=true
```

Demo password for manual sign-in: `demo12345`

- `platform@feeledger.test`
- `proprietor@gracefield.test`
- `headteacher@gracefield.test`
- `accountant@gracefield.test`
- `cashier@gracefield.test`
- `parent@gracefield.test`

For production tenants, set `NEXT_PUBLIC_DEMO_AUTH=disabled`.

## Run Locally

```bash
npm install
cp .env.example .env.local
# fill Supabase keys
npm run setup:demo-users
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and fill in the Supabase values.
3. Run SQL files in this order:
   - `supabase/schema.sql`
   - `supabase/functions.sql`
   - `supabase/policies.sql`
   - `supabase/seed.sql`
   - `supabase/migrations/20260717000000_production_hardening.sql` (for existing projects that already applied older SQL)
4. Create the demo Auth users and matching profiles:
   ```bash
   npm run setup:demo-users
   ```

`SUPABASE_SERVICE_ROLE_KEY` is required for the demo user script. Never expose it as a `NEXT_PUBLIC_` variable.

## Tests

```bash
npm run typecheck
npm test
npm run build
```

For E2E tests, start the app first, then run Playwright:

```bash
npm run dev -- -p 3000
npm run test:e2e
```

## Important Routes

- `/login` (includes demo role buttons when enabled)
- `/reset-password`
- `/admin/dashboard`
- `/admin/students`
- `/admin/families`
- `/admin/fee-setup`
- `/admin/bills`
- `/admin/payments/new`
- `/admin/receipts`
- `/admin/payment-plans`
- `/admin/reminders`
- `/admin/arrears`
- `/admin/reports`
- `/admin/settings`
- `/parent/overview`
- `/parent/bills`
- `/parent/receipts`
- `/parent/payment-plan`
- `/parent/contact`
- `/platform/schools`
- `/platform/subscriptions`

## Product Promise

Help private schools collect fees faster, reduce arrears, manage payment plans, and give parents a clear view of what they owe.
