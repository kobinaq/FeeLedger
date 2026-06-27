import { BookOpen, CreditCard, HelpCircle, ReceiptText } from "lucide-react";
import { BalanceCard } from "@/components/parent/balance-card";
import { ParentActionCard } from "@/components/parent/action-card";
import { ReceiptCard } from "@/components/parent/receipt-card";
import { Card, CardTitle } from "@/components/ui/card";
import { getFamilyBalance, getFamilyPlan, getFamilyReceipts, getFamilyStudents, getParentFamily } from "@/lib/data-access";
import { school } from "@/lib/demo-data";
import { money, shortDate } from "@/lib/utils";

export default function ParentOverviewPage() {
  const family = getParentFamily();
  const plan = getFamilyPlan(family.id);
  const next = plan?.installments.find((item) => item.status !== "paid");
  const latestReceipt = getFamilyReceipts(family.id)[0];
  return (
    <>
      <p className="text-sm font-semibold text-brand-amber">{school.name}</p>
      <h1 className="mt-1 text-2xl font-bold text-slate-950">Hello, {family.guardianName}</h1>
      <div className="mt-5"><BalanceCard label="Your Family Balance" value={money(getFamilyBalance(family.id))} hint={`Next payment due: ${next ? shortDate(next.dueDate) : "No payment due now"}`} /></div>
      <section className="mt-5 grid gap-3 sm:grid-cols-4">
        <ParentActionCard href="/parent/bills" icon={BookOpen} label="View Bills" hint="See what each child owes." />
        <ParentActionCard href="/parent/receipts" icon={ReceiptText} label="View Receipts" hint="Open or download receipts." />
        <ParentActionCard href="/parent/payment-plan" icon={CreditCard} label="Payment Plan" hint="Check your instalments." />
        <ParentActionCard href="/parent/contact" icon={HelpCircle} label="Contact School" hint="Reach the accounts office." />
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <Card><CardTitle>Children</CardTitle><div className="mt-3 space-y-2">{getFamilyStudents(family.id).map((s) => <div key={s.id} className="rounded-md bg-slate-50 p-3">{s.firstName} {s.lastName}</div>)}</div></Card>
        <Card><CardTitle>Latest Receipt</CardTitle><div className="mt-3">{latestReceipt ? <ReceiptCard receipt={latestReceipt} /> : <p className="text-sm text-slate-500">No receipt yet.</p>}</div></Card>
      </section>
    </>
  );
}
