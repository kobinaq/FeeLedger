import { NextResponse } from "next/server";
import { reminderDeliveryStatus, sendNotification } from "@/lib/services/notifications";
import type { Channel } from "@/types";

export async function POST(request: Request) {
  const body = await request.json();
  const channel = (body.channel ?? "sms") as Channel;
  const recipient = {
    familyId: body.familyId ?? "api-recipient",
    guardianName: body.guardianName ?? "Guardian",
    email: body.email ?? null,
    phone: body.phone ?? body.recipient ?? ""
  };
  const message = body.message ?? "FeeLedger reminder";
  const result = await sendNotification(channel, recipient, message);
  return NextResponse.json({ ok: true, status: reminderDeliveryStatus(result), result });
}
