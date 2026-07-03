import { PaymentPlanTimeline } from "@/components/parent/payment-plan-timeline";
import { PayNowForm } from "@/components/parent/pay-now-form";
import { Card } from "@/components/ui/card";
import { requireParentProfile } from "@/features/auth/server";
import { getParentFamily } from "@/features/families/queries";
import { money } from "@/lib/utils";

export default async function ParentPaymentPlanPage() {
  const profile = await requireParentProfile();
  const family = await getParentFamily(profile.family_id!);
  const plan = family.payment_plans?.[0];
  const next = plan?.payment_plan_installments?.find((item) => item.status !== "paid");
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-950">Payment Plan</h1>
      {plan ? <><Card className="mt-5"><p className="text-sm text-slate-500">Balance under plan</p><p className="mt-2 text-3xl font-bold">{money(plan.total_balance)}</p><p className="mt-2 text-sm text-slate-500">{plan.notes}</p><PayNowForm amountDue={next ? Number(next.amount) - Number(next.paid_amount) : Number(plan.total_balance)} paymentPlanId={plan.id} /></Card><div className="mt-5"><PaymentPlanTimeline installments={plan.payment_plan_installments ?? []} /></div></> : <Card className="mt-5"><p className="font-semibold">No active payment plan</p><p className="mt-1 text-sm text-slate-500">Please contact the accounts office if you need help arranging instalments.</p></Card>}
    </>
  );
}
