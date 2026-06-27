import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Td, Th, Table } from "@/components/ui/table";
import { getBill, getBillItems, getFamily, getStudent } from "@/lib/data-access";
import { money, shortDate } from "@/lib/utils";

export default async function BillDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bill = getBill(id);
  if (!bill) notFound();
  return (
    <>
      <PageHeader title={bill.billNumber} description="Bill details, fee items, payment history, and parent-visible status." />
      <div className="mb-5 flex gap-2"><Button>Print Bill</Button><Button variant="secondary">Send Bill Notification</Button></div>
      <section className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-sm text-slate-500">Student</p><p className="mt-2 font-bold">{getStudent(bill.studentId)?.firstName} {getStudent(bill.studentId)?.lastName}</p></Card>
        <Card><p className="text-sm text-slate-500">Family</p><p className="mt-2 font-bold">{getFamily(bill.familyId)?.guardianName}</p></Card>
        <Card><p className="text-sm text-slate-500">Outstanding</p><p className="mt-2 text-2xl font-bold">{money(bill.totalAmount - bill.paidAmount)}</p></Card>
        <Card><p className="text-sm text-slate-500">Status</p><div className="mt-3"><Badge value={bill.status} /></div></Card>
      </section>
      <Card className="mt-6">
        <CardTitle>Fee Items</CardTitle>
        <Table><thead><tr><Th>Description</Th><Th>Amount</Th></tr></thead><tbody>{getBillItems(bill.id).map((item) => <tr key={item.id}><Td>{item.description}</Td><Td>{money(item.amount)}</Td></tr>)}</tbody></Table>
        <div className="mt-4 rounded-md bg-slate-50 p-4 text-sm">Due date: {shortDate(bill.dueDate)}. Amount paid: {money(bill.paidAmount)}.</div>
      </Card>
    </>
  );
}
