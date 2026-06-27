import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { Td, Th, Table } from "@/components/ui/table";
import { families, reminderTemplates, reminders } from "@/lib/demo-data";
import { getFamily } from "@/lib/data-access";
import { shortDate } from "@/lib/utils";

export default function RemindersPage() {
  return (
    <>
      <PageHeader title="Reminder Centre" description="Send simple SMS and email reminders using mock providers." action="Send Reminder" />
      <section className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <Card>
          <CardTitle>Send a Reminder</CardTitle>
          <form className="mt-4 space-y-4">
            <label className="block text-sm font-semibold">Family<Select className="mt-1">{families.map((family) => <option key={family.id}>{family.guardianName}</option>)}</Select></label>
            <label className="block text-sm font-semibold">Channel<Select className="mt-1"><option>both</option><option>sms</option><option>email</option></Select></label>
            <label className="block text-sm font-semibold">Message<Textarea className="mt-1" defaultValue={reminderTemplates[0].body} /></label>
            <Button className="w-full"><Bell className="h-4 w-4" /> Send with Mock Provider</Button>
          </form>
        </Card>
        <div className="space-y-6">
          <Card><CardTitle>Templates</CardTitle><div className="mt-4 grid gap-3 md:grid-cols-2">{reminderTemplates.map((template) => <div key={template.id} className="rounded-md bg-slate-50 p-3"><p className="font-semibold">{template.name}</p><p className="mt-1 text-sm text-slate-500">{template.body}</p></div>)}</div></Card>
          <Card><CardTitle>Sent History</CardTitle><Table><thead><tr><Th>Family</Th><Th>Channel</Th><Th>Status</Th><Th>Sent</Th><Th>Message</Th></tr></thead><tbody>{reminders.map((reminder) => <tr key={reminder.id}><Td>{getFamily(reminder.familyId)?.guardianName}</Td><Td>{reminder.channel}</Td><Td><Badge value={reminder.status} /></Td><Td>{reminder.sentAt ? shortDate(reminder.sentAt) : "Not sent yet"}</Td><Td>{reminder.message}</Td></tr>)}</tbody></Table></Card>
        </div>
      </section>
    </>
  );
}
