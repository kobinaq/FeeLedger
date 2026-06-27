import { Inbox } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <Card className="flex flex-col items-center justify-center py-10 text-center">
      <Inbox className="h-9 w-9 text-slate-400" aria-hidden="true" />
      <h3 className="mt-3 font-semibold text-slate-950">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{message}</p>
    </Card>
  );
}
