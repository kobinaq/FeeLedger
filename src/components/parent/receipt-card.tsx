import { ReceiptText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { money, shortDate } from "@/lib/utils";
type ReceiptLike = {
  receiptNumber?: string;
  receipt_number?: string;
  date?: string;
  receipt_date?: string;
  method: string;
  amount: number;
};

export function ReceiptCard({ receipt }: { receipt: ReceiptLike }) {
  const receiptNumber = receipt.receiptNumber ?? receipt.receipt_number ?? "Receipt";
  const date = receipt.date ?? receipt.receipt_date ?? new Date().toISOString();
  return (
    <Card className="flex items-start gap-3">
      <ReceiptText className="mt-1 h-5 w-5 text-brand-green" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-slate-950">{receiptNumber}</p>
        <p className="text-sm text-slate-500">{shortDate(date)} by {receipt.method}</p>
      </div>
      <p className="font-bold text-slate-950">{money(receipt.amount)}</p>
    </Card>
  );
}
