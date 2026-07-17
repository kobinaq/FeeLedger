import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
