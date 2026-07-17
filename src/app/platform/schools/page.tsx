import { createPlatformSchoolAction, toggleSchoolStatusAction } from "@/features/platform/actions";
import { getPlatformSchools, platformTotals, schoolUsage } from "@/features/platform/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Td, Th, Table } from "@/components/ui/table";

export default async function PlatformSchoolsPage() {
  const platformSchools = await getPlatformSchools();
  const totals = platformTotals(platformSchools);
  return (
    <>
      <PageHeader title="Schools" description="Create schools, monitor usage, and control account access." />
      <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Schools" value={String(totals.schools)} hint={`${totals.activeSchools} active`} />
        <StatCard label="Users" value={String(totals.users)} hint="Profiles across all schools" />
        <StatCard label="Students" value={String(totals.students)} hint="Active roster size" />
        <StatCard label="Payments recorded" value={String(totals.payments)} hint="All-time payment rows" />
      </section>
      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardTitle>Create School</CardTitle>
          <form action={createPlatformSchoolAction} className="mt-4 space-y-3">
            <Input name="name" placeholder="School name" required />
            <Input name="email" placeholder="Email" />
            <Input name="phone" placeholder="Phone" />
            <Input name="address" placeholder="Address" />
            <Select name="plan" defaultValue="starter">
              <option value="starter">starter</option>
              <option value="growth">growth</option>
              <option value="premium">premium</option>
            </Select>
            <Button className="w-full">Create School</Button>
          </form>
        </Card>
        <Card>
          <CardTitle>School List</CardTitle>
          <Table>
            <thead>
              <tr>
                <Th>School</Th>
                <Th>Status</Th>
                <Th>Users</Th>
                <Th>Students</Th>
                <Th>Families</Th>
                <Th>Plan</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {platformSchools.map((school) => {
                const usage = schoolUsage(school);
                return (
                  <tr key={school.id}>
                    <Td>{school.name}</Td>
                    <Td>
                      <Badge value={school.status} />
                    </Td>
                    <Td>{usage.users}</Td>
                    <Td>{usage.students}</Td>
                    <Td>{usage.families}</Td>
                    <Td>{usage.subscription?.plan ?? "starter"}</Td>
                    <Td>
                      <form action={toggleSchoolStatusAction}>
                        <input type="hidden" name="schoolId" value={school.id} />
                        <input type="hidden" name="status" value={school.status} />
                        <Button variant="secondary">{school.status === "active" ? "Deactivate" : "Activate"}</Button>
                      </form>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card>
      </section>
    </>
  );
}
