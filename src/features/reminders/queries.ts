import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getReminders(schoolId: string) {
  noStore();
  const supabase = await createClient();
  const [{ data: templates, error: templateError }, { data: reminders, error: reminderError }, { data: families, error: familyError }] =
    await Promise.all([
      supabase.from("reminder_templates").select("*").eq("school_id", schoolId).order("name"),
      supabase.from("reminders").select("*, families(*)").eq("school_id", schoolId).order("created_at", { ascending: false }),
      supabase.from("families").select("*").eq("school_id", schoolId).order("guardian_full_name")
    ]);
  const error = templateError ?? reminderError ?? familyError;
  if (error) throw new Error(error.message);
  return { templates: templates ?? [], reminders: reminders ?? [], families: families ?? [] };
}
