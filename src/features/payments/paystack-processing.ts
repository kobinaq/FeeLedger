import { createServiceClient } from "@/lib/supabase/server";
import { verifyPaystackTransaction, type PaystackVerification } from "@/lib/services/paystack";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function paystackMethod(channel: string | null) {
  if (channel === "mobile_money") return "Paystack mobile money";
  if (channel === "bank_transfer") return "Paystack bank transfer";
  if (channel === "card") return "Paystack card";
  return "Paystack";
}

async function markSession(reference: string, verification: PaystackVerification) {
  const supabase = createServiceClient();
  const success = verification.status === "success";
  const { error } = await supabase
    .from("online_payment_sessions")
    .update({
      status: success ? "success" : verification.status,
      provider_channel: verification.channel,
      provider_response: verification.raw,
      verified_at: new Date().toISOString(),
      paid_at: success ? verification.paidAt ?? new Date().toISOString() : null
    })
    .eq("provider_reference", reference);
  if (error) throw new Error(error.message);
}

export async function verifyAndRecordPaystackPayment(reference: string) {
  const supabase = createServiceClient();
  const { data: session, error: sessionError } = await supabase
    .from("online_payment_sessions")
    .select("*")
    .eq("provider", "paystack")
    .eq("provider_reference", reference)
    .single();
  if (sessionError || !session) throw new Error(sessionError?.message ?? "Payment session not found.");

  const verification = await verifyPaystackTransaction(reference);
  await markSession(reference, verification);

  if (verification.status !== "success") return { status: verification.status, paymentId: null };
  if (verification.currency !== session.currency) throw new Error("Verified currency does not match the payment session.");
  if (Math.abs(Number(session.amount) - verification.amount) > 0.01) throw new Error("Verified amount does not match the payment session.");

  const { data: existing, error: existingError } = await supabase
    .from("payments")
    .select("id")
    .eq("provider", "paystack")
    .eq("provider_reference", reference)
    .maybeSingle();
  if (existingError) throw new Error(existingError.message);
  if (existing) return { status: "success", paymentId: existing.id };

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      school_id: session.school_id,
      family_id: session.family_id,
      student_id: session.student_id,
      bill_id: session.bill_id,
      amount: verification.amount,
      method: paystackMethod(verification.channel),
      reference_number: reference,
      payment_date: todayIso(),
      notes: "Automatically recorded from verified Paystack payment.",
      source: "paystack",
      provider: "paystack",
      provider_reference: reference,
      provider_channel: verification.channel,
      provider_fees: verification.fees,
      verified_at: new Date().toISOString()
    })
    .select("id")
    .single();
  if (paymentError) throw new Error(paymentError.message);
  return { status: "success", paymentId: payment.id };
}
