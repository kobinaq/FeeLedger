import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
  const { data, error } = await supabase
    .from("terms")
    .select("*")
    .eq("school_id", schoolId)
    .eq("is_current", true)
    .maybeSingle();
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
