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
    <Card className="flex items-start gap-3 border-brand-line/70 p-4 shadow-none">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-greenSoft text-brand-green">
        <ReceiptText className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-brand-ink">{receiptNumber}</p>
        <p className="text-sm text-brand-muted">
          {shortDate(date)} by {receipt.method}
        </p>
      </div>
      <p className="font-display text-lg font-semibold text-brand-ink">{money(receipt.amount)}</p>
    </Card>
  );
}
