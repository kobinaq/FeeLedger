# FeeLedger Product Spec

FeeLedger helps private schools manage fee collection from bill setup through payment, receipt, reminder, payment plan, arrears follow-up, and parent visibility.

## Roles

- Platform Super Admin: manages schools, subscriptions, and usage.
- School Admin / Proprietor: full school finance access.
- Headteacher: dashboard, arrears, reports, family accounts, and payment plans.
- Accountant / Bursar: students, families, bills, payments, receipts, reminders, plans, arrears, and reports.
- Cashier: fast payment recording, receipts, and family search.
- Parent / Guardian: own family balance, children, bills, payments, receipts, payment plan, and school contact details.

## Core Modules

- Student records linked to family accounts.
- Family financial profile with bills, payments, receipts, reminders, and plans.
- Fee items and class fee rules.
- Guided bill generation with preview before publish.
- Manual payment recording with receipt generation.
- Mock SMS/email reminders and sent history.
- Family-level payment plans and instalments.
- Arrears dashboard with plain-language labels.
- Management reports with CSV/PDF export controls.
- Parent portal with large balance, simple actions, receipt cards, and payment plan timeline.
- Platform school and subscription management.

## Business Rules

- Bills are generated from class fee rules plus optional services.
- Bills must be previewed before publishing.
- Payments can be partial and can be allocated to a bill.
- Payment recording generates a receipt, updates bill status, updates balances, and writes audit logs in the database design.
- Payment plans must have instalments that add up to the plan amount.
- Reminders are stored and sent through mock providers.
- Parents can only view their own family account.
