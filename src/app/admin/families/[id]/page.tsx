import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Td, Th, Table } from "@/components/ui/table";
import { getFamily, getFamilyBalance, getFamilyBills, getFamilyPaid, getFamilyPayments, getFamilyPlan, getFamilyReceipts, getFamilyReminders, getFamilyStudents } from "@/lib/data-access";
import { money, shortDate } from "@/lib/utils";

export default async function FamilyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const family = getFamily(id);
  if (!family) notFound();
  const plan = getFamilyPlan(family.id);
  return (
    <>
      <PageHeader title={family.guardianName} description="A simple financial profile for this family account." />
      <section className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-sm text-slate-500">Total Outstanding</p><p className="mt-2 text-2xl font-bold">{money(getFamilyBalance(family.id))}</p></Card>
        <Card><p className="text-sm text-slate-500">Total Paid This Term</p><p className="mt-2 text-2xl font-bold">{money(getFamilyPaid(family.id))}</p></Card>
        <Card><p className="text-sm text-slate-500">Children</p><p className="mt-2 text-2xl font-bold">{getFamilyStudents(family.id).length}</p></Card>
        <Card><p className="text-sm text-slate-500">Payment Plan</p><div className="mt-3"><Badge value={plan?.status ?? "inactive"} /></div></Card>
      </section>
      <div className="mt-5 flex flex-wrap gap-2"><Link href="/admin/payments/new"><Button>Record Payment</Button></Link><Button variant="secondary">Send Reminder</Button><Button variant="secondary">Create Payment Plan</Button><Button variant="secondary">View Statement</Button></div>
      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card><CardTitle>Guardian Details</CardTitle><div className="mt-3 text-sm text-slate-600"><p>{family.phone}</p><p>{family.email}</p><p>{family.address}</p><p className="mt-2">{family.notes}</p></div></Card>
        <Card><CardTitle>Linked Children</CardTitle><div className="mt-3 space-y-2">{getFamilyStudents(family.id).map((s) => <div key={s.id} className="rounded-md bg-slate-50 p-3">{s.firstName} {s.lastName}</div>)}</div></Card>
        <Card><CardTitle>Bills</CardTitle><Table><thead><tr><Th>Bill</Th><Th>Status</Th><Th>Total</Th><Th>Outstanding</Th></tr></thead><tbody>{getFamilyBills(family.id).map((b) => <tr key={b.id}><Td><Link className="text-brand-green" href={`/admin/bills/${b.id}`}>{b.billNumber}</Link></Td><Td><Badge value={b.status} /></Td><Td>{money(b.totalAmount)}</Td><Td>{money(b.totalAmount - b.paidAmount)}</Td></tr>)}</tbody></Table></Card>
        <Card><CardTitle>Payments and Receipts</CardTitle><Table><thead><tr><Th>Date</Th><Th>Amount</Th><Th>Method</Th><Th>Receipt</Th></tr></thead><tbody>{getFamilyPayments(family.id).map((p) => <tr key={p.id}><Td>{shortDate(p.paymentDate)}</Td><Td>{money(p.amount)}</Td><Td>{p.method}</Td><Td>{getFamilyReceipts(family.id).find((r) => r.paymentId === p.id)?.receiptNumber}</Td></tr>)}</tbody></Table></Card>
        <Card><CardTitle>Payment Plan</CardTitle>{plan ? <div className="mt-3 space-y-2">{plan.installments.map((i) => <div key={i.id} className="flex justify-between rounded-md bg-slate-50 p-3"><span>{shortDate(i.dueDate)}</span><strong>{money(i.amount)}</strong><Badge value={i.status} /></div>)}</div> : <p className="mt-3 text-sm text-slate-500">No active plan.</p>}</Card>
        <Card><CardTitle>Reminder History</CardTitle><div className="mt-3 space-y-2">{getFamilyReminders(family.id).map((r) => <div key={r.id} className="rounded-md bg-slate-50 p-3"><Badge value={r.status} /><p className="mt-2 text-sm">{r.message}</p></div>)}</div></Card>
      </section>
    </>
  );
}
