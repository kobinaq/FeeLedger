import Link from "next/link";
import { CollectionChart } from "@/components/charts/collection-chart";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Td, Th, Table } from "@/components/ui/table";
import { canRecordPayment } from "@/features/auth/permissions";
import { requireAdminNav } from "@/features/auth/server";
import { getDashboardSnapshot } from "@/features/reports/queries";
import { money, percent, shortDate } from "@/lib/utils";

export default async function DashboardPage() {
  const profile = await requireAdminNav("dashboard");
  const snapshot = await getDashboardSnapshot(profile.school_id!);
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Track collection health, payment risk, and the next account-office actions."
        action={
          canRecordPayment(profile.role) ? (
            <Link href="/admin/payments/new">
              <Button>Record Payment</Button>
            </Link>
          ) : undefined
        }
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard label="Expected Fees This Term" value={money(snapshot.expected)} hint="All published student bills." />
        <StatCard label="Collected So Far" value={money(snapshot.collected)} hint={`This is ${percent(snapshot.rate)} of expected fees.`} />
        <StatCard label="Outstanding Balance" value={money(snapshot.outstanding)} hint="Amount still owed by families." />
        <StatCard label="Collection Rate" value={percent(snapshot.rate)} hint="Collected against expected fees." />
        <StatCard label="Today's Collection" value={money(snapshot.today)} hint="Payments recorded today." />
        <StatCard label="Active Payment Plans" value={String(snapshot.activePlans)} hint="Families paying in instalments." />
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardTitle>Recent Payments</CardTitle>
          <Table>
            <thead>
              <tr>
                <Th>Date</Th>
                <Th>Method</Th>
                <Th>Reference</Th>
                <Th>Amount</Th>
              </tr>
            </thead>
            <tbody>
              {snapshot.recentPayments.map((payment) => (
                <tr key={payment.id}>
                  <Td>{shortDate(payment.payment_date)}</Td>
                  <Td>{payment.method}</Td>
                  <Td>{payment.provider_reference ?? payment.reference_number}</Td>
                  <Td>{money(payment.amount)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
        <Card>
          <CardTitle>Families with Highest Outstanding Balances</CardTitle>
          <div className="mt-4 space-y-3">
            {snapshot.highBalanceFamilies.map(({ family, balance, students }) => (
              <div key={family.id} className="flex items-center justify-between rounded-md bg-slate-50 p-3">
                <div>
                  <p className="font-semibold">{family.guardian_full_name}</p>
                  <p className="text-sm text-slate-500">
                    {students} child{students === 1 ? "" : "ren"}
                  </p>
                </div>
                <p className="font-bold">{money(balance)}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardTitle>Payment Plans Due Soon</CardTitle>
          <div className="mt-4 space-y-3">
            {snapshot.upcomingInstallments.length === 0 ? (
              <p className="text-sm text-slate-500">No open instalments.</p>
            ) : (
              snapshot.upcomingInstallments.map((item) => (
                <div key={item.id} className="flex justify-between rounded-md border border-slate-100 p-3">
                  <span>{shortDate(item.due_date)}</span>
                  <strong>{money(item.amount)}</strong>
                </div>
              ))
            )}
          </div>
        </Card>
        <Card>
          <CardTitle>Collection Chart</CardTitle>
          <CollectionChart data={snapshot.classRows} />
        </Card>
      </section>
    </>
  );
}
