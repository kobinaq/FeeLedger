# FeeLedger

FeeLedger is a focused private school fee collection platform for billing, family accounts, payment recording, receipts, reminders, payment plans, arrears visibility, parent portal access, and management reports.

It is intentionally not a general school management system. There is no attendance, exams, timetable, payroll, LMS, library, or hostel module.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, Storage, and RLS
- Domain feature modules under `src/features/*` (queries + server actions)
- Zod validators; money multi-writes in Postgres RPCs
- Recharts reports
- Paystack online payments (parent) + manual payment recording
- Mock or real SMS/email reminder providers

See `docs/architecture.md` for layering rules.

## Demo Users

Use password `demo12345` for all demo accounts:

- `platform@feeledger.test`
- `proprietor@gracefield.test`
- `headteacher@gracefield.test`
- `accountant@gracefield.test`
- `cashier@gracefield.test`
- `parent@gracefield.test`

## Run Locally

```bash
npm install
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
4. Create the demo Auth users and matching profiles with the Admin API:
   ```bash
   npm run setup:demo-users
   ```
   This requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`. Do not expose the service role key in Vercel client env vars.

The SQL seed intentionally avoids direct writes to `auth.users` and `auth.identities`. Auth users should be created through Supabase Auth, the Dashboard, or the Admin API script above.

The app uses Supabase as the runtime source of truth. The old in-app demo data is not used by production routes.

## Tests

```bash
npm run verify          # typecheck + DB type map + unit tests + lint
npm test
npm run build
npm run test:e2e        # starts dev/server via Playwright webServer config
```

CI runs the same quality gates on every push/PR (see `.github/workflows/ci.yml`).

## Important Routes

- `/login`
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
