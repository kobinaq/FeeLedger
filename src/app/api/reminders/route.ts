import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { canSendReminders } from "@/features/auth/permissions";
import { reminderDeliveryStatus, sendNotification } from "@/lib/services/notifications";
import type { Channel } from "@/types";

const bodySchema = z.object({
  familyId: z.string().uuid(),
  channel: z.enum(["sms", "email", "both"]).default("sms"),
  message: z.string().min(1).max(2000),
  templateId: z.string().uuid().optional()
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile || !canSendReminders(profile.role) || !profile.school_id) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { data: family, error: familyError } = await supabase
    .from("families")
    .select("*")
    .eq("id", parsed.data.familyId)
    .eq("school_id", profile.school_id)
    .single();
  if (familyError || !family) {
    return NextResponse.json({ ok: false, error: "Family not found for this school." }, { status: 404 });
  }

  const channel = parsed.data.channel as Channel;
  const providerResponse = await sendNotification(
    channel,
    {
      familyId: family.id,
      guardianName: family.guardian_full_name,
      email: family.email,
      phone: family.phone
    },
    parsed.data.message
  );

  const { data: reminder, error } = await supabase
    .from("reminders")
    .insert({
      school_id: profile.school_id,
      family_id: family.id,
      reminder_template_id: parsed.data.templateId ?? null,
      channel,
      status: reminderDeliveryStatus(providerResponse),
      message: parsed.data.message,
      provider_response: providerResponse,
      sent_at: new Date().toISOString(),
      created_by: profile.id
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, reminderId: reminder.id, status: reminderDeliveryStatus(providerResponse), result: providerResponse });
}
