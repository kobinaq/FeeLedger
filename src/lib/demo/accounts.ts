import type { Role } from "@/types";

export type DemoAccount = {
  role: Role;
  email: string;
  label: string;
  description: string;
};

export const DEMO_PASSWORD = "demo12345";

export const demoAccounts: DemoAccount[] = [
  {
    role: "school_admin",
    email: "proprietor@gracefield.test",
    label: "Proprietor",
    description: "Full school finance access"
  },
  {
    role: "headteacher",
    email: "headteacher@gracefield.test",
    label: "Headteacher",
    description: "Dashboard, arrears, and reports"
  },
  {
    role: "accountant",
    email: "accountant@gracefield.test",
    label: "Accountant",
    description: "Billing, payments, and plans"
  },
  {
    role: "cashier",
    email: "cashier@gracefield.test",
    label: "Cashier",
    description: "Fast payment recording"
  },
  {
    role: "parent",
    email: "parent@gracefield.test",
    label: "Parent",
    description: "Family balance and receipts"
  },
  {
    role: "platform_admin",
    email: "platform@feeledger.test",
    label: "Platform",
    description: "Schools and subscriptions"
  }
];

export function demoAccountByRole(role: string) {
  return demoAccounts.find((account) => account.role === role);
}
