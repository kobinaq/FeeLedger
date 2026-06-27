import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function ParentActionCard({ href, icon: Icon, label, hint }: { href: string; icon: LucideIcon; label: string; hint: string }) {
  return (
    <Link href={href} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand-green">
      <Icon className="h-5 w-5 text-brand-green" />
      <p className="mt-3 font-semibold text-slate-950">{label}</p>
      <p className="mt-1 text-sm text-slate-500">{hint}</p>
    </Link>
  );
}
