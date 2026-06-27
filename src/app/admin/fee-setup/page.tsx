import { Field } from "@/components/forms/field";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StepperForm } from "@/components/ui/stepper-form";
import { Td, Th, Table } from "@/components/ui/table";
import { feeItems } from "@/lib/demo-data";
import { getFeeRuleRows } from "@/lib/data-access";
import { money, shortDate } from "@/lib/utils";

export default function FeeSetupPage() {
  return (
    <>
      <PageHeader title="Fee Setup" description="Create fee items and class-based rules, then preview bills before publishing." action="Preview Bills" />
      <StepperForm current={1} steps={["Set fee items", "Review class rules", "Preview bills"]} />
      <section className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardTitle>Add Fee Item</CardTitle>
          <form className="mt-4 space-y-3">
            <Field label="Fee name"><Input placeholder="Tuition" /></Field>
            <Field label="Category"><Select><option>tuition</option><option>feeding</option><option>transport</option><option>books</option><option>custom</option></Select></Field>
            <Field label="Default due date"><Input type="date" /></Field>
            <label className="flex gap-2 text-sm"><input type="checkbox" defaultChecked /> Required for all students</label>
            <Field label="Description"><Textarea placeholder="Short note for staff and parents" /></Field>
          </form>
          <div className="mt-5 space-y-2">{feeItems.map((item) => <div key={item.id} className="rounded-md bg-slate-50 p-3 text-sm"><strong>{item.name}</strong><p className="text-slate-500">{item.description}</p></div>)}</div>
        </Card>
        <Card>
          <CardTitle>Class Fee Rules</CardTitle>
          <Table>
            <thead><tr><Th>Class</Th><Th>Fee Item</Th><Th>Amount</Th><Th>Required?</Th><Th>Due Date</Th></tr></thead>
            <tbody>{getFeeRuleRows().map((rule) => <tr key={rule.id}><Td>{rule.className}</Td><Td>{rule.feeItem}</Td><Td>{money(rule.amount)}</Td><Td>{rule.required ? "Yes" : "Optional"}</Td><Td>{shortDate(rule.dueDate)}</Td></tr>)}</tbody>
          </Table>
        </Card>
      </section>
    </>
  );
}
