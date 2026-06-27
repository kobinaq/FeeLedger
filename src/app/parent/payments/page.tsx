import { Card } from "@/components/ui/card";
import { getFamilyPayments, getParentFamily, getStudent } from "@/lib/data-access";
import { money, shortDate } from "@/lib/utils";

export default function ParentPaymentsPage() {
  const family = getParentFamily();
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-950">Your Payments</h1>
      <div className="mt-5 space-y-3">{getFamilyPayments(family.id).map((payment) => <Card key={payment.id} className="flex items-start justify-between gap-4"><div><p className="font-bold">{money(payment.amount)}</p><p className="mt-1 text-sm text-slate-500">{shortDate(payment.paymentDate)} - {payment.method}</p><p className="mt-1 text-sm text-slate-500">{getStudent(payment.studentId)?.firstName} - {payment.reference}</p></div><span className="text-sm font-semibold text-emerald-700">Received</span></Card>)}</div>
    </>
  );
}
