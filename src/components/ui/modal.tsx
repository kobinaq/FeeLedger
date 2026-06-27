import { Card } from "@/components/ui/card";

export function Modal({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border-dashed">
      <h2 className="font-semibold text-slate-950">{title}</h2>
      <div className="mt-3">{children}</div>
    </Card>
  );
}
