import { bills, feeItems, payments, receipts } from "@/lib/demo-data";
import { getCollectionByClass } from "@/lib/data-access";

export function getDailyCollectionReport() {
  const daily = payments.filter((payment) => payment.paymentDate === "2026-01-27");
  return {
    total: daily.reduce((sum, payment) => sum + payment.amount, 0),
    rows: daily,
    methodBreakdown: Object.entries(
      daily.reduce<Record<string, number>>((acc, payment) => {
        acc[payment.method] = (acc[payment.method] ?? 0) + payment.amount;
        return acc;
      }, {})
    ).map(([method, amount]) => ({ method, amount }))
  };
}

export function getTermSummary() {
  const expected = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
  const collected = bills.reduce((sum, bill) => sum + bill.paidAmount, 0);
  return { expected, collected, outstanding: expected - collected, rate: expected ? (collected / expected) * 100 : 0 };
}

export function getClassArrearsReport() {
  return getCollectionByClass().filter((row) => row.expected > 0);
}

export function getFeeItemReport() {
  return feeItems.map((item, index) => ({
    feeItem: item.name,
    expected: 5000 + index * 1400,
    collected: 2600 + index * 900
  }));
}

export function getReceiptReport() {
  return receipts;
}
