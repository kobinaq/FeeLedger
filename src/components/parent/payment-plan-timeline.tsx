import { Badge } from "@/components/ui/badge";
import { money, shortDate } from "@/lib/utils";
type InstallmentLike = {
  id: string;
  dueDate?: string;
  due_date?: string;
  amount: number;
  paidAmount?: number;
  paid_amount?: number;
  status: string;
};

export function PaymentPlanTimeline({ installments }: { installments: InstallmentLike[] }) {
  return (
    <div className="space-y-3">
      {installments.map((item) => (
        <div key={item.id} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4">
          <div className="mt-1 h-3 w-3 rounded-full bg-brand-amber" />
          <div className="flex-1">
            <p className="font-semibold text-slate-950">{money(item.amount)} due {shortDate(item.dueDate ?? item.due_date ?? new Date().toISOString())}</p>
            <p className="mt-1 text-sm text-slate-500">Paid so far: {money(item.paidAmount ?? item.paid_amount ?? 0)}</p>
          </div>
          <Badge value={item.status} />
        </div>
      ))}
    </div>
  );
}
