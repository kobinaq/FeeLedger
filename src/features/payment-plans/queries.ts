import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { familyBalance } from "@/lib/money";
import type { Tables } from "@/types/database";

export { familyBalance };

export type PaymentPlanSummary = Tables<"payment_plans"> & {
  families: Tables<"families"> | null;
  payment_plan_installments: Tables<"payment_plan_installments">[];
};

export type PaymentPlanFamily = Tables<"families"> & {
  bills: Tables<"bills">[];
};

export async function getPaymentPlans(schoolId: string) {
  noStore();
  const supabase = await createClient();
  const [{ data: plans, error: planError }, { data: families, error: familyError }] = await Promise.all([
    supabase
      .from("payment_plans")
      .select("*, families(*), payment_plan_installments(*)")
      .eq("school_id", schoolId)
      .order("created_at", { ascending: false }),
    supabase.from("families").select("*, bills(*)").eq("school_id", schoolId).order("guardian_full_name")
  ]);
  const error = planError ?? familyError;
  if (error) throw new Error(error.message);
  return { plans: (plans ?? []) as PaymentPlanSummary[], families: (families ?? []) as PaymentPlanFamily[] };
}
