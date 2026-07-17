"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { canRecordPayment } from "@/features/auth/permissions";
import { requireAdminProfile, requireParentProfile } from "@/features/auth/server";
import { value } from "@/features/shared/form-data";
import { billOutstanding } from "@/lib/money";
import { createPaystackReference, initializePaystackTransaction } from "@/lib/services/paystack";
import { onlinePaymentSchema, paymentSchema } from "@/lib/validators/forms";
import type { Tables } from "@/types/database";

export async function recordPaymentAction(formData: FormData) {
  const profile = await requireAdminProfile();
  if (!canRecordPayment(profile.role) || !profile.school_id) redirect("/admin/payments/new?error=permission");
  const parsed = paymentSchema.parse({
    familyId: value(formData, "familyId"),
    studentId: value(formData, "studentId"),
    billId: value(formData, "billId"),
    amount: value(formData, "amount"),
    method: value(formData, "method"),
    reference: value(formData, "reference"),
    paymentDate: value(formData, "paymentDate"),
    notes: value(formData, "notes")
  });
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("record_payment_transaction", {
    p_school_id: profile.school_id,
    p_family_id: parsed.familyId,
    p_student_id: parsed.studentId || null,
    p_bill_id: parsed.billId || null,
    p_amount: parsed.amount,
    p_method: parsed.method,
    p_reference_number: parsed.reference,
    p_payment_date: parsed.paymentDate ?? new Date().toISOString().slice(0, 10),
    p_notes: parsed.notes ?? null,
    p_recorded_by: profile.id,
    p_source: "manual"
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/payments");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/payment-plans");
  revalidatePath(`/admin/families/${parsed.familyId}`);
  redirect(`/admin/payments/new?success=${data}`);
}

export async function initiateParentPaystackPaymentAction(formData: FormData) {
  const profile = await requireParentProfile();
  const parsed = onlinePaymentSchema.parse({
    amount: value(formData, "amount"),
    billId: value(formData, "billId"),
    studentId: value(formData, "studentId"),
    paymentPlanId: value(formData, "paymentPlanId")
  });
  const supabase = await createClient();
  const [{ data: family, error: familyError }, { data: school, error: schoolError }] = await Promise.all([
    supabase.from("families").select("*, bills(*)").eq("id", profile.family_id!).single(),
    supabase.from("schools").select("*").eq("id", profile.school_id!).single()
  ]);
  if (familyError || !family) throw new Error(familyError?.message ?? "Family not found.");
  if (schoolError || !school) throw new Error(schoolError?.message ?? "School not found.");

  const bills = (family.bills ?? []) as Tables<"bills">[];
  const outstanding = bills.reduce((total, bill) => total + billOutstanding(bill), 0);
  if (parsed.amount > outstanding) throw new Error("Payment amount cannot be more than the outstanding balance.");
  if (parsed.billId) {
    const bill = bills.find((item) => item.id === parsed.billId);
    if (!bill) throw new Error("Bill not found for this family.");
    if (parsed.amount > billOutstanding(bill)) throw new Error("Payment amount cannot be more than the selected bill balance.");
  }

  const reference = createPaystackReference("FL");
  const callbackUrl =
    process.env.PAYSTACK_CALLBACK_URL ??
    `${process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? "http://localhost:3000"}/parent/payments/paystack/callback`;
  const metadata = {
    school_id: profile.school_id,
    family_id: profile.family_id,
    bill_id: parsed.billId ?? null,
    payment_plan_id: parsed.paymentPlanId ?? null,
    source: "FeeLedger"
  };
  const { error } = await supabase.from("online_payment_sessions").insert({
    school_id: profile.school_id!,
    family_id: profile.family_id!,
    student_id: parsed.studentId || null,
    bill_id: parsed.billId || null,
    payment_plan_id: parsed.paymentPlanId || null,
    amount: parsed.amount,
    currency: school.currency,
    provider: "paystack",
    provider_reference: reference,
    status: "pending",
    metadata,
    created_by: profile.id
  });
  if (error) throw new Error(error.message);
  const checkout = await initializePaystackTransaction({
    email: family.email ?? profile.email,
    amount: parsed.amount,
    currency: school.currency,
    reference,
    callbackUrl,
    metadata
  });
  const { error: updateError } = await createServiceClient()
    .from("online_payment_sessions")
    .update({
      provider_access_code: checkout.accessCode,
      authorization_url: checkout.authorizationUrl,
      status: "initialized",
      provider_response: checkout.raw
    })
    .eq("provider_reference", reference);
  if (updateError) throw new Error(updateError.message);
  redirect(checkout.authorizationUrl);
}
