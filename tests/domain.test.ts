import crypto from "node:crypto";
import { describe, expect, it } from "vitest";
import { calculateBillStatus, canRole, interpolateReminder, validateInstallmentTotal } from "../src/lib/services/domain";
import { amountFromSubunit, amountToSubunit, createPaystackReference, verifyPaystackSignature } from "../src/lib/services/paystack";
import { reminderDeliveryStatus } from "../src/lib/services/notifications";
import { canManageBilling, canRecordPayment, canSendReminders, roleHome } from "../src/features/auth/permissions";
import { DEMO_PASSWORD, demoAccountByRole, demoAccounts } from "../src/lib/demo/accounts";

describe("FeeLedger domain rules", () => {
  it("calculates bill payment status", () => {
    expect(calculateBillStatus(1000, 0)).toBe("published");
    expect(calculateBillStatus(1000, 500)).toBe("partially_paid");
    expect(calculateBillStatus(1000, 1000)).toBe("paid");
  });

  it("validates payment plan totals", () => {
    expect(validateInstallmentTotal(300, [{ amount: 100 }, { amount: 200 }])).toBe(true);
    expect(validateInstallmentTotal(300, [{ amount: 100 }, { amount: 150 }])).toBe(false);
  });

  it("interpolates reminder templates", () => {
    expect(interpolateReminder("Dear {{guardian_name}}, balance is GHS {{balance}}.", { guardian_name: "Ama", balance: 250 })).toBe(
      "Dear Ama, balance is GHS 250."
    );
  });

  it("enforces role permissions", () => {
    expect(canRole("cashier", "payment")).toBe(true);
    expect(canRole("cashier", "billing")).toBe(false);
    expect(canRole("headteacher", "settings")).toBe(false);
    expect(canRole("school_admin", "settings")).toBe(true);
  });

  it("routes authenticated users to the right home page", () => {
    expect(roleHome("platform_admin")).toBe("/platform/schools");
    expect(roleHome("parent")).toBe("/parent/overview");
    expect(roleHome("cashier")).toBe("/admin/payments/new");
    expect(roleHome("school_admin")).toBe("/admin/dashboard");
  });

  it("limits manual payment recording to finance roles", () => {
    expect(canRecordPayment("school_admin")).toBe(true);
    expect(canRecordPayment("accountant")).toBe(true);
    expect(canRecordPayment("cashier")).toBe(true);
    expect(canRecordPayment("headteacher")).toBe(false);
    expect(canRecordPayment("parent")).toBe(false);
  });

  it("limits billing and reminder permissions", () => {
    expect(canManageBilling("cashier")).toBe(false);
    expect(canManageBilling("accountant")).toBe(true);
    expect(canSendReminders("cashier")).toBe(true);
    expect(canSendReminders("headteacher")).toBe(false);
  });

  it("exposes demo accounts for live walkthroughs", () => {
    expect(demoAccounts.length).toBeGreaterThanOrEqual(6);
    expect(demoAccountByRole("cashier")?.email).toBe("cashier@gracefield.test");
    expect(DEMO_PASSWORD).toBe("demo12345");
  });

  it("converts Paystack currency subunits", () => {
    expect(amountToSubunit(125.5)).toBe(12550);
    expect(amountFromSubunit(12550)).toBe(125.5);
  });

  it("creates FeeLedger Paystack references", () => {
    expect(createPaystackReference("FL")).toMatch(/^FL-\d+-[a-f0-9]{12}$/);
  });

  it("verifies Paystack webhook signatures", () => {
    const secret = "sk_test_secret";
    const body = JSON.stringify({ event: "charge.success" });
    const signature = crypto.createHmac("sha512", secret).update(body).digest("hex");
    expect(verifyPaystackSignature(body, signature, secret)).toBe(true);
    expect(verifyPaystackSignature(body, "bad-signature", secret)).toBe(false);
  });

  it("summarizes reminder delivery status", () => {
    expect(reminderDeliveryStatus([{ provider: "sms", channel: "sms", status: "sent", providerId: "1" }])).toBe("sent");
    expect(reminderDeliveryStatus([{ provider: "sms", channel: "sms", status: "failed", providerId: "1" }])).toBe("failed");
    expect(
      reminderDeliveryStatus([
        { provider: "sms", channel: "sms", status: "sent", providerId: "1" },
        { provider: "email", channel: "email", status: "failed", providerId: "2" }
      ])
    ).toBe("partial");
  });
});
