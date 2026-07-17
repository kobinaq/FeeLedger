import Link from "next/link";
import { recordPaymentAction } from "@/features/payments/actions";
import { requireAdminNav } from "@/features/auth/server";
import { getBills } from "@/features/bills/queries";
import { familyBalance, getFamilies } from "@/features/families/queries";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input, Select, Textarea } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { StepperForm } from "@/components/ui/stepper-form";
import { SuccessState } from "@/components/ui/success-state";
import { money } from "@/lib/utils";

export default async function NewPaymentPage({ searchParams }: { searchParams?: Promise<{ success?: string }> }) {
  const params = await searchParams;
  const profile = await requireAdminNav("payments");
  const [families, bills] = await Promise.all([getFamilies(profile.school_id!), getBills(profile.school_id!)]);
  const firstFamily = families[0];
  const firstBalance = firstFamily ? familyBalance(firstFamily) : 0;
  return (
    <>
      <PageHeader title="Record Payment" />
      <StepperForm current={params?.success ? 4 : 2} steps={["Search family/student", "Confirm balance", "Enter payment", "Generate receipt"]} />
      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <Card>
          <CardTitle>Payment Details</CardTitle>
          <form action={recordPaymentAction} className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="block text-sm font-semibold">Family account<Select className="mt-1" name="familyId" required>{families.map((family) => <option key={family.id} value={family.id}>{family.guardian_full_name} - {family.phone} - {money(familyBalance(family))}</option>)}</Select></label>
            <label className="block text-sm font-semibold">Bill<Select className="mt-1" name="billId"><option value="">Allocate to family balance</option>{bills.filter((bill) => bill.status !== "paid").map((bill) => <option key={bill.id} value={bill.id}>{bill.bill_number} - {bill.students?.first_name} - {money(bill.total_amount - bill.paid_amount)}</option>)}</Select></label>
            <label className="block text-sm font-semibold">Amount<Input className="mt-1" name="amount" type="number" min="1" step="0.01" placeholder="500" required /></label>
            <label className="block text-sm font-semibold">Payment method<Select className="mt-1" name="method"><option>cash</option><option>mobile money</option><option>bank transfer</option><option>cheque</option><option>card/POS</option><option>other</option></Select></label>
            <label className="block text-sm font-semibold">Reference number<Input className="mt-1" name="reference" placeholder="MOMO-12345" required /></label>
            <label className="block text-sm font-semibold">Payment date<Input className="mt-1" name="paymentDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></label>
            <label className="md:col-span-2 block text-sm font-semibold">Notes<Textarea className="mt-1" name="notes" placeholder="Optional note for the receipt" /></label>
            <Button className="md:col-span-2" type="submit">Record Payment and Generate Receipt</Button>
          </form>
        </Card>
        <div className="space-y-4">
          <Card><p className="text-sm text-slate-500">Outstanding balance before payment</p><p className="mt-2 text-3xl font-bold">{money(firstBalance)}</p></Card>
          {params?.success ? <SuccessState title="Payment recorded" message="A receipt has been generated, the bill status has been updated, and the parent portal will show the payment."><div className="flex flex-wrap gap-2"><Button>Print Receipt</Button><Button variant="secondary">Send Receipt</Button><Link href="/admin/payments/new"><Button variant="secondary">Record Another Payment</Button></Link><Link href="/admin/payments"><Button variant="secondary">View Payments</Button></Link></div></SuccessState> : null}
        </div>
      </div>
    </>
  );
}
