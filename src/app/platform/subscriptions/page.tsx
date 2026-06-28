import { Card, CardTitle } from "@/components/ui/card";
import { getPlatformSchools } from "@/features/platform/queries";
import { PageHeader } from "@/components/ui/page-header";
import { Td, Th, Table } from "@/components/ui/table";

export default async function PlatformSubscriptionsPage() {
  const platformSchools = await getPlatformSchools();
  return (
    <>
      <PageHeader title="Subscriptions" />
      <Card>
        <CardTitle>Subscription Usage</CardTitle>
        <Table><thead><tr><Th>School</Th><Th>Plan</Th><Th>Users</Th><Th>Students</Th><Th>Status</Th></tr></thead><tbody>{platformSchools.map((school) => <tr key={school.id}><Td>{school.name}</Td><Td>{school.subscriptions?.[0]?.plan ?? "starter"}</Td><Td>{school.profiles?.length ?? 0}</Td><Td>{school.students?.length ?? 0}</Td><Td>{school.status}</Td></tr>)}</tbody></Table>
      </Card>
    </>
  );
}
