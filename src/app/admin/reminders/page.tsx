import { Bell } from "lucide-react";
import { sendReminderAction } from "@/features/reminders/actions";
import { requireAdminProfile } from "@/features/auth/server";
import { getReminders } from "@/features/reminders/queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Td, Th, Table } from "@/components/ui/table";
import { shortDate } from "@/lib/utils";

export default async function RemindersPage() {
  const profile = await requireAdminProfile();
  const { templates, reminders, families } = await getReminders(profile.school_id!);
  return (
    <>
      <PageHeader title="Reminder Centre" description="Send simple SMS and email reminders using mock providers." action="Send Reminder" />
      <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardTitle>Send a Reminder</CardTitle>
          <form action={sendReminderAction} className="mt-4 space-y-4">
            <label className="block text-sm font-semibold">Family<Select name="familyId" className="mt-1">{families.map((family) => <option key={family.id} value={family.id}>{family.guardian_full_name}</option>)}</Select></label>
            <label className="block text-sm font-semibold">Template<Select name="templateId" className="mt-1"><option value="">Custom message</option>{templates.map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}</Select></label>
            <label className="block text-sm font-semibold">Channel<Select name="channel" className="mt-1"><option>both</option><option>sms</option><option>email</option></Select></label>
            <label className="block text-sm font-semibold">Message<Textarea name="message" className="mt-1" defaultValue={templates[0]?.body ?? ""} /></label>
            <Button className="w-full"><Bell className="h-4 w-4" /> Send with Mock Provider</Button>
          </form>
        </Card>
        <div className="space-y-6">
          <Card><CardTitle>Templates</CardTitle><div className="mt-4 grid gap-3 md:grid-cols-2">{templates.map((template) => <div key={template.id} className="rounded-md bg-slate-50 p-3"><p className="font-semibold">{template.name}</p><p className="mt-1 text-sm text-slate-500">{template.body}</p></div>)}</div></Card>
          <Card><CardTitle>Sent History</CardTitle><Table><thead><tr><Th>Family</Th><Th>Channel</Th><Th>Status</Th><Th>Sent</Th><Th>Message</Th></tr></thead><tbody>{reminders.map((reminder) => <tr key={reminder.id}><Td>{reminder.families?.guardian_full_name}</Td><Td>{reminder.channel}</Td><Td><Badge value={reminder.status} /></Td><Td>{reminder.sent_at ? shortDate(reminder.sent_at) : "Not sent yet"}</Td><Td>{reminder.message}</Td></tr>)}</tbody></Table></Card>
        </div>
      </section>
    </>
  );
}
