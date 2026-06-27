import type { Role } from "@/types";

export const staffRoles: Role[] = ["school_admin", "headteacher", "accountant", "cashier"];
export const financeMutationRoles: Role[] = ["school_admin", "accountant", "cashier"];
export const billingMutationRoles: Role[] = ["school_admin", "accountant"];
export const settingsMutationRoles: Role[] = ["school_admin"];
export const readOnlyStaffRoles: Role[] = ["headteacher"];

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

export function roleHome(role?: string | null) {
  if (role === "platform_admin") return "/platform/schools";
  if (role === "parent") return "/parent/overview";
  if (role === "cashier") return "/admin/payments/new";
  return "/admin/dashboard";
}
