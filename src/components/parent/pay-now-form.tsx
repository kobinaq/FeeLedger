import { CreditCard } from "lucide-react";
import { initiateParentPaystackPaymentAction } from "@/features/payments/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { money } from "@/lib/utils";

type PayNowFormProps = {
  amountDue: number;
  billId?: string;
  studentId?: string;
  paymentPlanId?: string;
  compact?: boolean;
};

export function PayNowForm({ amountDue, billId, studentId, paymentPlanId, compact = false }: PayNowFormProps) {
  if (amountDue <= 0) return null;
  return (
    <form action={initiateParentPaystackPaymentAction} className={compact ? "flex flex-col gap-2 sm:flex-row" : "mt-4 grid gap-3 sm:grid-cols-[1fr_auto]"}>
      <input type="hidden" name="billId" value={billId ?? ""} />
      <input type="hidden" name="studentId" value={studentId ?? ""} />
      <input type="hidden" name="paymentPlanId" value={paymentPlanId ?? ""} />
      <label className="sr-only" htmlFor={`amount-${billId ?? paymentPlanId ?? "family"}`}>Amount to pay</label>
      <Input
        id={`amount-${billId ?? paymentPlanId ?? "family"}`}
        name="amount"
        type="number"
        min="1"
        max={amountDue}
        step="0.01"
        defaultValue={amountDue.toFixed(2)}
        aria-label={`Amount to pay, up to ${money(amountDue)}`}
      />
      <Button>
        <CreditCard className="h-4 w-4" />
        Pay now
      </Button>
    </form>
  );
}
