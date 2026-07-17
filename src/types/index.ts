import type { Database } from "@/types/database";

/** Canonical role / status enums — sourced from the database type map. */
export type Role = Database["public"]["Enums"]["app_role"];
export type BillStatus = Database["public"]["Enums"]["bill_status"];
export type PlanStatus = Database["public"]["Enums"]["plan_status"];
export type InstallmentStatus = Database["public"]["Enums"]["installment_status"];
export type ReminderStatus = Database["public"]["Enums"]["reminder_status"];
export type Channel = Database["public"]["Enums"]["reminder_channel"];

export type Tables = Database["public"]["Tables"];
export type DbEnums = Database["public"]["Enums"];
export type DbFunctions = Database["public"]["Functions"];

/** App-level profile shape used in UI helpers (camelCase convenience). */
export type ProfileView = {
  id: string;
  schoolId?: string | null;
  familyId?: string | null;
  fullName: string;
  email: string;
  role: Role;
};
