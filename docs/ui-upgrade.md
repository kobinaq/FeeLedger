# FeeLedger UI Upgrade Plan

## Direction: “Ledger Grove”

Keep the established FeeLedger brand (deep green `#1B4332`, amber `#D97706`) and upgrade craft — not reinvent into a generic SaaS look.

### Goals
1. **Brand-first demo entry** — `/login` should feel like FeeLedger, not a form on grey.
2. **Readable trust** — school finance UI for busy non-technical staff and parents.
3. **One clear next action** per surface (especially cashier and parent home).
4. **Motion with purpose** — entrance, hover, and demo-role affordances (2–3 intentional motions).

### Typography
- Display: **Fraunces** (headlines, brand wordmark)
- UI/body: **Manrope** (forms, nav, tables)

### Atmosphere
- Soft sage mist background (`#F4F7F5`) with a green radial wash
- Subtle ledger-line pattern on login hero only
- Cards stay calm; no heavy multi-layer shadows or glow

### Surfaces in scope
| Surface | Upgrade |
|---------|---------|
| Design tokens / globals / layout fonts | New type + CSS variables + motion utilities |
| `/login` + demo roles | Brand hero, clearer demo pathway, role cards |
| `/forgot-password`, `/reset-password` | Match login visual language |
| Admin shell + nav | Stronger brand mark, refined sidebar/header |
| Parent shell + overview/balance | Balance-first hierarchy, warmer chrome |
| Platform shell | Green-led platform chrome (not generic black) |
| Shared UI (Button, Card, PageHeader, StatCard, Input) | Consistent radius, focus, type roles |

### Out of scope
- Full page-by-page content rewrite
- Dark mode
- New product modules

### Demo pathway specifics
- Section titled **Walk through as…** with role cards that show who it’s for
- Gracefield school callout so clients know it’s the live demo tenant
- Password hint only when demo credentials are enabled
