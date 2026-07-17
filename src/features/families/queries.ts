import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { familyBalance, familyPaid } from "@/lib/money";
import type { Tables } from "@/types/database";

export { familyBalance, familyPaid };

export type FamilySummary = Tables<"families"> & {
  students: Tables<"students">[];
  bills: Tables<"bills">[];
  payments: Tables<"payments">[];
  receipts: Tables<"receipts">[];
};

export type FamilyDetail = FamilySummary & {
  reminders: Tables<"reminders">[];
  payment_plans: Array<
    Tables<"payment_plans"> & {
      payment_plan_installments: Tables<"payment_plan_installments">[];
    }
  >;
};

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
    .select("*, students(*), bills(*), payments(*), receipts(*), reminders(*), payment_plans(*, payment_plan_installments(*))")
    .eq("id", familyId)
    .single();
  if (error) throw new Error(error.message);
  return data as FamilyDetail;
}
