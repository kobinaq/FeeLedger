import { CollectionChart } from "@/components/charts/collection-chart";
import { Card, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Td, Th, Table } from "@/components/ui/table";
import { getCollectionByClass, getDashboardStats, getHighestBalanceFamilies } from "@/lib/data-access";
import { payments, paymentPlanInstallments } from "@/lib/demo-data";
import { money, percent, shortDate } from "@/lib/utils";

export default function DashboardPage() {
  const stats = getDashboardStats();
  return (
    <>
      <PageHeader title="Dashboard" description="A simple view of fee collection progress for the current term." action="Record Payment" />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Expected Fees This Term" value={money(stats.expected)} hint="All published student bills." />
        <StatCard label="Collected So Far" value={money(stats.collected)} hint={`This is ${percent(stats.rate)} of expected fees.`} />
        <StatCard label="Outstanding Balance" value={money(stats.outstanding)} hint="Amount still owed by families." />
        <StatCard label="Collection Rate" value={percent(stats.rate)} hint="Collected against expected fees." />
        <StatCard label="Today's Collection" value={money(stats.today)} hint="Payments recorded today." />
        <StatCard label="Active Payment Plans" value={String(stats.activePlans)} hint="Families paying in instalments." />
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardTitle>Recent Payments</CardTitle>
          <Table>
            <thead><tr><Th>Date</Th><Th>Method</Th><Th>Reference</Th><Th>Amount</Th></tr></thead>
            <tbody>{payments.slice(-5).reverse().map((payment) => <tr key={payment.id}><Td>{shortDate(payment.paymentDate)}</Td><Td>{payment.method}</Td><Td>{payment.reference}</Td><Td>{money(payment.amount)}</Td></tr>)}</tbody>
          </Table>
        </Card>
        <Card>
          <CardTitle>Families with Highest Outstanding Balances</CardTitle>
          <div className="mt-4 space-y-3">{getHighestBalanceFamilies().slice(0, 5).map(({ family, balance, students }) => <div key={family.id} className="flex items-center justify-between rounded-md bg-slate-50 p-3"><div><p className="font-semibold">{family.guardianName}</p><p className="text-sm text-slate-500">{students} child{students === 1 ? "" : "ren"}</p></div><p className="font-bold">{money(balance)}</p></div>)}</div>
        </Card>
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardTitle>Payment Plans Due Soon</CardTitle>
          <div className="mt-4 space-y-3">{paymentPlanInstallments.map((item) => <div key={item.id} className="flex justify-between rounded-md border border-slate-100 p-3"><span>{shortDate(item.dueDate)}</span><strong>{money(item.amount)}</strong></div>)}</div>
        </Card>
        <Card>
          <CardTitle>Collection Chart</CardTitle>
          <CollectionChart data={getCollectionByClass().filter((row) => row.expected > 0).slice(0, 8)} />
        </Card>
      </section>
    </>
  );
}
