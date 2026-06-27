import Link from "next/link";
import { Banknote, Bell, BookOpen, ChartColumn, CreditCard, FileText, Home, Landmark, ReceiptText, Settings, Users } from "lucide-react";
import { school } from "@/lib/demo-data";

const nav = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/students", label: "Students", icon: BookOpen },
  { href: "/admin/families", label: "Families", icon: Users },
  { href: "/admin/fee-setup", label: "Fee Setup", icon: Landmark },
  { href: "/admin/bills", label: "Bills", icon: FileText },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/receipts", label: "Receipts", icon: ReceiptText },
  { href: "/admin/payment-plans", label: "Plans", icon: Banknote },
  { href: "/admin/reminders", label: "Reminders", icon: Bell },
  { href: "/admin/arrears", label: "Arrears", icon: ChartColumn },
  { href: "/admin/reports", label: "Reports", icon: ChartColumn },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-bg lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="bg-brand-green p-4 text-white lg:min-h-screen">
        <Link href="/admin/dashboard" className="block rounded-md px-3 py-3">
          <p className="text-lg font-bold">FeeLedger</p>
          <p className="text-sm text-emerald-100">{school.name}</p>
        </Link>
        <nav className="mt-5 grid grid-cols-2 gap-1 lg:grid-cols-1">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-emerald-50 hover:bg-white/10">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>
        <header className="no-print flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-5">
          <p className="font-semibold text-slate-950">2026 Term 1</p>
          <div className="text-sm text-slate-500">Signed in as Accountant</div>
        </header>
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
