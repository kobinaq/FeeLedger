import Link from "next/link";
import { createFamilyAction } from "@/features/families/actions";
import { requireAdminProfile } from "@/features/auth/server";
import { familyBalance, familyPaid, getFamilies } from "@/features/families/queries";
import { Field } from "@/components/forms/field";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBox } from "@/components/ui/search-box";
import { Td, Th, Table } from "@/components/ui/table";
import { money } from "@/lib/utils";

export default async function FamiliesPage() {
  const profile = await requireAdminProfile();
  const families = await getFamilies(profile.school_id!);
  return (
    <>
      <PageHeader title="Family Accounts" action="Create Family" />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <div className="mb-4"><SearchBox placeholder="Search by guardian, student, phone, or email" /></div>
          <Table>
            <thead><tr><Th>Guardian</Th><Th>Phone</Th><Th>Children</Th><Th>Total Paid</Th><Th>Outstanding</Th><Th></Th></tr></thead>
            <tbody>{families.map((family) => <tr key={family.id}><Td>{family.guardian_full_name}</Td><Td>{family.phone}</Td><Td>{family.students.map((s) => s.first_name).join(", ")}</Td><Td>{money(familyPaid(family))}</Td><Td>{money(familyBalance(family))}</Td><Td><Link className="font-semibold text-brand-green" href={`/admin/families/${family.id}`}>Open</Link></Td></tr>)}</tbody>
          </Table>
        </Card>
        <Card>
          <h2 className="font-semibold text-slate-950">Create Family</h2>
          <form action={createFamilyAction} className="mt-4 space-y-3">
            <Field label="Guardian full name"><Input name="guardianName" required /></Field>
            <Field label="Phone number"><Input name="phone" required /></Field>
            <Field label="Email"><Input name="email" type="email" required /></Field>
            <Field label="Address"><Input name="address" required /></Field>
            <Field label="Notes"><Textarea name="notes" /></Field>
            <Button className="w-full">Save Family</Button>
          </form>
        </Card>
      </div>
    </>
  );
}
