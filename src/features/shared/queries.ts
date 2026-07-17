import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type FamilySummary = Tables<"families"> & {
  students: Array<Tables<"students"> & { classes?: Tables<"classes"> | null }>;
  bills: Array<Tables<"bills"> & { students?: Tables<"students"> | null; bill_items?: Tables<"bill_items">[] }>;
  payments: Tables<"payments">[];
  receipts: Tables<"receipts">[];
};

export type FamilyDetail = FamilySummary & {
  reminders: Tables<"reminders">[];
  payment_plans: Array<Tables<"payment_plans"> & {
    payment_plan_installments: Tables<"payment_plan_installments">[];
  }>;
};

export type BillDetail = Tables<"bills"> & {
  students: (Tables<"students"> & { classes?: Tables<"classes"> | null }) | null;
  families: Tables<"families"> | null;
  terms: Tables<"terms"> | null;
  bill_items: Tables<"bill_items">[];
  payments: Tables<"payments">[];
  receipts: Tables<"receipts">[];
};

export type PaymentPlanSummary = Tables<"payment_plans"> & {
  families: Tables<"families"> | null;
  payment_plan_installments: Tables<"payment_plan_installments">[];
};

export type PaymentPlanFamily = Tables<"families"> & {
  bills: Tables<"bills">[];
};

export async function getCurrentSchool(schoolId: string) {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase.from("schools").select("*").eq("id", schoolId).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getCurrentTerm(schoolId: string) {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase.from("terms").select("*").eq("school_id", schoolId).eq("is_current", true).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getClasses(schoolId: string) {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase.from("classes").select("*").eq("school_id", schoolId).order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getFamilies(schoolId: string) {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("families")
    .select("*, students(*), bills(*), payments(*), receipts(*)")
    .eq("school_id", schoolId)
    .order("guardian_full_name");
  if (error) throw new Error(error.message);
  return (data ?? []) as FamilySummary[];
}

export async function getFamilyById(schoolId: string, familyId: string) {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("families")
    .select("*, students(*), bills(*), payments(*), receipts(*), reminders(*), payment_plans(*, payment_plan_installments(*))")
    .eq("school_id", schoolId)
    .eq("id", familyId)
    .single();
  if (error) throw new Error(error.message);
  return data as FamilyDetail;
}

export async function getParentFamily(familyId: string) {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("families")
    .select("*, students(*, classes(*)), bills(*, students(*)), payments(*), receipts(*), reminders(*), payment_plans(*, payment_plan_installments(*))")
    .eq("id", familyId)
    .single();
  if (error) throw new Error(error.message);
  return data as FamilyDetail;
}

export async function getStudents(schoolId: string) {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("students")
    .select("*, classes(*), families(*)")
    .eq("school_id", schoolId)
    .order("last_name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getFeeSetup(schoolId: string) {
  noStore();
  const supabase = await createClient();
  const [{ data: feeItems, error: feeError }, { data: feeRules, error: ruleError }, { data: terms, error: termError }, { data: classes, error: classError }] =
    await Promise.all([
      supabase.from("fee_items").select("*").eq("school_id", schoolId).order("name"),
      supabase.from("fee_rules").select("*, classes(*), fee_items(*)").eq("school_id", schoolId).order("due_date"),
      supabase.from("terms").select("*").eq("school_id", schoolId).order("starts_on", { ascending: false }),
      supabase.from("classes").select("*").eq("school_id", schoolId).order("sort_order")
    ]);
  const error = feeError ?? ruleError ?? termError ?? classError;
  if (error) throw new Error(error.message);
  return { feeItems: feeItems ?? [], feeRules: feeRules ?? [], terms: terms ?? [], classes: classes ?? [] };
}

export async function getBills(schoolId: string) {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bills")
    .select("*, students(*, classes(*)), families(*), terms(*), bill_items(*)")
    .eq("school_id", schoolId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getBillById(schoolId: string, billId: string) {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bills")
    .select("*, students(*), families(*), terms(*), bill_items(*), payments(*), receipts(*)")
    .eq("school_id", schoolId)
    .eq("id", billId)
    .single();
  if (error) throw new Error(error.message);
  return data as BillDetail;
}

export async function getPayments(schoolId: string) {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("payments")
    .select("*, families(*), students(*), bills(*), receipts(*)")
    .eq("school_id", schoolId)
    .order("payment_date", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getReceipts(schoolId: string) {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("receipts")
    .select("*, families(*), students(*), payments(*)")
    .eq("school_id", schoolId)
    .order("receipt_date", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getReminders(schoolId: string) {
  noStore();
  const supabase = await createClient();
  const [{ data: templates, error: templateError }, { data: reminders, error: reminderError }, { data: families, error: familyError }] = await Promise.all([
    supabase.from("reminder_templates").select("*").eq("school_id", schoolId).order("name"),
    supabase.from("reminders").select("*, families(*)").eq("school_id", schoolId).order("created_at", { ascending: false }),
    supabase.from("families").select("*").eq("school_id", schoolId).order("guardian_full_name")
  ]);
  const error = templateError ?? reminderError ?? familyError;
  if (error) throw new Error(error.message);
  return { templates: templates ?? [], reminders: reminders ?? [], families: families ?? [] };
}

export async function getPaymentPlans(schoolId: string) {
  noStore();
  const supabase = await createClient();
  const [{ data: plans, error: planError }, { data: families, error: familyError }] = await Promise.all([
    supabase.from("payment_plans").select("*, families(*), payment_plan_installments(*)").eq("school_id", schoolId).order("created_at", { ascending: false }),
    supabase.from("families").select("*, bills(*)").eq("school_id", schoolId).order("guardian_full_name")
  ]);
  const error = planError ?? familyError;
  if (error) throw new Error(error.message);
  return { plans: (plans ?? []) as PaymentPlanSummary[], families: (families ?? []) as PaymentPlanFamily[] };
}

export async function getPlatformSchools() {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schools")
    .select("*, profiles(id), students(id), subscriptions(*)")
    .order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export function familyBalance(family: { bills?: Array<{ total_amount: number; paid_amount: number }> }) {
  return (family.bills ?? []).reduce((total, bill) => total + Number(bill.total_amount) - Number(bill.paid_amount), 0);
}

export function familyPaid(family: { bills?: Array<{ paid_amount: number }> }) {
  return (family.bills ?? []).reduce((total, bill) => total + Number(bill.paid_amount), 0);
}

export function termStats(bills: Array<{ total_amount: number; paid_amount: number }>, payments: Array<{ amount: number; payment_date: string }>) {
  const expected = bills.reduce((total, bill) => total + Number(bill.total_amount), 0);
  const collected = bills.reduce((total, bill) => total + Number(bill.paid_amount), 0);
  const todayIso = new Date().toISOString().slice(0, 10);
  const today = payments.filter((payment) => payment.payment_date === todayIso).reduce((total, payment) => total + Number(payment.amount), 0);
  return { expected, collected, outstanding: expected - collected, rate: expected ? (collected / expected) * 100 : 0, today };
}
