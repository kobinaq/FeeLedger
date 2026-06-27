import { getBill, getFamilyBalance } from "@/lib/data-access";
import type { Payment } from "@/types";

export function calculateBillStatus(total: number, paid: number) {
  if (paid <= 0) return "published";
  if (paid >= total) return "paid";
  return "partially_paid";
}

export async function recordPayment(input: Pick<Payment, "familyId" | "studentId" | "billId" | "amount" | "method" | "reference" | "notes">) {
  const bill = getBill(input.billId);
  const remaining = Math.max(0, getFamilyBalance(input.familyId) - input.amount);
  const receiptNumber = `RCPT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  return {
    ok: true,
    receiptNumber,
    amount: input.amount,
    remaining,
    billStatus: bill ? calculateBillStatus(bill.totalAmount, bill.paidAmount + input.amount) : "partially_paid"
  };
}
