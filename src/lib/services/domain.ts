import type { Role } from "@/types";
import { canManageBilling, canManagePaymentPlans, canManageSettings, canRecordPayment, canSendReminders } from "../../features/auth/permissions";

export function calculateBillStatus(total: number, paid: number) {
  if (paid >= total) return "paid";
  if (paid > 0) return "partially_paid";
  return "published";
}

export function validateInstallmentTotal(total: number, installments: Array<{ amount: number }>) {
  const sum = installments.reduce((value, item) => value + item.amount, 0);
  return Math.abs(sum - total) <= 0.01;
}

export function interpolateReminder(template: string, values: Record<string, string | number>) {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: string) => String(values[key] ?? ""));
}

export function canRole(role: Role, action: "settings" | "billing" | "payment" | "plan" | "reminder") {
  if (action === "settings") return canManageSettings(role);
  if (action === "billing") return canManageBilling(role);
  if (action === "payment") return canRecordPayment(role);
  if (action === "plan") return canManagePaymentPlans(role);
  return canSendReminders(role);
}
