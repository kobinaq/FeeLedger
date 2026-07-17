"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canManageSettings } from "@/features/auth/permissions";
import { requireAdminProfile } from "@/features/auth/server";
import { writeAuditLog } from "@/features/shared/audit";
import { value } from "@/features/shared/form-data";
import { schoolSchema } from "@/lib/validators/forms";

export async function updateSchoolSettingsAction(formData: FormData) {
  const profile = await requireAdminProfile();
  if (!canManageSettings(profile.role) || !profile.school_id) redirect("/admin/settings?error=permission");
  const parsed = schoolSchema.parse({
    name: value(formData, "name"),
    address: value(formData, "address"),
    phone: value(formData, "phone"),
    email: value(formData, "email"),
    currency: value(formData, "currency") ?? "GHS"
  });
  const supabase = await createClient();
  const { error } = await supabase.from("schools").update(parsed).eq("id", profile.school_id);
  if (error) throw new Error(error.message);
  await writeAuditLog("updated_school_settings", "schools", profile.school_id);
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}
