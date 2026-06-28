import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyAndRecordPaystackPayment } from "@/features/payments/paystack-processing";
import { verifyPaystackSignature } from "@/lib/services/paystack";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");
  const signatureValid = verifyPaystackSignature(rawBody, signature);
  const supabase = createServiceClient();
  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    await supabase.from("payment_webhook_events").insert({
      provider: "paystack",
      payload: { rawBody },
      signature_valid: signatureValid,
      processing_status: "failed",
      processing_error: "Invalid JSON payload.",
      processed_at: new Date().toISOString()
    });
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const reference = payload?.data?.reference ?? null;
  const { data: event } = await supabase
    .from("payment_webhook_events")
    .insert({
      provider: "paystack",
      event_type: payload?.event ?? null,
      provider_reference: reference,
      payload,
      signature_valid: signatureValid,
      processing_status: signatureValid ? "received" : "failed",
      processing_error: signatureValid ? null : "Invalid Paystack signature."
    })
    .select("id")
    .single();

  if (!signatureValid) return NextResponse.json({ ok: false }, { status: 401 });
  if (payload?.event !== "charge.success" || !reference) {
    if (event) {
      await supabase
        .from("payment_webhook_events")
        .update({ processing_status: "ignored", processed_at: new Date().toISOString() })
        .eq("id", event.id);
    }
    return NextResponse.json({ ok: true });
  }

  try {
    await verifyAndRecordPaystackPayment(reference);
    if (event) {
      await supabase
        .from("payment_webhook_events")
        .update({ processing_status: "processed", processed_at: new Date().toISOString() })
        .eq("id", event.id);
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (event) {
      await supabase
        .from("payment_webhook_events")
        .update({
          processing_status: "failed",
          processing_error: error instanceof Error ? error.message : "Webhook processing failed.",
          processed_at: new Date().toISOString()
        })
        .eq("id", event.id);
    }
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
