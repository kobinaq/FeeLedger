import Link from "next/link";
import { requireParentProfile } from "@/features/auth/server";
import { getCurrentSchool } from "@/features/schools/queries";
import { ParentDesktopNav, ParentMobileNav } from "@/components/layout/workspace-navs";

export async function ParentShell({ children }: { children: React.ReactNode }) {
  const profile = await requireParentProfile();
  const school = profile.school_id ? await getCurrentSchool(profile.school_id) : null;
  return (
    <div className="min-h-screen pb-24 sm:pb-10">
      <header className="border-b border-brand-line/70 bg-white/85 px-5 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link href="/parent/overview" className="min-w-0">
            <p className="font-display text-2xl font-semibold text-brand-green">FeeLedger</p>
            <p className="truncate text-sm text-brand-muted">{school?.name ?? "Parent portal"}</p>
          </Link>
          <Link
            href="/logout"
            className="rounded-xl border border-brand-line bg-white px-3 py-2 text-sm font-semibold text-brand-muted transition hover:border-brand-green/30 hover:text-brand-green"
          >
            Logout
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-5 pt-4">
        <ParentDesktopNav />
      </div>
      <main className="mx-auto max-w-5xl animate-fade-in p-5">{children}</main>
      <ParentMobileNav />
    </div>
  );
}
