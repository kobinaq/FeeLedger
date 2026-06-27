import { ReceiptCard } from "@/components/parent/receipt-card";
import { Button } from "@/components/ui/button";
import { getFamilyReceipts, getParentFamily } from "@/lib/data-access";

export default function ParentReceiptsPage() {
  const family = getParentFamily();
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-950">Your Receipts</h1>
      <p className="mt-1 text-sm text-slate-500">Open a receipt when you need proof of payment.</p>
      <div className="mt-5 space-y-3">{getFamilyReceipts(family.id).map((receipt) => <div key={receipt.id} className="space-y-2"><ReceiptCard receipt={receipt} /><Button variant="secondary">Download Receipt</Button></div>)}</div>
    </>
  );
}
