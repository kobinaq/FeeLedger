import { CollectionChart } from "@/components/charts/collection-chart";
import { Card, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Td, Th, Table } from "@/components/ui/table";
import { requireAdminProfile } from "@/features/auth/server";
import { familyBalance, getBills, getFamilies, getPayments, termStats } from "@/features/reports/queries";
import { getPaymentPlans } from "@/features/payment-plans/queries";
import { money, percent, shortDate } from "@/lib/utils";

export default async function DashboardPage() {
  const profile = await requireAdminProfile();
  const [bills, payments, families, plansData] = await Promise.all([
    getBills(profile.school_id!),
    getPayments(profile.school_id!),
    getFamilies(profile.school_id!),
    getPaymentPlans(profile.school_id!)
  ]);
  const stats = termStats(bills, payments);
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
  const installments = plansData.plans.flatMap((plan) => plan.payment_plan_installments ?? []);
  return (
    <>
      <PageHeader title="Dashboard" action="Record Payment" />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Expected Fees This Term" value={money(stats.expected)} hint="All published student bills." />
        <StatCard label="Collected So Far" value={money(stats.collected)} hint={`This is ${percent(stats.rate)} of expected fees.`} />
        <StatCard label="Outstanding Balance" value={money(stats.outstanding)} hint="Amount still owed by families." />
        <StatCard label="Collection Rate" value={percent(stats.rate)} hint="Collected against expected fees." />
        <StatCard label="Today's Collection" value={money(stats.today)} hint="Payments recorded today." />
        <StatCard label="Active Payment Plans" value={String(plansData.plans.filter((plan) => plan.status === "active").length)} hint="Families paying in instalments." />
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardTitle>Recent Payments</CardTitle>
          <Table>
            <thead><tr><Th>Date</Th><Th>Method</Th><Th>Reference</Th><Th>Amount</Th></tr></thead>
            <tbody>{payments.slice(0, 5).map((payment) => <tr key={payment.id}><Td>{shortDate(payment.payment_date)}</Td><Td>{payment.method}</Td><Td>{payment.provider_reference ?? payment.reference_number}</Td><Td>{money(payment.amount)}</Td></tr>)}</tbody>
          </Table>
        </Card>
        <Card>
          <CardTitle>Families with Highest Outstanding Balances</CardTitle>
          <div className="mt-4 space-y-3">{highBalanceFamilies.slice(0, 5).map(({ family, balance, students }) => <div key={family.id} className="flex items-center justify-between rounded-md bg-slate-50 p-3"><div><p className="font-semibold">{family.guardian_full_name}</p><p className="text-sm text-slate-500">{students} child{students === 1 ? "" : "ren"}</p></div><p className="font-bold">{money(balance)}</p></div>)}</div>
        </Card>
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardTitle>Payment Plans Due Soon</CardTitle>
          <div className="mt-4 space-y-3">{installments.map((item) => <div key={item.id} className="flex justify-between rounded-md border border-slate-100 p-3"><span>{shortDate(item.due_date)}</span><strong>{money(item.amount)}</strong></div>)}</div>
        </Card>
        <Card>
          <CardTitle>Collection Chart</CardTitle>
          <CollectionChart data={classRows.filter((row) => row.expected > 0).slice(0, 8)} />
        </Card>
      </section>
    </>
  );
}
