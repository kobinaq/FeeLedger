"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  label: string;
  icon?: LucideIcon;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  exact?: boolean;
  compact?: boolean;
};

export function NavLink({
  href,
  label,
  icon: Icon,
  className,
  activeClassName,
  inactiveClassName,
  exact = false,
  compact = false
}: NavLinkProps) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(className, active ? activeClassName : inactiveClassName)}
    >
      {Icon ? <Icon className={cn("h-4 w-4", compact && "h-4 w-4")} /> : null}
      {label}
    </Link>
  );
}
