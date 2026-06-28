import { Card, CardTitle } from "@/components/ui/card";
import { ExportButton } from "@/components/ui/export-button";
import { Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SimpleReportTable } from "@/components/reports/simple-report-table";
import { requireAdminProfile } from "@/features/auth/server";
import { getBills, getPayments, getReceipts, termStats } from "@/features/reports/queries";
import { money, percent } from "@/lib/utils";

export default async function ReportsPage() {
  const profile = await requireAdminProfile();
  const [bills, payments, receipts] = await Promise.all([getBills(profile.school_id!), getPayments(profile.school_id!), getReceipts(profile.school_id!)]);
  const term = termStats(bills, payments);
  const today = new Date().toISOString().slice(0, 10);
  const dailyRows = payments.filter((payment) => payment.payment_date === today);
  const daily = dailyRows.reduce((sum, payment) => sum + payment.amount, 0);
  const methodBreakdown = Object.entries(dailyRows.reduce<Record<string, number>>((acc, payment) => {
    acc[payment.method] = (acc[payment.method] ?? 0) + payment.amount;
    return acc;
  }, {})).map(([method, amount]) => ({ method, amount }));
  const classRows = Object.values(bills.reduce<Record<string, { className: string; expected: number; collected: number; outstanding: number }>>((acc, bill) => {
    const className = bill.students?.classes?.name ?? "Class";
    acc[className] ??= { className, expected: 0, collected: 0, outstanding: 0 };
    acc[className].expected += bill.total_amount;
    acc[className].collected += bill.paid_amount;
    acc[className].outstanding += bill.total_amount - bill.paid_amount;
    return acc;
  }, {}));
  const feeRows = Object.values((bills.flatMap((bill) => bill.bill_items ?? [])).reduce<Record<string, { feeItem: string; expected: number; collected: number }>>((acc, item) => {
    acc[item.description] ??= { feeItem: item.description, expected: 0, collected: 0 };
    acc[item.description].expected += item.amount;
    return acc;
  }, {}));
  return (
    <>
      <PageHeader title="Reports" />
      <div className="mb-5 flex flex-wrap gap-3"><Select className="w-44"><option>2026 Term 1</option></Select><input className="min-h-11 rounded-md border border-slate-300 px-3 text-sm" type="date" defaultValue="2026-01-27" /><ExportButton /><ExportButton label="Export PDF" /></div>
      <section className="grid gap-4 md:grid-cols-4"><StatCard label="Daily Collection" value={money(daily)} hint="Amount collected today." /><StatCard label="Expected Fees" value={money(term.expected)} hint="Term collection summary." /><StatCard label="Outstanding" value={money(term.outstanding)} hint="Fees still owed." /><StatCard label="Collection Rate" value={percent(term.rate)} hint="Collected against expected." /></section>
      <section className="mt-6 grid gap-6">
        <Card><CardTitle>Daily Collection Report</CardTitle><SimpleReportTable columns={["method", "amount"]} rows={methodBreakdown.map((r) => ({ method: r.method, amount: money(r.amount) }))} /></Card>
        <Card><CardTitle>Class Arrears Report</CardTitle><SimpleReportTable columns={["className", "expected", "collected", "outstanding"]} rows={classRows.map((r) => ({ className: r.className, expected: money(r.expected), collected: money(r.collected), outstanding: money(r.outstanding) }))} /></Card>
        <Card><CardTitle>Fee Item Report</CardTitle><SimpleReportTable columns={["feeItem", "expected", "collected"]} rows={feeRows.map((r) => ({ feeItem: r.feeItem, expected: money(r.expected), collected: money(r.collected) }))} /></Card>
        <Card><CardTitle>Receipt Report</CardTitle><SimpleReportTable columns={["receiptNumber", "amount", "method", "recordedBy"]} rows={receipts.map((r) => ({ receiptNumber: r.receipt_number, amount: money(r.amount), method: r.method, recordedBy: r.recorded_by ?? "" }))} /></Card>
      </section>
    </>
  );
}
