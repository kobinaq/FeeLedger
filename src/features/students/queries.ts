import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
