import { Badge } from "@/components/ui/badge";
import { money, shortDate } from "@/lib/utils";
import type { PaymentPlanInstallment } from "@/types";

export function PaymentPlanTimeline({ installments }: { installments: PaymentPlanInstallment[] }) {
  return (
    <div className="space-y-3">
      {installments.map((item) => (
        <div key={item.id} className="flex gap-3 rounded-lg border border-slate-200 bg-white p-4">
          <div className="mt-1 h-3 w-3 rounded-full bg-brand-amber" />
          <div className="flex-1">
            <p className="font-semibold text-slate-950">{money(item.amount)} due {shortDate(item.dueDate)}</p>
            <p className="mt-1 text-sm text-slate-500">Paid so far: {money(item.paidAmount)}</p>
          </div>
          <Badge value={item.status} />
        </div>
      ))}
    </div>
  );
}
