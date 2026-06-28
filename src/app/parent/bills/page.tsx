import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PayNowForm } from "@/components/parent/pay-now-form";
import { requireParentProfile } from "@/features/auth/server";
import { getParentFamily } from "@/features/families/queries";
import { money, shortDate } from "@/lib/utils";

export default async function ParentBillsPage() {
  const profile = await requireParentProfile();
  const family = await getParentFamily(profile.family_id!);
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-950">Your Bills</h1>
      <p className="mt-1 text-sm text-slate-500">Bills are grouped by child so you can see what each bill is for.</p>
      <div className="mt-5 space-y-3">{family.bills?.map((bill: any) => {
        const left = Number(bill.total_amount) - Number(bill.paid_amount);
        return <Card key={bill.id}><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{bill.bill_number}</p><p className="mt-1 text-sm text-slate-500">Due {shortDate(bill.due_date)}</p></div><Badge value={bill.status} /></div><div className="mt-4 grid grid-cols-3 gap-3 text-sm"><div><p className="text-slate-500">Bill</p><strong>{money(bill.total_amount)}</strong></div><div><p className="text-slate-500">Paid</p><strong>{money(bill.paid_amount)}</strong></div><div><p className="text-slate-500">Left</p><strong>{money(left)}</strong></div></div><PayNowForm amountDue={left} billId={bill.id} studentId={bill.student_id} compact /></Card>;
      })}</div>
    </>
  );
}
