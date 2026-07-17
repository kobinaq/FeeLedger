/**
 * Lightweight guard that the hand-maintained Database type still
 * describes tables/functions the app relies on. Run in CI via `npm run check:types-map`.
 *
 * For a full generated types file from a live project:
 *   npx supabase gen types typescript --project-id <id> > src/types/database.generated.ts
 * Then review and merge into src/types/database.ts.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const file = resolve("src/types/database.ts");
const source = readFileSync(file, "utf8");

const requiredTables = [
  "schools",
  "profiles",
  "families",
  "students",
  "bills",
  "bill_items",
  "payments",
  "online_payment_sessions",
  "payment_webhook_events",
  "receipts",
  "payment_plans",
  "payment_plan_installments",
  "reminders",
  "subscriptions",
  "audit_logs"
];

const requiredFunctions = ["record_payment_transaction", "generate_bills_for_classes", "school_collection_snapshot"];

const missingTables = requiredTables.filter((name) => !source.includes(`${name}:`));
const missingFunctions = requiredFunctions.filter((name) => !source.includes(`${name}:`));

if (missingTables.length || missingFunctions.length) {
  console.error("database.ts type map is missing expected entries:");
  if (missingTables.length) console.error("  tables:", missingTables.join(", "));
  if (missingFunctions.length) console.error("  functions:", missingFunctions.join(", "));
  process.exit(1);
}

console.log(`database.ts type map OK (${requiredTables.length} tables, ${requiredFunctions.length} functions checked).`);
