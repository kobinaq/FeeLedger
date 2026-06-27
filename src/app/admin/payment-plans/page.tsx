import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StepperForm } from "@/components/ui/stepper-form";
import { Td, Th, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { families, paymentPlanInstallments, paymentPlans } from "@/lib/demo-data";
import { getFamily, getFamilyBalance } from "@/lib/data-access";
import { money, shortDate } from "@/lib/utils";

export default function PaymentPlansPage() {
  return (
    <>
      <PageHeader title="Payment Plans" description="Create and track family-level instalment plans." action="Create Payment Plan" />
      <StepperForm current={2} steps={["Confirm Family Balance", "Add Instalments", "Review Plan", "Save and Notify Parent"]} />
      <section className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <Card>
          <CardTitle>Plan Builder</CardTitle>
          <form className="mt-4 space-y-4">
            <label className="block text-sm font-semibold">Family<Select className="mt-1">{families.map((family) => <option key={family.id}>{family.guardianName} - {money(getFamilyBalance(family.id))}</option>)}</Select></label>
            <div className="rounded-md bg-slate-50 p-3 text-sm">Split the outstanding balance into clear dates and amounts. Instalments must equal the plan total before saving.</div>
            <Button className="w-full">Save and Notify Parent</Button>
          </form>
        </Card>
        <Card>
          <CardTitle>Active Plans</CardTitle>
          <Table><thead><tr><Th>Family</Th><Th>Total Under Plan</Th><Th>Status</Th><Th>Next Due</Th><Th>Approved By</Th></tr></thead><tbody>{paymentPlans.map((plan) => <tr key={plan.id}><Td>{getFamily(plan.familyId)?.guardianName}</Td><Td>{money(plan.totalBalance)}</Td><Td><Badge value={plan.status} /></Td><Td>{shortDate(paymentPlanInstallments.find((i) => i.planId === plan.id && i.status !== "paid")?.dueDate ?? "2026-03-15")}</Td><Td>{plan.approvedBy}</Td></tr>)}</tbody></Table>
        </Card>
      </section>
    </>
  );
}
