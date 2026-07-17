import { Field } from "@/components/forms/field";
import { updateSchoolSettingsAction } from "@/features/schools/actions";
import { requireAdminProfile } from "@/features/auth/server";
import { getClasses, getCurrentSchool } from "@/features/schools/queries";
import { getReminders } from "@/features/reminders/queries";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";

export default async function SettingsPage() {
  const profile = await requireAdminProfile();
  const [school, classes, reminders] = await Promise.all([
    getCurrentSchool(profile.school_id!),
    getClasses(profile.school_id!),
    getReminders(profile.school_id!)
  ]);
  return (
    <>
      <PageHeader title="School Settings" description="Keep school profile, academic setup, payment methods, and templates current." />
      <section className="grid gap-6 xl:grid-cols-2">
        <Card><CardTitle>School Profile</CardTitle><form action={updateSchoolSettingsAction} className="mt-4 grid gap-3 md:grid-cols-2"><Field label="School name"><Input name="name" defaultValue={school.name} /></Field><Field label="Phone"><Input name="phone" defaultValue={school.phone ?? ""} /></Field><Field label="Email"><Input name="email" defaultValue={school.email ?? ""} /></Field><Field label="Currency"><Select name="currency" defaultValue={school.currency}><option>GHS</option></Select></Field><Field label="Address"><Textarea name="address" defaultValue={school.address ?? ""} /></Field><Field label="Logo"><Input name="logo" type="file" /></Field><Button>Save School Profile</Button></form></Card>
        <Card><CardTitle>Academic Setup</CardTitle><div className="mt-4 grid gap-3 md:grid-cols-2"><Field label="Academic year"><Input defaultValue="2026 Academic Year" /></Field><Field label="Current term"><Input defaultValue="2026 Term 1" /></Field><Field label="Classes"><Textarea defaultValue={classes.map((c) => c.name).join("\n")} /></Field><Field label="Payment methods"><Textarea defaultValue={"cash\nmobile money\nbank transfer\ncheque\ncard/POS\nother"} /></Field></div></Card>
        <Card><CardTitle>Reminder Templates</CardTitle><div className="mt-4 space-y-3">{reminders.templates.map((template) => <Field key={template.id} label={template.name}><Textarea defaultValue={template.body} /></Field>)}</div></Card>
        <Card><CardTitle>Staff Users</CardTitle><div className="mt-4 space-y-2"><div className="flex justify-between rounded-md bg-slate-50 p-3"><span>{profile.full_name}</span><strong>{profile.role.replaceAll("_", " ")}</strong></div></div><p className="mt-4 text-sm text-slate-500">Staff invitations will be handled through the production auth setup flow.</p></Card>
      </section>
    </>
  );
}
