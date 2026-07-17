import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { getPlatformSchools } from "@/features/platform/queries";
import { updatePlatformSubscriptionAction } from "@/features/platform/actions";
import { PageHeader } from "@/components/ui/page-header";
import { Td, Th, Table } from "@/components/ui/table";

export default async function PlatformSubscriptionsPage({
  searchParams
}: {
  searchParams?: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;
  const platformSchools = await getPlatformSchools();
  return (
    <>
      <PageHeader title="Subscriptions" description="Manage school plans and activation status." />
      {params?.saved ? <p className="mb-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">Subscription updated.</p> : null}
      <Card>
        <CardTitle>Subscription Usage</CardTitle>
        <Table>
          <thead>
            <tr>
              <Th>School</Th>
              <Th>Plan</Th>
              <Th>Users</Th>
              <Th>Students</Th>
              <Th>Status</Th>
              <Th>Update</Th>
            </tr>
          </thead>
          <tbody>
            {platformSchools.map((school) => {
              const subscription = school.subscriptions?.[0];
              return (
                <tr key={school.id}>
                  <Td>{school.name}</Td>
                  <Td>{subscription?.plan ?? "starter"}</Td>
                  <Td>{school.profiles?.length ?? 0}</Td>
                  <Td>{school.students?.length ?? 0}</Td>
                  <Td>{subscription?.status ?? school.status}</Td>
                  <Td>
                    <form action={updatePlatformSubscriptionAction} className="flex flex-wrap items-center gap-2">
                      <input type="hidden" name="schoolId" value={school.id} />
                      <Select name="plan" defaultValue={subscription?.plan ?? "starter"} className="w-28">
                        <option value="starter">starter</option>
                        <option value="growth">growth</option>
                        <option value="premium">premium</option>
                      </Select>
                      <Select name="status" defaultValue={subscription?.status ?? "active"} className="w-28">
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                      </Select>
                      <Button type="submit" variant="secondary">
                        Save
                      </Button>
                    </form>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
