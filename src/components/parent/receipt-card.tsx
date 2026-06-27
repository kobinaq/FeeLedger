import { ReceiptText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { money, shortDate } from "@/lib/utils";
import type { Receipt } from "@/types";

export function ReceiptCard({ receipt }: { receipt: Receipt }) {
  return (
    <Card className="flex items-start gap-3">
      <ReceiptText className="mt-1 h-5 w-5 text-brand-green" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-950">{receipt.receiptNumber}</p>
        <p className="text-sm text-slate-500">{shortDate(receipt.date)} by {receipt.method}</p>
      </div>
      <p className="font-bold text-slate-950">{money(receipt.amount)}</p>
    </Card>
  );
}
