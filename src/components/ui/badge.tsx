import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  partially_paid: "bg-amber-50 text-amber-700 ring-amber-200",
  published: "bg-blue-50 text-blue-700 ring-blue-200",
  overdue: "bg-red-50 text-red-700 ring-red-200",
  draft: "bg-slate-100 text-slate-700 ring-slate-200",
  active: "bg-blue-50 text-blue-700 ring-blue-200",
  on_track: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  pending: "bg-slate-100 text-slate-700 ring-slate-200",
  sent: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  scheduled: "bg-blue-50 text-blue-700 ring-blue-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
  inactive: "bg-slate-100 text-slate-700 ring-slate-200"
};

export function Badge({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1", tones[value] ?? tones.draft, className)}>
      {value.replaceAll("_", " ")}
    </span>
  );
}
