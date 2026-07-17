import { BookOpen, CreditCard, HelpCircle, ReceiptText } from "lucide-react";
import { requireParentProfile } from "@/features/auth/server";
import { familyBalance, getParentFamily } from "@/features/families/queries";
import { getCurrentSchool } from "@/features/schools/queries";
import { BalanceCard } from "@/components/parent/balance-card";
import { ParentActionCard } from "@/components/parent/action-card";
import { PayNowForm } from "@/components/parent/pay-now-form";
import { ReceiptCard } from "@/components/parent/receipt-card";
import { Card, CardTitle } from "@/components/ui/card";
import { money, shortDate } from "@/lib/utils";

export default async function ParentOverviewPage() {
  const profile = await requireParentProfile();
  const [family, school] = await Promise.all([getParentFamily(profile.family_id!), getCurrentSchool(profile.school_id!)]);
  const plan = family.payment_plans?.[0];
  const next = plan?.payment_plan_installments?.find((item) => item.status !== "paid");
  const latestReceipt = family.receipts?.[0];
  const balance = familyBalance(family);
  return (
    <>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-amber">{school.name}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-brand-ink">Hello, {family.guardian_full_name}</h1>
      <p className="mt-2 text-sm text-brand-muted">Your family balance and next steps are below.</p>
      <div className="mt-6">
        <BalanceCard
          label="Your Family Balance"
          value={money(balance)}
          hint={`Next payment due: ${next ? shortDate(next.due_date) : "No payment due now"}`}
        />
        <PayNowForm amountDue={balance} />
      </div>
      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ParentActionCard href="/parent/bills" icon={BookOpen} label="View Bills" hint="See what each child owes." />
        <ParentActionCard href="/parent/receipts" icon={ReceiptText} label="View Receipts" hint="Open or download receipts." />
        <ParentActionCard href="/parent/payment-plan" icon={CreditCard} label="Payment Plan" hint="Check your instalments." />
        <ParentActionCard href="/parent/contact" icon={HelpCircle} label="Contact School" hint="Reach the accounts office." />
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <CardTitle>Children</CardTitle>
          <div className="mt-3 space-y-2">
            {family.students?.map((s) => (
              <div key={s.id} className="rounded-xl bg-brand-greenSoft/60 px-3 py-3 text-sm font-medium text-brand-ink">
                {s.first_name} {s.last_name}
                {s.classes?.name ? <span className="mt-0.5 block text-xs font-normal text-brand-muted">{s.classes.name}</span> : null}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <CardTitle>Latest Receipt</CardTitle>
          <div className="mt-3">
            {latestReceipt ? <ReceiptCard receipt={latestReceipt} /> : <p className="text-sm text-brand-muted">No receipt yet.</p>}
          </div>
        </Card>
      </section>
    </>
  );
}
