/** Pure money/balance helpers — no I/O. */

export function familyBalance(family: { bills?: Array<{ total_amount: number; paid_amount: number }> }) {
  return (family.bills ?? []).reduce((total, bill) => total + Number(bill.total_amount) - Number(bill.paid_amount), 0);
}

export function familyPaid(family: { bills?: Array<{ paid_amount: number }> }) {
  return (family.bills ?? []).reduce((total, bill) => total + Number(bill.paid_amount), 0);
}

export function billOutstanding(bill: { total_amount: number; paid_amount: number }) {
  return Math.max(0, Number(bill.total_amount) - Number(bill.paid_amount));
}

export function termStats(
  bills: Array<{ total_amount: number; paid_amount: number }>,
  payments: Array<{ amount: number; payment_date: string }>
) {
  const expected = bills.reduce((total, bill) => total + Number(bill.total_amount), 0);
  const collected = bills.reduce((total, bill) => total + Number(bill.paid_amount), 0);
  const todayIso = new Date().toISOString().slice(0, 10);
  const today = payments
    .filter((payment) => payment.payment_date === todayIso)
    .reduce((total, payment) => total + Number(payment.amount), 0);
  return {
    expected,
    collected,
    outstanding: expected - collected,
    rate: expected ? (collected / expected) * 100 : 0,
    today
  };
}

/**
 * Allocate a payment across open installments (earliest due first).
 * Mirrors the DB trigger cascade logic for unit testing.
 */
export function allocateToInstallments(
  amount: number,
  installments: Array<{ id: string; amount: number; paid_amount: number; due_date: string; status: string }>
) {
  let remaining = amount;
  const updates: Array<{ id: string; paid_amount: number; status: "paid" | "partially_paid" | "overdue" | "pending" }> = [];
  const today = new Date().toISOString().slice(0, 10);

  for (const item of installments.filter((i) => i.status !== "paid").sort((a, b) => a.due_date.localeCompare(b.due_date))) {
    if (remaining <= 0) break;
    const open = Number(item.amount) - Number(item.paid_amount);
    if (open <= 0) continue;
    const apply = Math.min(open, remaining);
    const paid_amount = Number(item.paid_amount) + apply;
    let status: "paid" | "partially_paid" | "overdue" | "pending" = "pending";
    if (paid_amount >= Number(item.amount)) status = "paid";
    else if (paid_amount > 0) status = "partially_paid";
    else if (item.due_date < today) status = "overdue";
    updates.push({ id: item.id, paid_amount, status });
    remaining -= apply;
  }

  return { updates, remaining };
}
