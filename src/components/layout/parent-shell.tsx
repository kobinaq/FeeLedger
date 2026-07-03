import Link from "next/link";
import { BookOpen, CreditCard, FileText, HelpCircle, Home, ReceiptText } from "lucide-react";
import { requireParentProfile } from "@/features/auth/server";
import { getCurrentSchool } from "@/features/schools/queries";
import { NavLink } from "@/components/layout/nav-link";

const nav = [
  { href: "/parent/overview", label: "Home", icon: Home },
  { href: "/parent/children", label: "Children", icon: BookOpen },
  { href: "/parent/bills", label: "Bills", icon: FileText },
  { href: "/parent/payments", label: "Payments", icon: CreditCard },
  { href: "/parent/receipts", label: "Receipts", icon: ReceiptText },
  { href: "/parent/payment-plan", label: "Plan", icon: CreditCard },
  { href: "/parent/contact", label: "Contact", icon: HelpCircle }
];

export async function ParentShell({ children }: { children: React.ReactNode }) {
  const profile = await requireParentProfile();
  const school = profile.school_id ? await getCurrentSchool(profile.school_id) : null;
  return (
    <div className="min-h-screen bg-brand-bg pb-20">
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/parent/overview">
            <p className="text-lg font-bold text-brand-green">FeeLedger</p>
            <p className="text-sm text-slate-500">{school?.name ?? "Parent portal"}</p>
          </Link>
          <Link href="/logout" className="text-sm font-semibold text-slate-600">Logout</Link>
        </div>
      </header>
      <main className="mx-auto max-w-5xl p-5">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 grid grid-cols-5 border-t border-slate-200 bg-white p-2 sm:hidden">
        {nav.slice(0, 5).map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            className="flex flex-col items-center gap-1 rounded-md p-2 text-xs font-medium"
            activeClassName="bg-brand-greenDark text-white"
            inactiveClassName="text-slate-600"
            exact
          />
        ))}
      </nav>
      <nav className="mx-auto mt-4 hidden max-w-5xl gap-2 px-5 sm:flex">
        {nav.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            className="rounded-md px-3 py-2 text-sm font-semibold transition-colors"
            activeClassName="bg-white text-brand-greenDark shadow-soft"
            inactiveClassName="text-slate-600 hover:bg-white"
            exact
          />
        ))}
      </nav>
    </div>
  );
}
