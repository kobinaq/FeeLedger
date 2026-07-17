import Link from "next/link";
import { ReceiptCard } from "@/components/parent/receipt-card";
import { requireParentProfile } from "@/features/auth/server";
import { getParentFamily } from "@/features/families/queries";

export default async function ParentReceiptsPage() {
  const profile = await requireParentProfile();
  const family = await getParentFamily(profile.family_id!);
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-950">Your Receipts</h1>
      <p className="mt-1 text-sm text-slate-500">Open a receipt when you need proof of payment.</p>
      <div className="mt-5 space-y-3">
        {family.receipts?.map((receipt) => (
          <Link key={receipt.id} href={`/parent/receipts/${receipt.id}`} className="block">
            <ReceiptCard receipt={receipt} />
          </Link>
        ))}
      </div>
    </>
  );
}
