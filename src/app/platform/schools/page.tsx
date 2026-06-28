import { createPlatformSchoolAction, toggleSchoolStatusAction } from "@/features/platform/actions";
import { getPlatformSchools } from "@/features/platform/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Td, Th, Table } from "@/components/ui/table";

export default async function PlatformSchoolsPage() {
  const platformSchools = await getPlatformSchools();
  return (
    <>
      <PageHeader title="Schools" action="Create School" />
      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card><CardTitle>Create School</CardTitle><form action={createPlatformSchoolAction} className="mt-4 space-y-3"><Input name="name" placeholder="School name" required /><Input name="email" placeholder="Email" /><Input name="phone" placeholder="Phone" /><Input name="address" placeholder="Address" /><Select name="plan"><option>starter</option><option>growth</option><option>premium</option></Select><Button className="w-full">Create School</Button></form></Card>
        <Card><CardTitle>School List</CardTitle><Table><thead><tr><Th>School</Th><Th>Status</Th><Th>Users</Th><Th>Students</Th><Th>Plan</Th><Th></Th></tr></thead><tbody>{platformSchools.map((school) => <tr key={school.id}><Td>{school.name}</Td><Td><Badge value={school.status} /></Td><Td>{school.profiles?.length ?? 0}</Td><Td>{school.students?.length ?? 0}</Td><Td>{school.subscriptions?.[0]?.plan ?? "starter"}</Td><Td><form action={toggleSchoolStatusAction}><input type="hidden" name="schoolId" value={school.id} /><input type="hidden" name="status" value={school.status} /><Button variant="secondary">{school.status === "active" ? "Deactivate" : "Activate"}</Button></form></Td></tr>)}</tbody></Table></Card>
      </section>
    </>
  );
}
