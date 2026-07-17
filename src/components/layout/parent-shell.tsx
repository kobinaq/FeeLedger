import Link from "next/link";
import { requireParentProfile } from "@/features/auth/server";
import { getCurrentSchool } from "@/features/schools/queries";
import { ParentDesktopNav, ParentMobileNav } from "@/components/layout/workspace-navs";

export async function ParentShell({ children }: { children: React.ReactNode }) {
  const profile = await requireParentProfile();
  const school = profile.school_id ? await getCurrentSchool(profile.school_id) : null;
  return (
    <div className="min-h-screen bg-brand-bg pb-24 sm:pb-8">
      <header className="border-b border-slate-200 bg-white px-5 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/parent/overview">
            <p className="text-lg font-bold text-brand-green">FeeLedger</p>
            <p className="text-sm text-slate-500">{school?.name ?? "Parent portal"}</p>
          </Link>
          <Link href="/logout" className="text-sm font-semibold text-slate-600">
            Logout
          </Link>
        </div>
      </header>
      <ParentDesktopNav />
      <main className="mx-auto max-w-5xl p-5">{children}</main>
      <ParentMobileNav />
    </div>
  );
}
