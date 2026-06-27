import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canManageBilling } from "@/features/auth/permissions";

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
  const body = await request.json().catch(() => ({}));
  const billIds = Array.isArray(body.billIds) ? body.billIds.map(String) : [];
  let query = supabase.from("bills").update({ status: "published", published_at: new Date().toISOString() }).eq("school_id", profile.school_id);
  if (billIds.length > 0) query = query.in("id", billIds);
  else query = query.eq("status", "draft");
  const { error } = await query;
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
