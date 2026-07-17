"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canSendReminders } from "@/features/auth/permissions";
import { requireAdminProfile } from "@/features/auth/server";
import { writeAuditLog } from "@/features/shared/audit";
import { value } from "@/features/shared/form-data";
import { reminderDeliveryStatus, sendNotification } from "@/lib/services/notifications";
import { reminderSchema } from "@/lib/validators/forms";

export async function sendReminderAction(formData: FormData) {
  const profile = await requireAdminProfile();
  if (!canSendReminders(profile.role) || !profile.school_id) redirect("/admin/reminders?error=permission");
  const parsed = reminderSchema.parse({
    familyId: value(formData, "familyId"),
    templateId: value(formData, "templateId"),
    channel: value(formData, "channel"),
    message: value(formData, "message")
  });
  const supabase = await createClient();
  const { data: family, error: familyError } = await supabase
    .from("families")
    .select("*")
    .eq("id", parsed.familyId)
    .eq("school_id", profile.school_id)
    .single();
  if (familyError || !family) throw new Error(familyError?.message ?? "Family not found.");
  const providerResponse = await sendNotification(
    parsed.channel,
    {
      familyId: family.id,
      guardianName: family.guardian_full_name,
      email: family.email,
      phone: family.phone
    },
    parsed.message
  );
  const { data, error } = await supabase
    .from("reminders")
    .insert({
      school_id: profile.school_id,
      family_id: parsed.familyId,
      reminder_template_id: parsed.templateId || null,
      channel: parsed.channel,
      status: reminderDeliveryStatus(providerResponse),
      message: parsed.message,
      provider_response: providerResponse,
      sent_at: new Date().toISOString(),
      created_by: profile.id
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  await writeAuditLog("sent_reminder", "reminders", data.id);
  revalidatePath("/admin/reminders");
  redirect("/admin/reminders?sent=1");
}
