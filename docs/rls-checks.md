# RLS Verification Checks

Run these after applying schema, functions, policies, seed data, and creating demo Supabase Auth users.

- Sign in as `accountant@gracefield.test`; `select * from families` should show only Gracefield rows.
- Sign in as `parent@gracefield.test`; `select * from families` should show only the linked family.
- Sign in as `cashier@gracefield.test`; inserting into `payments` should succeed, deleting from `payments` should fail.
- Sign in as `headteacher@gracefield.test`; report reads should work, fee rule/payment mutations should fail.
- Sign in as `platform@feeledger.test`; platform school and subscription management should work.
