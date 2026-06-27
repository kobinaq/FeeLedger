import { createPaymentPlanAction } from "@/features/payment-plans/actions";
import { requireAdminProfile } from "@/features/auth/server";
import { familyBalance, getPaymentPlans } from "@/features/payment-plans/queries";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StepperForm } from "@/components/ui/stepper-form";
import { Td, Th, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { money, shortDate } from "@/lib/utils";

export default async function PaymentPlansPage() {
  const profile = await requireAdminProfile();
  const { plans, families } = await getPaymentPlans(profile.school_id!);
  return (
    <>
      <PageHeader title="Payment Plans" description="Create and track family-level instalment plans." action="Create Payment Plan" />
      <StepperForm current={2} steps={["Confirm Family Balance", "Add Instalments", "Review Plan", "Save and Notify Parent"]} />
      <section className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardTitle>Plan Builder</CardTitle>
          <form action={createPaymentPlanAction} className="mt-4 space-y-4">
            <label className="block text-sm font-semibold">Family<Select name="familyId" className="mt-1">{families.map((family) => <option key={family.id} value={family.id}>{family.guardian_full_name} - {money(familyBalance(family))}</option>)}</Select></label>
            <label className="block text-sm font-semibold">Plan amount<input className="mt-1 min-h-11 w-full rounded-md border border-slate-300 px-3 text-sm" name="totalBalance" type="number" min="1" step="0.01" required /></label>
            <div className="grid gap-3">
              {[0, 1, 2].map((index) => <div key={index} className="grid grid-cols-2 gap-2"><input className="min-h-11 rounded-md border border-slate-300 px-3 text-sm" name="dueDate" type="date" required={index === 0} /><input className="min-h-11 rounded-md border border-slate-300 px-3 text-sm" name="installmentAmount" type="number" min="1" step="0.01" required={index === 0} placeholder="Amount" /></div>)}
            </div>
            <textarea name="notes" className="min-h-20 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Plan notes" />
            <div className="rounded-md bg-slate-50 p-3 text-sm">Split the outstanding balance into clear dates and amounts. Instalments must equal the plan total before saving.</div>
            <Button className="w-full">Save and Notify Parent</Button>
          </form>
        </Card>
        <Card>
          <CardTitle>Active Plans</CardTitle>
          <Table><thead><tr><Th>Family</Th><Th>Total Under Plan</Th><Th>Status</Th><Th>Next Due</Th><Th>Approved By</Th></tr></thead><tbody>{plans.map((plan) => <tr key={plan.id}><Td>{plan.families?.guardian_full_name}</Td><Td>{money(plan.total_balance)}</Td><Td><Badge value={plan.status} /></Td><Td>{shortDate(plan.payment_plan_installments?.find((i: any) => i.status !== "paid")?.due_date ?? plan.created_at)}</Td><Td>{plan.approved_by}</Td></tr>)}</tbody></Table>
        </Card>
      </section>
    </>
  );
}
