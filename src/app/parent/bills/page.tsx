import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getFamilyBills, getParentFamily, getStudent } from "@/lib/data-access";
import { money, shortDate } from "@/lib/utils";

export default function ParentBillsPage() {
  const family = getParentFamily();
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-950">Your Bills</h1>
      <p className="mt-1 text-sm text-slate-500">Bills are grouped by child so you can see what each bill is for.</p>
      <div className="mt-5 space-y-3">{getFamilyBills(family.id).map((bill) => <Card key={bill.id}><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{bill.billNumber}</p><p className="mt-1 text-sm text-slate-500">{getStudent(bill.studentId)?.firstName} - due {shortDate(bill.dueDate)}</p></div><Badge value={bill.status} /></div><div className="mt-4 grid grid-cols-3 gap-3 text-sm"><div><p className="text-slate-500">Bill</p><strong>{money(bill.totalAmount)}</strong></div><div><p className="text-slate-500">Paid</p><strong>{money(bill.paidAmount)}</strong></div><div><p className="text-slate-500">Left</p><strong>{money(bill.totalAmount - bill.paidAmount)}</strong></div></div></Card>)}</div>
    </>
  );
}
