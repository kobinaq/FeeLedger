import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn("min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20", props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20", props.className)} />;
}
