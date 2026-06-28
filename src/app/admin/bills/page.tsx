import Link from "next/link";
import { generateBillsAction } from "@/features/bills/actions";
import { requireAdminProfile } from "@/features/auth/server";
import { getBills } from "@/features/bills/queries";
import { getClasses, getCurrentTerm } from "@/features/schools/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StepperForm } from "@/components/ui/stepper-form";
import { Td, Th, Table } from "@/components/ui/table";
import { money, shortDate } from "@/lib/utils";

export default async function BillsPage() {
  const profile = await requireAdminProfile();
  const [bills, classes, term] = await Promise.all([
    getBills(profile.school_id!),
    getClasses(profile.school_id!),
    getCurrentTerm(profile.school_id!)
  ]);
  return (
    <>
      <PageHeader title="Bills" action="Generate Bills" />
      <StepperForm current={1} steps={["Select Term and Classes", "Preview Bills", "Publish and Notify Parents"]} />
      <section className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardTitle>Generate Bills</CardTitle>
          <form action={generateBillsAction} className="mt-4 space-y-4">
            <label className="block text-sm font-semibold">Term<Select name="termId" className="mt-1"><option value={term?.id}>{term?.name}</option></Select></label>
            <label className="block text-sm font-semibold">Classes<Select name="classIds" className="mt-1" multiple>{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></label>
            <Button name="publish" value="false" className="w-full">Generate Draft Bills</Button>
            <Button name="publish" value="true" className="w-full" variant="secondary">Publish and Notify Parents</Button>
          </form>
        </Card>
        <Card>
          <CardTitle>Published Bills</CardTitle>
          <Table>
            <thead><tr><Th>Bill</Th><Th>Student</Th><Th>Family</Th><Th>Status</Th><Th>Total</Th><Th>Paid</Th><Th>Due</Th></tr></thead>
            <tbody>{bills.map((bill) => <tr key={bill.id}><Td><Link className="font-semibold text-brand-green" href={`/admin/bills/${bill.id}`}>{bill.bill_number}</Link></Td><Td>{bill.students?.first_name}</Td><Td>{bill.families?.guardian_full_name}</Td><Td><Badge value={bill.status} /></Td><Td>{money(bill.total_amount)}</Td><Td>{money(bill.paid_amount)}</Td><Td>{shortDate(bill.due_date)}</Td></tr>)}</tbody>
          </Table>
        </Card>
      </section>
    </>
  );
}
