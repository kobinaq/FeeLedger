import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function ParentActionCard({
  href,
  icon: Icon,
  label,
  hint
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  hint: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-brand-line/80 bg-white/95 p-4 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-brand-green/30 hover:shadow-lift"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-greenSoft text-brand-green">
        <Icon className="h-5 w-5" />
      </div>
      <p className="mt-3 font-semibold text-brand-ink">{label}</p>
      <p className="mt-1 text-sm text-brand-muted">{hint}</p>
    </Link>
  );
}
