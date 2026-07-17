# FeeLedger Architecture

## Layers

| Layer | Responsibility |
|-------|----------------|
| `src/app` | Routes, layouts, page composition |
| `src/components` | Presentational UI only (no Supabase) |
| `src/features/<domain>` | Domain queries, server actions, orchestration |
| `src/features/shared` | Cross-cutting helpers only (`audit`, `form-data`) |
| `src/lib` | Infra adapters + pure helpers (`money`, paystack, notifications, supabase) |
| `supabase/*.sql` | Schema, RLS, money RPCs and triggers |

## Rules

1. Domain folders hold real code — not re-export façades.
2. Multi-write money paths use Postgres RPCs/triggers (`record_payment_transaction`, `generate_bills_for_classes`, payment-plan allocation trigger).
3. Pages compose; features execute; components present.
4. Avoid deep cross-feature imports; compose at the action/page or reports layer.
5. Auth is layered: middleware → `require*Profile` → `canManage*` → RLS/RPC.

## Domains

- `auth`, `families`, `students`, `fees`, `bills`, `payments`, `payment-plans`, `reminders`, `receipts`, `schools`, `reports`, `platform`

## AuthZ for admin pages

```ts
await requireAdminNav("payments"); // staff + canViewAdminNav(role, key)
```

Nav visibility and deep-link access share the same capability map in `features/auth/permissions.ts`.

## Middleware session claims (scale)

Middleware must not query `profiles` on every request when avoidable.

1. On sign-in, sync `app_metadata.feeledger_role` / `feeledger_school_id` / `feeledger_family_id` via the Auth Admin API and set httpOnly `fl_claims` cookie.
2. Middleware resolves role from JWT `app_metadata` → `fl_claims` cookie (user-id bound) → one-time `profiles` fallback (then sets cookie).
3. Page loaders (`require*Profile`) still load the full profile from the DB for RLS-backed data work — only routing avoids the hop.

If a user's role changes in `profiles`, they should sign out/in (or re-run demo user setup) so JWT claims refresh.

## Types

- Source of truth for table shapes: `src/types/database.ts` (hand-maintained; keep in sync with `supabase/*.sql`)
- App enums re-export from that map via `src/types/index.ts`
- CI checks required tables/RPCs with `npm run check:types-map`
- Optional full regenerate from a live project:
  `npx supabase gen types typescript --project-id <id> > src/types/database.generated.ts`

## Notifications

- `lib/services/notifications.ts` supports mock (default) or real Resend + HTTP SMS
- Set `MOCK_EMAIL_PROVIDER=disabled` / `MOCK_SMS_PROVIDER=disabled` with real credentials for production
- School settings shows current provider mode for school admins
