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

export type NotificationProviderStatus = {
  email: { mode: "mock" | "resend" | "unconfigured"; detail: string };
  sms: { mode: "mock" | "http" | "unconfigured"; detail: string };
};

const FETCH_TIMEOUT_MS = 12_000;

function isMockEmailEnabled() {
  return process.env.MOCK_EMAIL_PROVIDER === "enabled" || process.env.MOCK_EMAIL_PROVIDER === "true";
}

function isMockSmsEnabled() {
  return process.env.MOCK_SMS_PROVIDER === "enabled" || process.env.MOCK_SMS_PROVIDER === "true";
}

export function getNotificationProviderStatus(): NotificationProviderStatus {
  const emailKey = Boolean(process.env.RESEND_API_KEY);
  const emailFrom = Boolean(process.env.EMAIL_FROM);
  const smsUrl = Boolean(process.env.SMS_PROVIDER_URL);
  const smsKey = Boolean(process.env.SMS_PROVIDER_API_KEY);

  let email: NotificationProviderStatus["email"];
  if (isMockEmailEnabled()) {
    email = { mode: "mock", detail: "MOCK_EMAIL_PROVIDER is enabled." };
  } else if (emailKey && emailFrom) {
    email = { mode: "resend", detail: "Resend is configured." };
  } else {
    email = { mode: "unconfigured", detail: "Set RESEND_API_KEY and EMAIL_FROM (or enable MOCK_EMAIL_PROVIDER)." };
  }

  let sms: NotificationProviderStatus["sms"];
  if (isMockSmsEnabled()) {
    sms = { mode: "mock", detail: "MOCK_SMS_PROVIDER is enabled." };
  } else if (smsUrl && smsKey) {
    sms = { mode: "http", detail: `HTTP SMS via ${process.env.SMS_PROVIDER ?? "generic_http"}.` };
  } else {
    sms = { mode: "unconfigured", detail: "Set SMS_PROVIDER_URL and SMS_PROVIDER_API_KEY (or enable MOCK_SMS_PROVIDER)." };
  }

  return { email, sms };
}

export async function sendMockNotification(channel: Channel, recipient: string, message: string): Promise<NotificationResult[]> {
  const id = `${Date.now()}-${recipient.slice(-4)}`;
  const providers = channel === "both" ? ["mock-sms", "mock-email"] : channel === "sms" ? ["mock-sms"] : ["mock-email"];
  return providers.map((provider) => ({
    provider,
    channel: provider.endsWith("sms") ? "sms" : "email",
    status: message.toLowerCase().includes("fail") ? "failed" : "sent",
    providerId: `${provider}-${id}`,
    detail: message.toLowerCase().includes("fail") ? "Mock provider forced failure." : undefined
  }));
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = FETCH_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function withRetry<T>(fn: () => Promise<T>, attempts = 2): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i === attempts - 1) break;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Notification provider request failed.");
}

async function sendEmail(recipient: NotificationRecipient, message: string): Promise<NotificationResult> {
  if (!recipient.email) {
    return {
      provider: "email",
      channel: "email",
      status: "failed",
      providerId: "missing-email",
      detail: "Family has no email address."
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from || isMockEmailEnabled()) {
    return (await sendMockNotification("email", recipient.familyId, message))[0];
  }

  try {
    const response = await withRetry(() =>
      fetchWithTimeout("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: recipient.email,
          subject: "School fee reminder",
          text: `Dear ${recipient.guardianName},\n\n${message}\n\n— Accounts Office`
        })
      })
    );
    const payload = (await response.json().catch(() => ({}))) as { id?: string; message?: string };
    return {
      provider: "resend",
      channel: "email",
      status: response.ok ? "sent" : "failed",
      providerId: typeof payload.id === "string" ? payload.id : `resend-${Date.now()}`,
      detail: response.ok ? undefined : payload.message ?? `Email provider returned ${response.status}.`
    };
  } catch (error) {
    return {
      provider: "resend",
      channel: "email",
      status: "failed",
      providerId: `resend-error-${Date.now()}`,
      detail: error instanceof Error ? error.message : "Email provider request failed."
    };
  }
}

async function sendSms(recipient: NotificationRecipient, message: string): Promise<NotificationResult> {
  if (!recipient.phone?.trim()) {
    return {
      provider: "sms",
      channel: "sms",
      status: "failed",
      providerId: "missing-phone",
      detail: "Family has no phone number."
    };
  }

  const url = process.env.SMS_PROVIDER_URL;
  const apiKey = process.env.SMS_PROVIDER_API_KEY;
  const sender = process.env.SMS_SENDER_ID ?? "FeeLedger";
  if (!url || !apiKey || isMockSmsEnabled()) {
    return (await sendMockNotification("sms", recipient.familyId, message))[0];
  }

  try {
    const response = await withRetry(() =>
      fetchWithTimeout(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          to: recipient.phone,
          from: sender,
          message,
          family_id: recipient.familyId,
          guardian_name: recipient.guardianName
        })
      })
    );
    const payload = (await response.json().catch(() => ({}))) as {
      id?: string;
      message_id?: string;
      message?: string;
    };
    return {
      provider: process.env.SMS_PROVIDER ?? "generic_http",
      channel: "sms",
      status: response.ok ? "sent" : "failed",
      providerId: String(payload.id ?? payload.message_id ?? `sms-${Date.now()}`),
      detail: response.ok ? undefined : payload.message ?? `SMS provider returned ${response.status}.`
    };
  } catch (error) {
    return {
      provider: process.env.SMS_PROVIDER ?? "generic_http",
      channel: "sms",
      status: "failed",
      providerId: `sms-error-${Date.now()}`,
      detail: error instanceof Error ? error.message : "SMS provider request failed."
    };
  }
}

export async function sendNotification(channel: Channel, recipient: NotificationRecipient, message: string) {
  const jobs =
    channel === "both"
      ? [sendSms(recipient, message), sendEmail(recipient, message)]
      : channel === "sms"
        ? [sendSms(recipient, message)]
        : [sendEmail(recipient, message)];
  return Promise.all(jobs);
}

export function reminderDeliveryStatus(results: NotificationResult[]): ReminderStatus {
  if (results.length === 0) return "failed";
  if (results.every((result) => result.status === "sent")) return "sent";
  if (results.some((result) => result.status === "sent")) return "partial";
  return "failed";
}
