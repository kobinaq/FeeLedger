import { Card } from "@/components/ui/card";

export function BalanceCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="bg-brand-green p-6 text-white">
      <p className="text-sm font-medium text-emerald-100">{label}</p>
      <p className="mt-3 text-4xl font-bold">{value}</p>
      <p className="mt-3 text-sm text-emerald-100">{hint}</p>
    </Card>
  );
}
