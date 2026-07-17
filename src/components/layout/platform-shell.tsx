import Link from "next/link";
import { requirePlatformProfile } from "@/features/auth/server";
import { PlatformNav } from "@/components/layout/workspace-navs";

export async function PlatformShell({ children }: { children: React.ReactNode }) {
  await requirePlatformProfile();
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/platform/schools" className="text-lg font-bold">
            FeeLedger Platform
          </Link>
          <div className="flex items-center gap-4">
            <PlatformNav />
            <Link href="/logout" className="text-sm font-semibold text-slate-300 hover:text-white">
              Logout
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-6 text-slate-950">{children}</main>
    </div>
  );
}
