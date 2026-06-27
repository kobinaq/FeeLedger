import { Card, CardTitle } from "@/components/ui/card";
import { ExportButton } from "@/components/ui/export-button";
import { Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SimpleReportTable } from "@/components/reports/simple-report-table";
import { getClassArrearsReport, getDailyCollectionReport, getFeeItemReport, getReceiptReport, getTermSummary } from "@/lib/services/reports";
import { money, percent } from "@/lib/utils";

export default function ReportsPage() {
  const daily = getDailyCollectionReport();
  const term = getTermSummary();
  return (
    <>
      <PageHeader title="Reports" description="Clear reports for proprietors, headteachers, and the accounts office." />
      <div className="mb-5 flex flex-wrap gap-3"><Select className="w-44"><option>2026 Term 1</option></Select><input className="min-h-11 rounded-md border border-slate-300 px-3 text-sm" type="date" defaultValue="2026-01-27" /><ExportButton /><ExportButton label="Export PDF" /></div>
      <section className="grid gap-4 md:grid-cols-4"><StatCard label="Daily Collection" value={money(daily.total)} hint="Amount collected today." /><StatCard label="Expected Fees" value={money(term.expected)} hint="Term collection summary." /><StatCard label="Outstanding" value={money(term.outstanding)} hint="Fees still owed." /><StatCard label="Collection Rate" value={percent(term.rate)} hint="Collected against expected." /></section>
      <section className="mt-6 grid gap-6">
        <Card><CardTitle>Daily Collection Report</CardTitle><SimpleReportTable columns={["method", "amount"]} rows={daily.methodBreakdown.map((r) => ({ method: r.method, amount: money(r.amount) }))} /></Card>
        <Card><CardTitle>Class Arrears Report</CardTitle><SimpleReportTable columns={["className", "expected", "collected", "outstanding"]} rows={getClassArrearsReport().map((r) => ({ className: r.className, expected: money(r.expected), collected: money(r.collected), outstanding: money(r.outstanding) }))} /></Card>
        <Card><CardTitle>Fee Item Report</CardTitle><SimpleReportTable columns={["feeItem", "expected", "collected"]} rows={getFeeItemReport().map((r) => ({ feeItem: r.feeItem, expected: money(r.expected), collected: money(r.collected) }))} /></Card>
        <Card><CardTitle>Receipt Report</CardTitle><SimpleReportTable columns={["receiptNumber", "amount", "method", "recordedBy"]} rows={getReceiptReport().map((r) => ({ receiptNumber: r.receiptNumber, amount: money(r.amount), method: r.method, recordedBy: r.recordedBy }))} /></Card>
      </section>
    </>
  );
}
