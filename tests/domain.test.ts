import { describe, expect, it } from "vitest";
import { calculateBillStatus, canRole, interpolateReminder, validateInstallmentTotal } from "@/lib/services/domain";

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
    expect(interpolateReminder("Dear {{guardian_name}}, balance is GHS {{balance}}.", { guardian_name: "Ama", balance: 250 })).toBe("Dear Ama, balance is GHS 250.");
  });

  it("enforces role permissions", () => {
    expect(canRole("cashier", "payment")).toBe(true);
    expect(canRole("cashier", "billing")).toBe(false);
    expect(canRole("headteacher", "settings")).toBe(false);
    expect(canRole("school_admin", "settings")).toBe(true);
  });
});
