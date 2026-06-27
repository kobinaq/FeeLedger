import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { paymentSchema } from "@/lib/validators/forms";
import { canRecordPayment } from "@/features/auth/permissions";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (!profile || !canRecordPayment(profile.role) || !profile.school_id) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json();
  const parsed = paymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("payments")
    .insert({
      school_id: profile.school_id,
      family_id: parsed.data.familyId,
      student_id: parsed.data.studentId || null,
      bill_id: parsed.data.billId || null,
      amount: parsed.data.amount,
      method: parsed.data.method,
      reference_number: parsed.data.reference,
      payment_date: parsed.data.paymentDate ?? new Date().toISOString().slice(0, 10),
      notes: parsed.data.notes,
      recorded_by: profile.id
    })
    .select("id")
    .single();
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, paymentId: data.id });
}
