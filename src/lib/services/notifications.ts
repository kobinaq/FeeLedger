import type { Channel, ReminderStatus } from "@/types";

export type NotificationRecipient = {
  familyId: string;
  guardianName: string;
  email: string | null;
  phone: string;
};

export type NotificationResult = {
  provider: string;
  channel: "sms" | "email";
  status: ReminderStatus;
  providerId: string;
  detail?: string;
};

export async function sendMockNotification(channel: Channel, recipient: string, message: string): Promise<NotificationResult[]> {
  const id = `${Date.now()}-${recipient.slice(-4)}`;
  const providers = channel === "both" ? ["mock-sms", "mock-email"] : channel === "sms" ? ["mock-sms"] : ["mock-email"];
  return providers.map((provider) => ({
    provider,
    channel: provider.endsWith("sms") ? "sms" : "email",
    status: message.includes("fail") ? "failed" : "sent",
    providerId: `${provider}-${id}`
  }));
}

async function sendEmail(recipient: NotificationRecipient, message: string): Promise<NotificationResult> {
  if (!recipient.email) return { provider: "email", channel: "email", status: "failed", providerId: "missing-email", detail: "Family has no email address." };
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from || process.env.MOCK_EMAIL_PROVIDER === "enabled") {
    return (await sendMockNotification("email", recipient.familyId, message))[0];
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: recipient.email,
      subject: "School fee reminder",
      text: `Dear ${recipient.guardianName},\n\n${message}`
    })
  });
  const payload = await response.json().catch(() => ({}));
  return {
    provider: "resend",
    channel: "email",
    status: response.ok ? "sent" : "failed",
    providerId: typeof payload.id === "string" ? payload.id : `resend-${Date.now()}`,
    detail: response.ok ? undefined : payload.message ?? "Email provider request failed."
  };
}

async function sendSms(recipient: NotificationRecipient, message: string): Promise<NotificationResult> {
  const url = process.env.SMS_PROVIDER_URL;
  const apiKey = process.env.SMS_PROVIDER_API_KEY;
  const sender = process.env.SMS_SENDER_ID ?? "FeeLedger";
  if (!url || !apiKey || process.env.MOCK_SMS_PROVIDER === "enabled") {
    return (await sendMockNotification("sms", recipient.familyId, message))[0];
  }
  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ to: recipient.phone, from: sender, message })
  });
  const payload = await response.json().catch(() => ({}));
  return {
    provider: process.env.SMS_PROVIDER ?? "generic_http",
    channel: "sms",
    status: response.ok ? "sent" : "failed",
    providerId: String(payload.id ?? payload.message_id ?? `sms-${Date.now()}`),
    detail: response.ok ? undefined : payload.message ?? "SMS provider request failed."
  };
}

export async function sendNotification(channel: Channel, recipient: NotificationRecipient, message: string) {
  const jobs = channel === "both" ? [sendSms(recipient, message), sendEmail(recipient, message)] : channel === "sms" ? [sendSms(recipient, message)] : [sendEmail(recipient, message)];
  return Promise.all(jobs);
}

export function reminderDeliveryStatus(results: NotificationResult[]): ReminderStatus {
  if (results.every((result) => result.status === "sent")) return "sent";
  if (results.some((result) => result.status === "sent")) return "partial";
  return "failed";
}
