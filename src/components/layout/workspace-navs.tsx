"use client";

import { Banknote, Bell, BookOpen, Building2, ChartColumn, CreditCard, FileText, HelpCircle, Home, Landmark, MoreHorizontal, ReceiptText, Settings, Users } from "lucide-react";
import { NavLink } from "@/components/layout/nav-link";
import type { Role } from "@/types";
import { canManageBilling, canManageSettings, canRecordPayment, canSendReminders } from "@/features/auth/permissions";

type NavItem = { href: string; label: string; icon: typeof Home; roles?: Role[] | "staff" };

const adminNav: NavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: Home },
  { href: "/admin/students", label: "Students", icon: BookOpen, roles: ["school_admin", "accountant", "headteacher"] },
  { href: "/admin/families", label: "Families", icon: Users },
  { href: "/admin/fee-setup", label: "Fee Setup", icon: Landmark, roles: ["school_admin", "accountant"] },
  { href: "/admin/bills", label: "Bills", icon: FileText, roles: ["school_admin", "accountant", "headteacher"] },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/receipts", label: "Receipts", icon: ReceiptText },
  { href: "/admin/payment-plans", label: "Plans", icon: Banknote, roles: ["school_admin", "accountant", "headteacher"] },
  { href: "/admin/reminders", label: "Reminders", icon: Bell, roles: ["school_admin", "accountant", "cashier"] },
  { href: "/admin/arrears", label: "Arrears", icon: ChartColumn },
  { href: "/admin/reports", label: "Reports", icon: ChartColumn },
  { href: "/admin/settings", label: "Settings", icon: Settings, roles: ["school_admin"] }
];

const cashierNav = adminNav.filter((item) =>
  ["/admin/payments", "/admin/receipts", "/admin/families", "/admin/reminders", "/admin/arrears"].includes(item.href)
);

const parentNav = [
  { href: "/parent/overview", label: "Home", icon: Home },
  { href: "/parent/bills", label: "Bills", icon: FileText },
  { href: "/parent/payments", label: "Payments", icon: CreditCard },
  { href: "/parent/receipts", label: "Receipts", icon: ReceiptText },
  { href: "/parent/payment-plan", label: "Plan", icon: CreditCard },
  { href: "/parent/children", label: "Children", icon: BookOpen },
  { href: "/parent/contact", label: "Contact", icon: HelpCircle }
];

const platformNav = [
  { href: "/platform/schools", label: "Schools", icon: Building2 },
  { href: "/platform/subscriptions", label: "Subscriptions", icon: CreditCard }
];

function visibleAdminNav(role?: Role | null) {
  if (role === "cashier") return cashierNav;
  return adminNav.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(role as Role);
  });
}

export function AdminNav({ role }: { role?: Role | null }) {
  const items = visibleAdminNav(role);
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
  const primary = parentNav.slice(0, 4);
  const more = parentNav.slice(4);
  return (
    <nav className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white p-2 sm:hidden">
      <div className="grid grid-cols-5 gap-1">
        {primary.map((item) => (
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
        <details className="relative">
          <summary className="flex cursor-pointer list-none flex-col items-center gap-1 rounded-md p-2 text-xs font-medium text-slate-600">
            <MoreHorizontal className="h-4 w-4" />
            More
          </summary>
          <div className="absolute bottom-14 right-0 z-20 min-w-40 rounded-md border border-slate-200 bg-white p-2 shadow-panel">
            {more.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                icon={item.icon}
                className="mb-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium"
                activeClassName="bg-brand-greenDark text-white"
                inactiveClassName="text-slate-700 hover:bg-slate-50"
                exact
              />
            ))}
          </div>
        </details>
      </div>
    </nav>
  );
}

export function ParentDesktopNav() {
  return (
    <nav className="mx-auto hidden max-w-5xl gap-2 px-5 sm:flex">
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

export function canShowBillingForms(role?: string | null) {
  return canManageBilling(role);
}

export function canShowPaymentForms(role?: string | null) {
  return canRecordPayment(role);
}

export function canShowReminderForms(role?: string | null) {
  return canSendReminders(role);
}

export function canShowSettingsForms(role?: string | null) {
  return canManageSettings(role);
}
