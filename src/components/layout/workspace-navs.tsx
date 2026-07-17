"use client";

import { Banknote, Bell, BookOpen, Building2, ChartColumn, CreditCard, FileText, HelpCircle, Home, Landmark, ReceiptText, Settings, Users } from "lucide-react";
import { NavLink } from "@/components/layout/nav-link";
import { canViewAdminNav, type AdminNavKey } from "@/features/auth/permissions";
import type { Role } from "@/types";

const adminNav: Array<{ href: string; label: string; icon: typeof Home; key: AdminNavKey }> = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home, key: "dashboard" },
  { href: "/admin/students", label: "Students", icon: BookOpen, key: "students" },
  { href: "/admin/families", label: "Families", icon: Users, key: "families" },
  { href: "/admin/fee-setup", label: "Fee Setup", icon: Landmark, key: "fee-setup" },
  { href: "/admin/bills", label: "Bills", icon: FileText, key: "bills" },
  { href: "/admin/payments", label: "Payments", icon: CreditCard, key: "payments" },
  { href: "/admin/receipts", label: "Receipts", icon: ReceiptText, key: "receipts" },
  { href: "/admin/payment-plans", label: "Plans", icon: Banknote, key: "plans" },
  { href: "/admin/reminders", label: "Reminders", icon: Bell, key: "reminders" },
  { href: "/admin/arrears", label: "Arrears", icon: ChartColumn, key: "arrears" },
  { href: "/admin/reports", label: "Reports", icon: ChartColumn, key: "reports" },
  { href: "/admin/settings", label: "Settings", icon: Settings, key: "settings" }
];

const parentNav = [
  { href: "/parent/overview", label: "Home", icon: Home },
  { href: "/parent/children", label: "Children", icon: BookOpen },
  { href: "/parent/bills", label: "Bills", icon: FileText },
  { href: "/parent/payments", label: "Payments", icon: CreditCard },
  { href: "/parent/receipts", label: "Receipts", icon: ReceiptText },
  { href: "/parent/payment-plan", label: "Plan", icon: CreditCard },
  { href: "/parent/contact", label: "Contact", icon: HelpCircle }
];

const platformNav = [
  { href: "/platform/schools", label: "Schools", icon: Building2 },
  { href: "/platform/subscriptions", label: "Subscriptions", icon: CreditCard }
];

export function AdminNav({ role }: { role: Role | string }) {
  const items = adminNav.filter((item) => canViewAdminNav(role, item.key));
  return (
    <nav className="mt-5 grid grid-cols-2 gap-1 lg:grid-cols-1">
      {items.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
          activeClassName="bg-white text-brand-greenDark shadow-soft"
          inactiveClassName="text-emerald-50 hover:bg-white/10"
        />
      ))}
    </nav>
  );
}

export function ParentMobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 grid grid-cols-5 border-t border-slate-200 bg-white p-2 sm:hidden">
      {parentNav.slice(0, 5).map((item) => (
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
  );
}

export function ParentDesktopNav() {
  return (
    <nav className="mx-auto mt-4 hidden max-w-5xl gap-2 px-5 sm:flex">
      {parentNav.map((item) => (
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
  );
}

export function PlatformNav() {
  return (
    <nav className="flex gap-2">
      {platformNav.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          label={item.label}
          icon={item.icon}
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
          activeClassName="bg-white text-slate-950"
          inactiveClassName="text-slate-200 hover:bg-white/10"
        />
      ))}
    </nav>
  );
}
