import type { Role } from "@/types";

export const staffRoles: Role[] = ["school_admin", "headteacher", "accountant", "cashier"];
export const financeMutationRoles: Role[] = ["school_admin", "accountant", "cashier"];
export const billingMutationRoles: Role[] = ["school_admin", "accountant"];
export const settingsMutationRoles: Role[] = ["school_admin"];
export const readOnlyStaffRoles: Role[] = ["headteacher"];

export type AdminNavKey =
  | "dashboard"
  | "students"
  | "families"
  | "fee-setup"
  | "bills"
  | "payments"
  | "receipts"
  | "plans"
  | "reminders"
  | "arrears"
  | "reports"
  | "settings";

/** Which admin nav items each staff role can open (read or write). */
const navAccess: Record<AdminNavKey, Role[]> = {
  dashboard: ["school_admin", "headteacher", "accountant", "cashier"],
  students: ["school_admin", "accountant"],
  families: ["school_admin", "headteacher", "accountant", "cashier"],
  "fee-setup": ["school_admin", "accountant"],
  bills: ["school_admin", "accountant"],
  payments: ["school_admin", "accountant", "cashier"],
  receipts: ["school_admin", "headteacher", "accountant", "cashier"],
  plans: ["school_admin", "headteacher", "accountant"],
  reminders: ["school_admin", "accountant", "cashier"],
  arrears: ["school_admin", "headteacher", "accountant"],
  reports: ["school_admin", "headteacher", "accountant"],
  settings: ["school_admin"]
};

export function isStaff(role?: string | null): role is Exclude<Role, "parent" | "platform_admin"> {
  return staffRoles.includes(role as Role);
}

export function canManageSettings(role?: string | null) {
  return settingsMutationRoles.includes(role as Role);
}

export function canManageBilling(role?: string | null) {
  return billingMutationRoles.includes(role as Role);
}

export function canRecordPayment(role?: string | null) {
  return financeMutationRoles.includes(role as Role);
}

export function canManagePaymentPlans(role?: string | null) {
  return billingMutationRoles.includes(role as Role);
}

export function canSendReminders(role?: string | null) {
  return ["school_admin", "accountant", "cashier"].includes(role ?? "");
}

export function canViewAdminNav(role: string | null | undefined, key: AdminNavKey) {
  if (!role) return false;
  return navAccess[key].includes(role as Role);
}

export function roleHome(role?: string | null) {
  if (role === "platform_admin") return "/platform/schools";
  if (role === "parent") return "/parent/overview";
  if (role === "cashier") return "/admin/payments/new";
  return "/admin/dashboard";
}
