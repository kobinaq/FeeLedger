import Link from "next/link";
import { CreditCard } from "lucide-react";
import { requireParentProfile } from "@/features/auth/server";
import { verifyAndRecordPaystackPayment } from "@/features/payments/paystack-processing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default async function PaystackCallbackPage({ searchParams }: { searchParams?: Promise<{ reference?: string }> }) {
  await requireParentProfile();
  const params = await searchParams;
  const reference = params?.reference;
  let status: string = "missing";
  let message = "We could not find the payment reference.";

  if (reference) {
    try {
      const result = await verifyAndRecordPaystackPayment(reference);
      status = result.status;
      message = result.status === "success"
        ? "Payment received. Your receipt and balance have been updated."
        : "Paystack has not confirmed this payment yet.";
    } catch (error) {
      status = "failed";
      message = error instanceof Error ? error.message : "Payment verification failed.";
    }
  }

  return (
    <Card className="mx-auto max-w-xl text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-brand-green">
        <CreditCard className="h-6 w-6" />
      </div>
      <h1 className="mt-4 text-2xl font-bold text-slate-950">{status === "success" ? "Payment Confirmed" : "Payment Check"}</h1>
      <p className="mt-2 text-sm text-slate-500">{message}</p>
      {reference ? <p className="mt-3 text-xs font-semibold text-slate-500">Reference: {reference}</p> : null}
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/parent/receipts"><Button>View Receipts</Button></Link>
        <Link href="/parent/overview"><Button variant="secondary">Home</Button></Link>
      </div>
    </Card>
  );
}
