import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "min-h-11 w-full rounded-xl border border-brand-line bg-white px-3 text-sm outline-none transition placeholder:text-brand-muted/70 focus:border-brand-green focus:ring-2 focus:ring-brand-green/15",
        props.className
      )}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "min-h-11 w-full rounded-xl border border-brand-line bg-white px-3 text-sm outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/15",
        props.className
      )}
    />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-24 w-full rounded-xl border border-brand-line bg-white px-3 py-2 text-sm outline-none transition placeholder:text-brand-muted/70 focus:border-brand-green focus:ring-2 focus:ring-brand-green/15",
        props.className
      )}
    />
  );
}
