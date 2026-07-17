import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  tone = "default"
}: {
  label: string;
  value: string;
  hint: string;
  tone?: "default" | "success" | "warning";
}) {
  const tones = {
    default: "bg-brand-green",
    success: "bg-brand-success",
    warning: "bg-brand-amber"
  };

  return (
    <Card className="relative overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <span className={cn("absolute inset-x-0 top-0 h-1", tones[tone])} />
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-brand-muted">{label}</p>
      <p className="mt-3 font-display text-3xl font-semibold text-brand-ink">{value}</p>
      <p className="mt-2 text-sm leading-5 text-brand-muted">{hint}</p>
    </Card>
  );
}
