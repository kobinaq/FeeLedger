"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canManageBilling } from "@/features/auth/permissions";
import { requireAdminProfile } from "@/features/auth/server";
import { writeAuditLog } from "@/features/shared/audit";
import { value } from "@/features/shared/form-data";
import { familySchema } from "@/lib/validators/forms";

export async function createFamilyAction(formData: FormData) {
  const profile = await requireAdminProfile();
  if (!canManageBilling(profile.role) || !profile.school_id) redirect("/admin/families?error=permission");
  const parsed = familySchema.parse({
    guardianName: value(formData, "guardianName"),
    phone: value(formData, "phone"),
    email: value(formData, "email"),
    address: value(formData, "address"),
    notes: value(formData, "notes")
  });
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("families")
    .insert({
      school_id: profile.school_id,
      guardian_full_name: parsed.guardianName,
      phone: parsed.phone,
      email: parsed.email,
      address: parsed.address,
      notes: parsed.notes
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  await writeAuditLog("created_family", "families", data.id);
  revalidatePath("/admin/families");
  redirect(`/admin/families/${data.id}`);
}
