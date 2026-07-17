import Link from "next/link";
import { requireAdminProfile } from "@/features/auth/server";
import { getCurrentSchool, getCurrentTerm } from "@/features/schools/queries";
import { AdminNav } from "@/components/layout/workspace-navs";

export async function AdminShell({ children }: { children: React.ReactNode }) {
  const profile = await requireAdminProfile();
  const school = profile.school_id ? await getCurrentSchool(profile.school_id) : null;
  const term = profile.school_id ? await getCurrentTerm(profile.school_id) : null;
  return (
    <div className="min-h-screen bg-brand-bg lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="bg-brand-greenDark p-4 text-white lg:min-h-screen">
        <Link href="/admin/dashboard" className="block rounded-md px-3 py-3">
          <p className="text-lg font-bold">FeeLedger</p>
          <p className="text-sm text-emerald-100">{school?.name ?? "School workspace"}</p>
        </Link>
        <AdminNav role={profile.role} />
      </aside>
      <div>
        <header className="no-print flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-5">
          <p className="font-semibold text-slate-950">{term?.name ?? "Current Term"}</p>
          <div className="text-sm text-slate-500">Signed in as {profile.full_name}</div>
        </header>
        <main className="p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
