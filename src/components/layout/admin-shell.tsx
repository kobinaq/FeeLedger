import Link from "next/link";
import { requireAdminProfile } from "@/features/auth/server";
import { getCurrentSchool, getCurrentTerm } from "@/features/schools/queries";
import { AdminNav } from "@/components/layout/workspace-navs";
import type { Role } from "@/types";

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const profile = await requireAdminProfile();
  const school = profile.school_id ? await getCurrentSchool(profile.school_id) : null;
  const term = profile.school_id ? await getCurrentTerm(profile.school_id) : null;
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[272px_1fr]">
      <aside className="relative overflow-hidden bg-brand-greenDark p-5 text-white lg:min-h-screen">
        <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-brand-amber/20 blur-2xl" aria-hidden />
        <Link
          href={profile.role === "cashier" ? "/admin/payments/new" : "/admin/dashboard"}
          className="relative block rounded-2xl px-3 py-3 transition hover:bg-white/5"
        >
          <p className="font-display text-2xl font-semibold tracking-tight">FeeLedger</p>
          <p className="mt-1 text-sm text-emerald-100/90">{school?.name ?? "School workspace"}</p>
        </Link>
        <AdminNav role={profile.role as Role} />
        <div className="relative mt-8 border-t border-white/10 pt-4">
          <p className="px-3 text-xs uppercase tracking-[0.1em] text-emerald-200/70">{profile.role.replaceAll("_", " ")}</p>
          <Link
            href="/logout"
            className="mt-2 block rounded-xl px-3 py-2.5 text-sm font-semibold text-emerald-50 transition hover:bg-white/10"
          >
            Logout
          </Link>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="no-print flex min-h-16 items-center justify-between border-b border-brand-line/70 bg-white/80 px-5 backdrop-blur-md">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-muted">Current term</p>
            <p className="font-semibold text-brand-ink">{term?.name ?? "Current Term"}</p>
          </div>
          <div className="rounded-full border border-brand-line bg-brand-greenSoft/60 px-3 py-1.5 text-sm text-brand-ink">
            {profile.full_name}
          </div>
        </header>
        <main className="animate-fade-in p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
