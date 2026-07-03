import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-brand-line">
      <table className={cn("w-full min-w-[680px] border-separate border-spacing-0 bg-white text-left text-sm", className)} {...props} />
    </div>
  );
}

export function Th(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th {...props} className={cn("border-b border-brand-line bg-slate-50 px-3 py-3 text-xs font-semibold uppercase text-brand-muted", props.className)} />;
}

export function Td(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} className={cn("border-b border-slate-100 px-3 py-3 text-slate-700", props.className)} />;
}
