import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
