import { requireAdminProfile } from "@/features/auth/server";
import { familyBalance, getBills, getFamilies, termStats } from "@/features/reports/queries";
import { getPaymentPlans } from "@/features/payment-plans/queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { ExportButton } from "@/components/ui/export-button";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Td, Th, Table } from "@/components/ui/table";
import { money } from "@/lib/utils";

export default async function ArrearsPage() {
  const profile = await requireAdminProfile();
  const [families, bills, planData] = await Promise.all([
    getFamilies(profile.school_id!),
    getBills(profile.school_id!),
    getPaymentPlans(profile.school_id!)
  ]);
  const stats = termStats(bills, []);
  const top = families
    .map((family) => ({ family, students: family.students.length, balance: familyBalance(family) }))
    .filter((row) => row.balance > 0)
    .sort((a, b) => b.balance - a.balance);
  const overdueBills = bills.filter(
    (bill) =>
      bill.status === "overdue" ||
      (bill.due_date < new Date().toISOString().slice(0, 10) && Number(bill.total_amount) > Number(bill.paid_amount))
  );
  const overdueAmount = overdueBills.reduce((sum, bill) => sum + Number(bill.total_amount) - Number(bill.paid_amount), 0);
  const activePlans = planData.plans.filter((plan) => ["active", "on_track", "missed_payment"].includes(plan.status)).length;
  const classRows = Object.values(
    bills.reduce<Record<string, { className: string; expected: number; collected: number; outstanding: number }>>((acc, bill) => {
      const className = bill.students?.classes?.name ?? "Class";
      acc[className] ??= { className, expected: 0, collected: 0, outstanding: 0 };
      acc[className].expected += bill.total_amount;
      acc[className].collected += bill.paid_amount;
      acc[className].outstanding += bill.total_amount - bill.paid_amount;
      return acc;
    }, {})
  );

  return (
    <>
      <PageHeader title="Arrears" description="See who still owes fees and which classes need follow-up." />
      <div className="mb-5 flex flex-wrap gap-3">
        <ExportButton label="Export Arrears List" href="/api/exports?type=arrears" />
      </div>
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Amount Still Owed" value={money(stats.outstanding)} hint="Open balances across families." />
        <StatCard label="Overdue Balance" value={money(overdueAmount)} hint="Past due dates, still unpaid." />
        <StatCard label="Parents to Follow Up" value={String(top.length)} hint="Families with a balance." />
        <StatCard label="Families on Payment Plans" value={String(activePlans)} hint="Active instalment agreements." />
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card>
          <CardTitle>Families with Highest Balances</CardTitle>
          <Table>
            <thead>
              <tr>
                <Th>Family</Th>
                <Th>Children</Th>
                <Th>Amount Still Owed</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {top.map(({ family, students, balance }) => (
                <tr key={family.id}>
                  <Td>{family.guardian_full_name}</Td>
                  <Td>{students}</Td>
                  <Td>{money(balance)}</Td>
                  <Td>
                    <Badge value={balance > 0 ? "follow_up" : "paid"} />
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
        <Card>
          <CardTitle>Classes with Highest Balances</CardTitle>
          <Table>
            <thead>
              <tr>
                <Th>Class</Th>
                <Th>Expected</Th>
                <Th>Collected</Th>
                <Th>Outstanding</Th>
              </tr>
            </thead>
            <tbody>
              {classRows
                .filter((r) => r.expected > 0)
                .map((row) => (
                  <tr key={row.className}>
                    <Td>{row.className}</Td>
                    <Td>{money(row.expected)}</Td>
                    <Td>{money(row.collected)}</Td>
                    <Td>{money(row.outstanding)}</Td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Card>
      </section>
    </>
  );
}
