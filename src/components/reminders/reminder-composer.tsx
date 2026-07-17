"use client";

import { useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { sendReminderAction } from "@/features/reminders/actions";
import { Button } from "@/components/ui/button";
import { Select, Textarea } from "@/components/ui/input";

type Template = { id: string; name: string; body: string };
type Family = { id: string; guardian_full_name: string };

export function ReminderComposer({ templates, families }: { templates: Template[]; families: Family[] }) {
  const [templateId, setTemplateId] = useState("");
  const selectedBody = useMemo(() => templates.find((template) => template.id === templateId)?.body ?? templates[0]?.body ?? "", [templateId, templates]);
  const [message, setMessage] = useState(selectedBody);

  return (
    <form action={sendReminderAction} className="mt-4 space-y-4">
      <label className="block text-sm font-semibold">
        Family
        <Select name="familyId" className="mt-1">
          {families.map((family) => (
            <option key={family.id} value={family.id}>
              {family.guardian_full_name}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm font-semibold">
        Template
        <Select
          name="templateId"
          className="mt-1"
          value={templateId}
          onChange={(event) => {
            setTemplateId(event.target.value);
            const body = templates.find((template) => template.id === event.target.value)?.body ?? "";
            setMessage(body);
          }}
        >
          <option value="">Custom message</option>
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </Select>
      </label>
      <label className="block text-sm font-semibold">
        Channel
        <Select name="channel" className="mt-1">
          <option>both</option>
          <option>sms</option>
          <option>email</option>
        </Select>
      </label>
      <label className="block text-sm font-semibold">
        Message
        <Textarea name="message" className="mt-1" value={message} onChange={(event) => setMessage(event.target.value)} required />
      </label>
      <Button className="w-full">
        <Bell className="h-4 w-4" /> Send Reminder
      </Button>
    </form>
  );
}
