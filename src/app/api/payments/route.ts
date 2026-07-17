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

  const body = await request.json().catch(() => null);
  const parsed = paymentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { data, error } = await supabase.rpc("record_payment_transaction", {
    p_school_id: profile.school_id,
    p_family_id: parsed.data.familyId,
    p_student_id: parsed.data.studentId || null,
    p_bill_id: parsed.data.billId || null,
    p_amount: parsed.data.amount,
    p_method: parsed.data.method,
    p_reference_number: parsed.data.reference,
    p_payment_date: parsed.data.paymentDate ?? new Date().toISOString().slice(0, 10),
    p_notes: parsed.data.notes ?? null,
    p_recorded_by: profile.id,
    p_source: "manual"
  });

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, paymentId: data });
}
