import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ConfirmDialog({ title, message, action }: { title: string; message: string; action: string }) {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <h3 className="font-semibold text-slate-950">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{message}</p>
      <Button className="mt-4">{action}</Button>
    </Card>
  );
}
