import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-brand-line/80">
      <table className={cn("w-full min-w-[680px] border-separate border-spacing-0 bg-white text-left text-sm", className)} {...props} />
    </div>
  );
}

export function Th(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={cn(
        "border-b border-brand-line bg-brand-greenSoft/50 px-3 py-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-brand-muted",
        props.className
      )}
    />
  );
}

export function Td(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} className={cn("border-b border-brand-mist px-3 py-3 text-brand-ink/80", props.className)} />;
}
