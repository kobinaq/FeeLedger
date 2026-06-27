import { Card } from "@/components/ui/card";
import { requireParentProfile } from "@/features/auth/server";
import { getParentFamily } from "@/features/families/queries";
import { money, shortDate } from "@/lib/utils";

export default async function ParentPaymentsPage() {
  const profile = await requireParentProfile();
  const family = await getParentFamily(profile.family_id!);
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-950">Your Payments</h1>
      <div className="mt-5 space-y-3">{family.payments?.map((payment: any) => <Card key={payment.id} className="flex items-start justify-between gap-4"><div><p className="font-bold">{money(payment.amount)}</p><p className="mt-1 text-sm text-slate-500">{shortDate(payment.payment_date)} - {payment.method}</p><p className="mt-1 text-sm text-slate-500">{payment.reference_number}</p></div><span className="text-sm font-semibold text-emerald-700">Received</span></Card>)}</div>
    </>
  );
}
