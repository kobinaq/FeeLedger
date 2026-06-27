import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function SuccessState({ title, message, children }: { title: string; message: string; children?: React.ReactNode }) {
  return (
    <Card className="border-emerald-200 bg-emerald-50">
      <div className="flex gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
        <div>
          <h3 className="font-semibold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">{message}</p>
          {children ? <div className="mt-4">{children}</div> : null}
        </div>
      </div>
    </Card>
  );
}
