import crypto from "node:crypto";

export type PaystackChannel = "card" | "bank" | "bank_transfer" | "ussd" | "qr" | "mobile_money";

export type PaystackInitializeInput = {
  email: string;
  amount: number;
  currency: string;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, string | number | boolean | null>;
};

export type PaystackInitializeResult = {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
  raw: unknown;
};

export type PaystackVerification = {
  status: "success" | "failed" | "abandoned" | "pending";
  reference: string;
  amount: number;
  currency: string;
  channel: string | null;
  fees: number | null;
  paidAt: string | null;
  raw: unknown;
};

const PAYSTACK_BASE_URL = "https://api.paystack.co";

export function amountToSubunit(amount: number) {
  return Math.round(amount * 100);
}

export function amountFromSubunit(amount: number) {
  return Math.round(amount) / 100;
}

export function createPaystackReference(prefix = "FL") {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
}

export function verifyPaystackSignature(rawBody: string, signature: string | null, secret = process.env.PAYSTACK_SECRET_KEY ?? "") {
  if (!signature || !secret) return false;
  const digest = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  if (digest.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

function secretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  return key;
}

async function paystackFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });
  const payload = await response.json();
  if (!response.ok || !payload.status) {
    throw new Error(payload.message ?? "Paystack request failed.");
  }
  return payload as T;
}

export async function initializePaystackTransaction(input: PaystackInitializeInput): Promise<PaystackInitializeResult> {
  const payload = await paystackFetch<{
    data: { authorization_url: string; access_code: string; reference: string };
  }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: amountToSubunit(input.amount),
      currency: input.currency,
      reference: input.reference,
      callback_url: input.callbackUrl,
      channels: ["card", "mobile_money", "bank_transfer"],
      metadata: input.metadata
    })
  });
  return {
    authorizationUrl: payload.data.authorization_url,
    accessCode: payload.data.access_code,
    reference: payload.data.reference,
    raw: payload
  };
}

export async function verifyPaystackTransaction(reference: string): Promise<PaystackVerification> {
  const payload = await paystackFetch<{
    data: {
      status: "success" | "failed" | "abandoned" | "pending";
      reference: string;
      amount: number;
      currency: string;
      channel?: string;
      fees?: number;
      paid_at?: string;
    };
  }>(`/transaction/verify/${encodeURIComponent(reference)}`);
  return {
    status: payload.data.status,
    reference: payload.data.reference,
    amount: amountFromSubunit(payload.data.amount),
    currency: payload.data.currency,
    channel: payload.data.channel ?? null,
    fees: typeof payload.data.fees === "number" ? amountFromSubunit(payload.data.fees) : null,
    paidAt: payload.data.paid_at ?? null,
    raw: payload
  };
}
