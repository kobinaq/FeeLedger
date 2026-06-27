import { Field } from "@/components/forms/field";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { school, classes, profiles, reminderTemplates } from "@/lib/demo-data";

export default function SettingsPage() {
  return (
    <>
      <PageHeader title="School Settings" description="Only school admins can manage school details, terms, classes, methods, templates, and staff users." action="Save Changes" />
      <section className="grid gap-6 xl:grid-cols-2">
        <Card><CardTitle>School Profile</CardTitle><form className="mt-4 grid gap-3 md:grid-cols-2"><Field label="School name"><Input defaultValue={school.name} /></Field><Field label="Phone"><Input defaultValue={school.phone} /></Field><Field label="Email"><Input defaultValue={school.email} /></Field><Field label="Currency"><Select defaultValue="GHS"><option>GHS</option></Select></Field><Field label="Address"><Textarea defaultValue={school.address} /></Field><Field label="Logo"><Input type="file" /></Field></form></Card>
        <Card><CardTitle>Academic Setup</CardTitle><div className="mt-4 grid gap-3 md:grid-cols-2"><Field label="Academic year"><Input defaultValue="2026 Academic Year" /></Field><Field label="Current term"><Input defaultValue="2026 Term 1" /></Field><Field label="Classes"><Textarea defaultValue={classes.map((c) => c.name).join("\n")} /></Field><Field label="Payment methods"><Textarea defaultValue={"cash\nmobile money\nbank transfer\ncheque\ncard/POS\nother"} /></Field></div></Card>
        <Card><CardTitle>Reminder Templates</CardTitle><div className="mt-4 space-y-3">{reminderTemplates.map((template) => <Field key={template.id} label={template.name}><Textarea defaultValue={template.body} /></Field>)}</div></Card>
        <Card><CardTitle>Staff Users</CardTitle><div className="mt-4 space-y-2">{profiles.filter((p) => p.schoolId).map((profile) => <div key={profile.id} className="flex justify-between rounded-md bg-slate-50 p-3"><span>{profile.fullName}</span><strong>{profile.role.replaceAll("_", " ")}</strong></div>)}</div><Button className="mt-4" variant="secondary">Invite Staff User</Button></Card>
      </section>
    </>
  );
}
