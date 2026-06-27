import { Field } from "@/components/forms/field";
import { createFeeItemAction, createFeeRuleAction } from "@/features/fees/actions";
import { requireAdminProfile } from "@/features/auth/server";
import { getFeeSetup } from "@/features/fees/queries";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StepperForm } from "@/components/ui/stepper-form";
import { Td, Th, Table } from "@/components/ui/table";
import { money, shortDate } from "@/lib/utils";

export default async function FeeSetupPage() {
  const profile = await requireAdminProfile();
  const { feeItems, feeRules, terms, classes } = await getFeeSetup(profile.school_id!);
  return (
    <>
      <PageHeader title="Fee Setup" description="Create fee items and class-based rules, then preview bills before publishing." action="Preview Bills" />
      <StepperForm current={1} steps={["Set fee items", "Review class rules", "Preview bills"]} />
      <section className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardTitle>Add Fee Item</CardTitle>
          <form action={createFeeItemAction} className="mt-4 space-y-3">
            <Field label="Fee name"><Input name="name" placeholder="Tuition" required /></Field>
            <Field label="Category"><Select name="category"><option>tuition</option><option>feeding</option><option>transport</option><option>books</option><option>custom</option></Select></Field>
            <Field label="Default due date"><Input name="defaultDueDate" type="date" /></Field>
            <label className="flex gap-2 text-sm"><input name="required" type="checkbox" defaultChecked /> Required for all students</label>
            <Field label="Description"><Textarea name="description" placeholder="Short note for staff and parents" /></Field>
            <Button className="w-full">Save Fee Item</Button>
          </form>
          <form action={createFeeRuleAction} className="mt-6 space-y-3 border-t border-slate-200 pt-4">
            <CardTitle>Add Class Rule</CardTitle>
            <Field label="Term"><Select name="termId">{terms.map((term) => <option key={term.id} value={term.id}>{term.name}</option>)}</Select></Field>
            <Field label="Class"><Select name="classId">{classes.map((classRoom) => <option key={classRoom.id} value={classRoom.id}>{classRoom.name}</option>)}</Select></Field>
            <Field label="Fee item"><Select name="feeItemId">{feeItems.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></Field>
            <Field label="Amount"><Input name="amount" type="number" min="0" step="0.01" required /></Field>
            <Field label="Due date"><Input name="dueDate" type="date" required /></Field>
            <label className="flex gap-2 text-sm"><input name="required" type="checkbox" defaultChecked /> Required</label>
            <Button className="w-full">Save Rule</Button>
          </form>
          <div className="mt-5 space-y-2">{feeItems.map((item) => <div key={item.id} className="rounded-md bg-slate-50 p-3 text-sm"><strong>{item.name}</strong><p className="text-slate-500">{item.description}</p></div>)}</div>
        </Card>
        <Card>
          <CardTitle>Class Fee Rules</CardTitle>
          <Table>
            <thead><tr><Th>Class</Th><Th>Fee Item</Th><Th>Amount</Th><Th>Required?</Th><Th>Due Date</Th></tr></thead>
            <tbody>{feeRules.map((rule) => <tr key={rule.id}><Td>{rule.classes?.name}</Td><Td>{rule.fee_items?.name}</Td><Td>{money(rule.amount)}</Td><Td>{rule.is_required ? "Yes" : "Optional"}</Td><Td>{shortDate(rule.due_date)}</Td></tr>)}</tbody>
          </Table>
        </Card>
      </section>
    </>
  );
}
