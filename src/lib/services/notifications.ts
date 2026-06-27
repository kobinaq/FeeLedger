import type { Channel, ReminderStatus } from "@/types";

export type MockNotificationResult = {
  provider: "mock-sms" | "mock-email";
  channel: Channel;
  status: ReminderStatus;
  providerId: string;
};

export async function sendMockNotification(channel: Channel, recipient: string, message: string): Promise<MockNotificationResult[]> {
  const id = `${Date.now()}-${recipient.slice(-4)}`;
  const providers = channel === "both" ? ["mock-sms", "mock-email"] : channel === "sms" ? ["mock-sms"] : ["mock-email"];
  return providers.map((provider) => ({
    provider: provider as "mock-sms" | "mock-email",
    channel,
    status: message.includes("fail") ? "failed" : "sent",
    providerId: `${provider}-${id}`
  }));
}
