import { NextResponse } from "next/server";
import { sendMockNotification } from "@/lib/services/notifications";
import type { Channel } from "@/types";

export async function POST(request: Request) {
  const body = await request.json();
  const channel = (body.channel ?? "sms") as Channel;
  const recipient = body.recipient ?? "demo";
  const message = body.message ?? "FeeLedger reminder";
  const result = await sendMockNotification(channel, recipient, message);
  return NextResponse.json({ ok: true, status: "sent", result });
}
