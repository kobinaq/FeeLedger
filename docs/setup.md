# Setup

## Local App

```bash
npm install
npm run dev
```

The app starts at `http://localhost:3000` and redirects to `/login`.

## Environment

Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_AUTH=enabled
NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS=true
```

Demo auth shows one-click role buttons on `/login` for client walkthroughs. Disable with `NEXT_PUBLIC_DEMO_AUTH=disabled` for production tenants.

## Database

Run these SQL files in Supabase SQL editor:

1. `supabase/schema.sql`
2. `supabase/functions.sql`
3. `supabase/policies.sql`
4. `supabase/seed.sql`

Then create the demo Auth users and matching `profiles` rows with the Supabase Admin API:

```bash
npm run setup:demo-users
```

`SUPABASE_SERVICE_ROLE_KEY` is required for that command. Keep it server-side only, and never prefix it with `NEXT_PUBLIC_`.

## Demo Flow Checks

- Family billing: open `/admin/fee-setup`, then `/admin/bills`.
- Payment and receipt: open `/admin/payments/new`, choose a family, submit payment, and review success state.
- Reminder: open `/admin/reminders` and review templates and history.
- Payment plan: open `/admin/payment-plans` and `/parent/payment-plan`.
- Parent portal: open `/parent/overview`.
- Reports: open `/admin/reports` and review collection/arrears summaries.

## Tests

Run:

```bash
npm run typecheck
npm test
npm run build
```

For Playwright checks, run the app in one terminal and the suite in another:

```bash
npm run dev -- -p 3000
npm run test:e2e
```
