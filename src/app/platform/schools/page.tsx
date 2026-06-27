import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Td, Th, Table } from "@/components/ui/table";
import { platformSchools } from "@/lib/demo-data";

export default function PlatformSchoolsPage() {
  return (
    <>
      <PageHeader title="Schools" description="Create and manage schools using FeeLedger." action="Create School" />
      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card><CardTitle>Create School</CardTitle><form className="mt-4 space-y-3"><Input placeholder="School name" /><Input placeholder="Email" /><Input placeholder="Phone" /><Select><option>starter</option><option>growth</option><option>premium</option></Select><Button className="w-full">Create School</Button></form></Card>
        <Card><CardTitle>School List</CardTitle><Table><thead><tr><Th>School</Th><Th>Status</Th><Th>Users</Th><Th>Students</Th><Th>Plan</Th><Th></Th></tr></thead><tbody>{platformSchools.map((school) => <tr key={school.id}><Td>{school.name}</Td><Td><Badge value={school.status} /></Td><Td>{school.users}</Td><Td>{school.students}</Td><Td>{school.plan}</Td><Td><Button variant="secondary">{school.status === "active" ? "Deactivate" : "Activate"}</Button></Td></tr>)}</tbody></Table></Card>
      </section>
    </>
  );
}
