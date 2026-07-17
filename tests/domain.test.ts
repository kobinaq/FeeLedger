import crypto from "node:crypto";
import { describe, expect, it } from "vitest";
import { calculateBillStatus, canRole, interpolateReminder, validateInstallmentTotal } from "../src/lib/services/domain";
import { amountFromSubunit, amountToSubunit, createPaystackReference, verifyPaystackSignature } from "../src/lib/services/paystack";
import {
  getNotificationProviderStatus,
  reminderDeliveryStatus,
  sendMockNotification
} from "../src/lib/services/notifications";
import { canRecordPayment, canViewAdminNav, roleHome } from "../src/features/auth/permissions";
import {
  appMetadataFromProfile,
  decodeClaimsCookie,
  encodeClaimsCookie
} from "../src/features/auth/session-claims";
import { allocateToInstallments, billOutstanding, familyBalance, familyPaid, termStats } from "../src/lib/money";

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

  it("scopes admin navigation by role", () => {
    expect(canViewAdminNav("cashier", "payments")).toBe(true);
    expect(canViewAdminNav("cashier", "settings")).toBe(false);
    expect(canViewAdminNav("cashier", "fee-setup")).toBe(false);
    expect(canViewAdminNav("headteacher", "reports")).toBe(true);
    expect(canViewAdminNav("headteacher", "bills")).toBe(false);
    expect(canViewAdminNav("accountant", "students")).toBe(true);
    expect(canViewAdminNav("school_admin", "settings")).toBe(true);
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
    expect(reminderDeliveryStatus([])).toBe("failed");
    expect(reminderDeliveryStatus([{ provider: "sms", channel: "sms", status: "sent", providerId: "1" }])).toBe("sent");
    expect(reminderDeliveryStatus([{ provider: "sms", channel: "sms", status: "failed", providerId: "1" }])).toBe("failed");
    expect(
      reminderDeliveryStatus([
        { provider: "sms", channel: "sms", status: "sent", providerId: "1" },
        { provider: "email", channel: "email", status: "failed", providerId: "2" }
      ])
    ).toBe("partial");
  });

  it("supports mock notification success and forced failure", async () => {
    const ok = await sendMockNotification("both", "family-1", "Please pay fees");
    expect(ok).toHaveLength(2);
    expect(ok.every((r) => r.status === "sent")).toBe(true);
    const fail = await sendMockNotification("sms", "family-1", "force fail this message");
    expect(fail[0]?.status).toBe("failed");
  });

  it("reports notification provider configuration status", () => {
    const previousEmail = process.env.MOCK_EMAIL_PROVIDER;
    const previousSms = process.env.MOCK_SMS_PROVIDER;
    process.env.MOCK_EMAIL_PROVIDER = "enabled";
    process.env.MOCK_SMS_PROVIDER = "enabled";
    const status = getNotificationProviderStatus();
    expect(status.email.mode).toBe("mock");
    expect(status.sms.mode).toBe("mock");
    process.env.MOCK_EMAIL_PROVIDER = previousEmail;
    process.env.MOCK_SMS_PROVIDER = previousSms;
  });

  it("computes family balances and term stats", () => {
    const family = {
      bills: [
        { total_amount: 1000, paid_amount: 400 },
        { total_amount: 500, paid_amount: 500 }
      ]
    };
    expect(familyBalance(family)).toBe(600);
    expect(familyPaid(family)).toBe(900);
    expect(billOutstanding({ total_amount: 1000, paid_amount: 250 })).toBe(750);

    const today = new Date().toISOString().slice(0, 10);
    const stats = termStats(family.bills, [
      { amount: 100, payment_date: today },
      { amount: 50, payment_date: "2000-01-01" }
    ]);
    expect(stats.expected).toBe(1500);
    expect(stats.collected).toBe(900);
    expect(stats.outstanding).toBe(600);
    expect(stats.today).toBe(100);
    expect(stats.rate).toBeCloseTo(60);
  });

  it("round-trips middleware session claims cookies bound to user id", () => {
    const claims = {
      userId: "user-1",
      role: "cashier" as const,
      schoolId: "school-1",
      familyId: null
    };
    const encoded = encodeClaimsCookie(claims);
    expect(decodeClaimsCookie(encoded, "user-1")).toEqual(claims);
    expect(decodeClaimsCookie(encoded, "other-user")).toBeNull();
    expect(decodeClaimsCookie("not-valid", "user-1")).toBeNull();
  });

  it("builds JWT app_metadata from profile rows", () => {
    expect(
      appMetadataFromProfile({
        role: "parent",
        school_id: "s1",
        family_id: "f1"
      })
    ).toEqual({
      feeledger_role: "parent",
      feeledger_school_id: "s1",
      feeledger_family_id: "f1"
    });
  });

  it("cascades payment allocation across installments", () => {
    const result = allocateToInstallments(250, [
      { id: "a", amount: 100, paid_amount: 0, due_date: "2026-01-01", status: "pending" },
      { id: "b", amount: 100, paid_amount: 0, due_date: "2026-02-01", status: "pending" },
      { id: "c", amount: 100, paid_amount: 0, due_date: "2026-03-01", status: "pending" }
    ]);
    expect(result.remaining).toBe(0);
    expect(result.updates).toEqual([
      { id: "a", paid_amount: 100, status: "paid" },
      { id: "b", paid_amount: 100, status: "paid" },
      { id: "c", paid_amount: 50, status: "partially_paid" }
    ]);
  });

  it("does not reallocate already paid installments", () => {
    const result = allocateToInstallments(40, [
      { id: "a", amount: 100, paid_amount: 100, due_date: "2026-01-01", status: "paid" },
      { id: "b", amount: 100, paid_amount: 20, due_date: "2026-02-01", status: "partially_paid" }
    ]);
    expect(result.updates).toEqual([{ id: "b", paid_amount: 60, status: "partially_paid" }]);
    expect(result.remaining).toBe(0);
  });
});
