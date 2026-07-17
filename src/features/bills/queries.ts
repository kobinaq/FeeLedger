import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database";

export type BillDetail = Tables<"bills"> & {
  students: Tables<"students"> | null;
  families: Tables<"families"> | null;
  terms: Tables<"terms"> | null;
  bill_items: Tables<"bill_items">[];
  payments: Tables<"payments">[];
  receipts: Tables<"receipts">[];
};

export async function getBills(schoolId: string) {
  noStore();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bills")
    .select("*, students(*, classes(*)), families(*), terms(*)")
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
