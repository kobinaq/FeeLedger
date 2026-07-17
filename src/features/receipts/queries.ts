import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
