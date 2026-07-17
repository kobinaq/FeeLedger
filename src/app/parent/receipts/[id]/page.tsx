import { notFound } from "next/navigation";
import { requireParentProfile } from "@/features/auth/server";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { PrintButton } from "@/components/ui/print-button";
import { money, shortDate } from "@/lib/utils";

export default async function ParentReceiptDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await requireParentProfile();
  const supabase = await createClient();
  const { data: receipt } = await supabase
    .from("receipts")
    .select("*, families(*), students(*), schools(*)")
    .eq("id", id)
    .eq("family_id", profile.family_id!)
    .maybeSingle();
  if (!receipt) notFound();

  return (
    <main className="mx-auto max-w-2xl">
      <div className="no-print mb-4">
        <PrintButton />
      </div>
      <Card className="bg-white p-8">
        <div className="border-b border-slate-200 pb-5 text-center">
          <h1 className="text-2xl font-bold text-brand-green">{receipt.schools?.name ?? "School"}</h1>
          <p className="mt-1 text-sm text-slate-500">{receipt.schools?.address}</p>
        </div>
        <section className="mt-6 grid gap-4 text-sm">
          <div className="flex justify-between">
            <span>Receipt Number</span>
            <strong>{receipt.receipt_number}</strong>
          </div>
          <div className="flex justify-between">
            <span>Date</span>
            <strong>{shortDate(receipt.receipt_date)}</strong>
          </div>
          <div className="flex justify-between">
            <span>Family</span>
            <strong>{receipt.families?.guardian_full_name}</strong>
          </div>
          <div className="flex justify-between">
            <span>Method</span>
            <strong>{receipt.method}</strong>
          </div>
        </section>
        <div className="mt-8 rounded-lg bg-slate-50 p-5 text-center">
          <p className="text-sm text-slate-500">Amount Paid</p>
          <p className="mt-2 text-4xl font-bold text-slate-950">{money(receipt.amount)}</p>
        </div>
      </Card>
    </main>
  );
}
