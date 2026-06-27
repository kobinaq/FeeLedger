import Link from "next/link";
import { Building2, CreditCard } from "lucide-react";

const nav = [
  { href: "/platform/schools", label: "Schools", icon: Building2 },
  { href: "/platform/subscriptions", label: "Subscriptions", icon: CreditCard }
];

export function PlatformShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/platform/schools" className="text-lg font-bold">FeeLedger Platform</Link>
          <nav className="flex gap-2">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-white/10">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-6 text-slate-950">{children}</main>
    </div>
  );
}
