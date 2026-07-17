import { Card } from "@/components/ui/card";

export function BalanceCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="relative overflow-hidden border-0 bg-brand-green p-7 text-white shadow-panel">
      <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-brand-amber/25 blur-2xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-10 left-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" aria-hidden />
      <p className="relative text-sm font-medium text-emerald-100">{label}</p>
      <p className="relative mt-3 font-display text-5xl font-semibold tracking-tight">{value}</p>
      <p className="relative mt-4 text-sm text-emerald-100/90">{hint}</p>
    </Card>
  );
}
