import { Check } from "lucide-react";

export function StepperForm({ steps, current = 0 }: { steps: string[]; current?: number }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-3 rounded-md border border-slate-200 bg-white p-3 text-sm">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-white">
            {index < current ? <Check className="h-4 w-4" /> : index + 1}
          </span>
          <span className="font-medium text-slate-700">{step}</span>
        </li>
      ))}
    </ol>
  );
}
