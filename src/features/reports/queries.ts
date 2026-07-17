import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getBills } from "@/features/bills/queries";
import { familyBalance, familyPaid, getFamilies } from "@/features/families/queries";
import { getPayments } from "@/features/payments/queries";
import { getPaymentPlans } from "@/features/payment-plans/queries";
import { getReceipts } from "@/features/receipts/queries";
import { termStats } from "@/lib/money";

export { familyBalance, familyPaid, getBills, getFamilies, getPayments, getReceipts, termStats };

export type DashboardSnapshot = {
  expected: number;
  collected: number;
  outstanding: number;
  rate: number;
  today: number;
  activePlans: number;
  recentPayments: Awaited<ReturnType<typeof getPayments>>;
  highBalanceFamilies: Array<{
    family: Awaited<ReturnType<typeof getFamilies>>[number];
    balance: number;
    students: number;
  }>;
  classRows: Array<{ className: string; expected: number; collected: number }>;
  upcomingInstallments: Array<{ id: string; due_date: string; amount: number }>;
};

/**
 * Dashboard read model: parallel domain queries + light aggregation.
 * Prefer school_collection_snapshot RPC for headline totals when available.
 */
export async function getDashboardSnapshot(schoolId: string): Promise<DashboardSnapshot> {
  noStore();
  const [bills, payments, families, plansData, rpcSnapshot] = await Promise.all([
    getBills(schoolId),
    getPayments(schoolId),
    getFamilies(schoolId),
    getPaymentPlans(schoolId),
    getSchoolCollectionSnapshot(schoolId)
  ]);

  const countableBills = bills.filter((bill) =>
    ["published", "partially_paid", "paid", "overdue"].includes(bill.status)
  );
  const stats = rpcSnapshot ?? termStats(countableBills, payments);
  const highBalanceFamilies = families
    .map((family) => ({ family, balance: familyBalance(family), students: family.students.length }))
    .sort((a, b) => b.balance - a.balance);

  const classRows = Object.values(
    bills.reduce<Record<string, { className: string; expected: number; collected: number }>>((acc, bill) => {
      const student = bill.students as { classes?: { name?: string } } | null;
      const className = student?.classes?.name ?? "Class";
      acc[className] ??= { className, expected: 0, collected: 0 };
      acc[className].expected += Number(bill.total_amount);
      acc[className].collected += Number(bill.paid_amount);
      return acc;
    }, {})
  );

  const upcomingInstallments = plansData.plans
    .flatMap((plan) => plan.payment_plan_installments ?? [])
    .filter((item) => item.status !== "paid")
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
    .slice(0, 8)
    .map((item) => ({ id: item.id, due_date: item.due_date, amount: Number(item.amount) }));

  return {
    expected: stats.expected,
    collected: stats.collected,
    outstanding: stats.outstanding,
    rate: "rate" in stats && typeof stats.rate === "number" ? stats.rate : stats.expected ? (stats.collected / stats.expected) * 100 : 0,
    today: stats.today,
    activePlans: rpcSnapshot?.activePlans ?? plansData.plans.filter((plan) => ["active", "on_track", "missed_payment"].includes(plan.status)).length,
    recentPayments: payments.slice(0, 5),
    highBalanceFamilies: highBalanceFamilies.slice(0, 5),
    classRows: classRows.filter((row) => row.expected > 0).slice(0, 8),
    upcomingInstallments
  };
}

async function getSchoolCollectionSnapshot(schoolId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("school_collection_snapshot", { p_school_id: schoolId });
    if (error || !data) return null;
    const row = (Array.isArray(data) ? data[0] : data) as {
      expected: number;
      collected: number;
      outstanding: number;
      today_collected: number;
      active_plans: number;
    } | null;
    if (!row) return null;
    return {
      expected: Number(row.expected),
      collected: Number(row.collected),
      outstanding: Number(row.outstanding),
      today: Number(row.today_collected),
      activePlans: Number(row.active_plans),
      rate: Number(row.expected) ? (Number(row.collected) / Number(row.expected)) * 100 : 0
    };
  } catch {
    return null;
  }
}
