import { updateSubscriptionAction } from "@/features/platform/actions";
import { getPlatformSchools, platformTotals, schoolUsage } from "@/features/platform/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Td, Th, Table } from "@/components/ui/table";
import { shortDate } from "@/lib/utils";

export default async function PlatformSubscriptionsPage({
  searchParams
}: {
  searchParams?: Promise<{ saved?: string }>;
}) {
  const params = await searchParams;
  const platformSchools = await getPlatformSchools();
  const totals = platformTotals(platformSchools);
  return (
    <>
      <PageHeader title="Subscriptions" description="Adjust plan tier, subscription status, and review school usage." />
      {params?.saved ? (
        <p className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
          Subscription updated.
        </p>
      ) : null}
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Active schools" value={String(totals.activeSchools)} hint="Can sign in and bill" />
        <StatCard label="Families" value={String(totals.families)} hint="Billing accounts" />
        <StatCard label="Students" value={String(totals.students)} hint="Across all tenants" />
      </section>
      <Card>
        <CardTitle>Subscription Usage</CardTitle>
        <Table>
          <thead>
            <tr>
              <Th>School</Th>
              <Th>Plan</Th>
              <Th>Sub status</Th>
              <Th>Users</Th>
              <Th>Students</Th>
              <Th>Bills</Th>
              <Th>Payments</Th>
              <Th>Ends</Th>
              <Th>Update</Th>
            </tr>
          </thead>
          <tbody>
            {platformSchools.map((school) => {
              const usage = schoolUsage(school);
              const sub = usage.subscription;
              return (
                <tr key={school.id}>
                  <Td>
                    <div>
                      <p className="font-semibold">{school.name}</p>
                      <p className="text-xs text-slate-500">{school.status}</p>
                    </div>
                  </Td>
                  <Td>{sub?.plan ?? "starter"}</Td>
                  <Td>
                    <Badge value={sub?.status ?? "none"} />
                  </Td>
                  <Td>{usage.users}</Td>
                  <Td>{usage.students}</Td>
                  <Td>{usage.bills}</Td>
                  <Td>{usage.payments}</Td>
                  <Td>{sub?.ends_on ? shortDate(sub.ends_on) : "—"}</Td>
                  <Td>
                    <form action={updateSubscriptionAction} className="flex min-w-[220px] flex-col gap-2">
                      <input type="hidden" name="schoolId" value={school.id} />
                      <Select name="plan" defaultValue={sub?.plan ?? "starter"}>
                        <option value="starter">starter</option>
                        <option value="growth">growth</option>
                        <option value="premium">premium</option>
                      </Select>
                      <Select name="status" defaultValue={sub?.status ?? "active"}>
                        <option value="active">active</option>
                        <option value="trialing">trialing</option>
                        <option value="past_due">past_due</option>
                        <option value="cancelled">cancelled</option>
                        <option value="inactive">inactive</option>
                      </Select>
                      <Input name="endsOn" type="date" defaultValue={sub?.ends_on ?? ""} />
                      <Button variant="secondary">Save</Button>
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
