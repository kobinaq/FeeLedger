import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { SearchBox } from "@/components/ui/search-box";
import { Td, Th, Table } from "@/components/ui/table";
import { families } from "@/lib/demo-data";
import { getFamilyBalance, getFamilyPaid, getFamilyStudents } from "@/lib/data-access";
import { money } from "@/lib/utils";

export default function FamiliesPage() {
  return (
    <>
      <PageHeader title="Family Accounts" description="Each account groups one or more children under a parent or guardian." action="Create Family" />
      <Card>
        <div className="mb-4"><SearchBox placeholder="Search by guardian, student, phone, or email" /></div>
        <Table>
          <thead><tr><Th>Guardian</Th><Th>Phone</Th><Th>Children</Th><Th>Total Paid</Th><Th>Outstanding</Th><Th></Th></tr></thead>
          <tbody>{families.map((family) => <tr key={family.id}><Td>{family.guardianName}</Td><Td>{family.phone}</Td><Td>{getFamilyStudents(family.id).map((s) => s.firstName).join(", ")}</Td><Td>{money(getFamilyPaid(family.id))}</Td><Td>{money(getFamilyBalance(family.id))}</Td><Td><Link className="font-semibold text-brand-green" href={`/admin/families/${family.id}`}>Open</Link></Td></tr>)}</tbody>
        </Table>
      </Card>
    </>
  );
}
