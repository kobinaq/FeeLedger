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
- Mock SMS and email providers
- Manual payment recording

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
4. Create the demo auth users in Supabase Auth using the emails above.
5. The seed creates demo Auth users and matching `profiles` for local/demo projects. If your Supabase project blocks direct `auth.users` inserts, create the users in Supabase Auth and then apply matching `profiles` rows.

The app uses Supabase as the runtime source of truth. The old in-app demo data is not used by production routes.

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
