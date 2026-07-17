import Link from "next/link";
import { updatePasswordAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function ResetPasswordPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-5">
      <div className="pointer-events-none absolute inset-0 ledger-grid opacity-30" aria-hidden />
      <div className="surface-panel relative w-full max-w-md animate-fade-up p-7 sm:p-8">
        <p className="font-display text-2xl font-semibold text-brand-green">FeeLedger</p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-brand-ink">Choose a new password</h1>
        <p className="mt-2 text-sm leading-6 text-brand-muted">
          Use the link from your email, then set a new password for your FeeLedger account.
        </p>
        {params?.error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{params.error}</p>
        ) : null}
        <form action={updatePasswordAction} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-brand-ink">New password</span>
            <Input className="mt-1.5" name="password" type="password" minLength={8} required />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-brand-ink">Confirm password</span>
            <Input className="mt-1.5" name="confirmPassword" type="password" minLength={8} required />
          </label>
          <Button className="w-full">Update password</Button>
        </form>
        <Link href="/login" className="mt-5 block text-center text-sm font-semibold text-brand-green">
          Back to login
        </Link>
      </div>
    </main>
  );
}
