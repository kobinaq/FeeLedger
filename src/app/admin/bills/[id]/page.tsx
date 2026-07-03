import { notFound } from "next/navigation";
import { publishBillAction } from "@/features/bills/actions";
import { requireAdminProfile } from "@/features/auth/server";
import { getBillById } from "@/features/bills/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Td, Th, Table } from "@/components/ui/table";
import { money, shortDate } from "@/lib/utils";

export default async function BillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await requireAdminProfile();
  const bill = await getBillById(profile.school_id!, id).catch(() => null);
  if (!bill) notFound();
  return (
    <>
      <PageHeader title={bill.bill_number} description="Review bill items, balance, due date, and publication state." />
      <div className="mb-5 flex gap-2"><form action={publishBillAction}><input type="hidden" name="billId" value={bill.id} /><Button variant="secondary">Publish Bill</Button></form></div>
      <section className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-sm text-slate-500">Student</p><p className="mt-2 font-bold">{bill.students?.first_name} {bill.students?.last_name}</p></Card>
        <Card><p className="text-sm text-slate-500">Family</p><p className="mt-2 font-bold">{bill.families?.guardian_full_name}</p></Card>
        <Card><p className="text-sm text-slate-500">Outstanding</p><p className="mt-2 text-2xl font-bold">{money(bill.total_amount - bill.paid_amount)}</p></Card>
        <Card><p className="text-sm text-slate-500">Status</p><div className="mt-3"><Badge value={bill.status} /></div></Card>
      </section>
      <Card className="mt-6">
        <CardTitle>Fee Items</CardTitle>
        <Table><thead><tr><Th>Description</Th><Th>Amount</Th></tr></thead><tbody>{bill.bill_items?.map((item) => <tr key={item.id}><Td>{item.description}</Td><Td>{money(item.amount)}</Td></tr>)}</tbody></Table>
        <div className="mt-4 rounded-md bg-slate-50 p-4 text-sm">Due date: {shortDate(bill.due_date)}. Amount paid: {money(bill.paid_amount)}.</div>
      </Card>
    </>
  );
}
