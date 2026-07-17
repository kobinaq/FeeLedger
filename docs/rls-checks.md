# RLS Verification Checks

Run these after applying schema, functions, policies, seed data, and creating demo Supabase Auth users.

## Tenant isolation

- Sign in as `accountant@gracefield.test`; `select * from families` should show only Gracefield rows.
- Sign in as `parent@gracefield.test`; `select * from families` should show only the linked family.
- Sign in as `cashier@gracefield.test`; inserting into `payments` directly should fail (use `record_payment_transaction` RPC instead). Deleting from `payments` should fail.
- Sign in as `headteacher@gracefield.test`; report reads should work, fee rule/payment mutations should fail.
- Sign in as `platform@feeledger.test`; platform school and subscription management should work.

## Privilege and money integrity

- As `school_admin`, attempting `update profiles set role = 'platform_admin' where id = auth.uid()` must fail.
- As `accountant`, `update bills set paid_amount = 0` must fail (money fields are protected).
- As `school_admin`, updating own school name/phone/email via settings must succeed.
- `select * from payment_webhook_events` as Gracefield accountant must only return rows with Gracefield `school_id` (or empty).

## API checks

- Unauthenticated `POST /api/reminders` returns 401.
- Unauthenticated `POST /api/payments` returns 401.
- Authenticated cashier `POST /api/payments` records via RPC and returns a payment id.
- `POST /api/bills/publish` without `billIds` returns 400 (must select drafts explicitly).
