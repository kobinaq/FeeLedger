import { PaymentPlanTimeline } from "@/components/parent/payment-plan-timeline";
import { Card } from "@/components/ui/card";
import { getFamilyPlan, getParentFamily } from "@/lib/data-access";
import { money } from "@/lib/utils";

export default function ParentPaymentPlanPage() {
  const family = getParentFamily();
  const plan = getFamilyPlan(family.id);
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-950">Payment Plan</h1>
      {plan ? <><Card className="mt-5"><p className="text-sm text-slate-500">Balance under plan</p><p className="mt-2 text-3xl font-bold">{money(plan.totalBalance)}</p><p className="mt-2 text-sm text-slate-500">{plan.notes}</p></Card><div className="mt-5"><PaymentPlanTimeline installments={plan.installments} /></div></> : <Card className="mt-5"><p className="font-semibold">No active payment plan</p><p className="mt-1 text-sm text-slate-500">Please contact the accounts office if you need help arranging instalments.</p></Card>}
    </>
  );
}
