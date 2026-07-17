import { requireAdminProfile } from "@/features/auth/server";
import { canSendReminders } from "@/features/auth/permissions";
import { getReminders } from "@/features/reminders/queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { Td, Th, Table } from "@/components/ui/table";
import { ReminderComposer } from "@/components/reminders/reminder-composer";
import { shortDate } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function RemindersPage({ searchParams }: { searchParams?: Promise<{ sent?: string; error?: string }> }) {
  const params = await searchParams;
  const profile = await requireAdminProfile();
  if (!canSendReminders(profile.role)) redirect("/admin/dashboard?error=permission");
  const { templates, reminders, families } = await getReminders(profile.school_id!);

  return (
    <>
      <PageHeader title="Reminder Centre" description="Send balance reminders and review communication history." />
      {params?.sent ? <p className="mb-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">Reminder queued and recorded.</p> : null}
      {params?.error ? <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">You do not have permission for that action.</p> : null}
      <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardTitle>Send a Reminder</CardTitle>
          <ReminderComposer templates={templates} families={families} />
        </Card>
        <div className="space-y-6">
          <Card>
            <CardTitle>Templates</CardTitle>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {templates.map((template) => (
                <div key={template.id} className="rounded-md bg-slate-50 p-3">
                  <p className="font-semibold">{template.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{template.body}</p>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardTitle>Sent History</CardTitle>
            <Table>
              <thead>
                <tr>
                  <Th>Family</Th>
                  <Th>Channel</Th>
                  <Th>Status</Th>
                  <Th>Sent</Th>
                  <Th>Message</Th>
                </tr>
              </thead>
              <tbody>
                {reminders.map((reminder) => (
                  <tr key={reminder.id}>
                    <Td>{reminder.families?.guardian_full_name}</Td>
                    <Td>{reminder.channel}</Td>
                    <Td>
                      <Badge value={reminder.status} />
                    </Td>
                    <Td>{reminder.sent_at ? shortDate(reminder.sent_at) : "Not sent yet"}</Td>
                    <Td>{reminder.message}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </div>
      </section>
    </>
  );
}
