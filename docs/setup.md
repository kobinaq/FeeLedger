# Setup

## Local App

```bash
npm install
npm run dev
```

The app starts at `http://localhost:3000` and redirects to `/login`.

## Environment

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Database

Run these SQL files in Supabase SQL editor:

1. `supabase/schema.sql`
2. `supabase/functions.sql`
3. `supabase/policies.sql`
4. `supabase/seed.sql`

## Demo Flow Checks

- Family billing: open `/admin/fee-setup`, then `/admin/bills`.
- Payment and receipt: open `/admin/payments/new`, choose a family, submit payment, and review success state.
- Reminder: open `/admin/reminders` and review templates and history.
- Payment plan: open `/admin/payment-plans` and `/parent/payment-plan`.
- Parent portal: open `/parent/overview`.
- Reports: open `/admin/reports` and use export buttons.
