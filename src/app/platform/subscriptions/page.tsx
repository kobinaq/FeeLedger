import { Card, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Td, Th, Table } from "@/components/ui/table";
import { platformSchools } from "@/lib/demo-data";

export default function PlatformSubscriptionsPage() {
  return (
    <>
      <PageHeader title="Subscriptions" description="Simple platform-level plan and usage overview." />
      <Card>
        <CardTitle>Subscription Usage</CardTitle>
        <Table><thead><tr><Th>School</Th><Th>Plan</Th><Th>Users</Th><Th>Students</Th><Th>Status</Th></tr></thead><tbody>{platformSchools.map((school) => <tr key={school.id}><Td>{school.name}</Td><Td>{school.plan}</Td><Td>{school.users}</Td><Td>{school.students}</Td><Td>{school.status}</Td></tr>)}</tbody></Table>
      </Card>
    </>
  );
}
