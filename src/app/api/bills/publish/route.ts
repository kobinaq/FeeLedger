import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canManageBilling } from "@/features/auth/permissions";
import { z } from "zod";

const bodySchema = z.object({
  billIds: z.array(z.string().uuid()).min(1, "Select at least one draft bill to publish.")
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile || !canManageBilling(profile.role) || !profile.school_id) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { error } = await supabase
    .from("bills")
    .update({ status: "published", published_at: new Date().toISOString() })
    .eq("school_id", profile.school_id)
    .eq("status", "draft")
    .in("id", parsed.data.billIds);

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
