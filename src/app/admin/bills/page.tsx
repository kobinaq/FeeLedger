import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StepperForm } from "@/components/ui/stepper-form";
import { Td, Th, Table } from "@/components/ui/table";
import { bills, classes } from "@/lib/demo-data";
import { getFamily, getStudent } from "@/lib/data-access";
import { money, shortDate } from "@/lib/utils";

export default function BillsPage() {
  return (
    <>
      <PageHeader title="Bills" description="Generate term bills, preview every bill, then publish and notify parents." action="Generate Bills" />
      <StepperForm current={1} steps={["Select Term and Classes", "Preview Bills", "Publish and Notify Parents"]} />
      <section className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardTitle>Generate Bills</CardTitle>
          <form className="mt-4 space-y-4">
            <label className="block text-sm font-semibold">Term<Select className="mt-1"><option>2026 Term 1</option></Select></label>
            <label className="block text-sm font-semibold">Classes<Select className="mt-1" multiple>{classes.slice(0, 6).map((c) => <option key={c.id}>{c.name}</option>)}</Select></label>
            <Button type="button" className="w-full">Preview Bills</Button>
          </form>
        </Card>
        <Card>
          <CardTitle>Published Bills</CardTitle>
          <Table>
            <thead><tr><Th>Bill</Th><Th>Student</Th><Th>Family</Th><Th>Status</Th><Th>Total</Th><Th>Paid</Th><Th>Due</Th></tr></thead>
            <tbody>{bills.map((bill) => <tr key={bill.id}><Td><Link className="font-semibold text-brand-green" href={`/admin/bills/${bill.id}`}>{bill.billNumber}</Link></Td><Td>{getStudent(bill.studentId)?.firstName}</Td><Td>{getFamily(bill.familyId)?.guardianName}</Td><Td><Badge value={bill.status} /></Td><Td>{money(bill.totalAmount)}</Td><Td>{money(bill.paidAmount)}</Td><Td>{shortDate(bill.dueDate)}</Td></tr>)}</tbody>
          </Table>
        </Card>
      </section>
    </>
  );
}
