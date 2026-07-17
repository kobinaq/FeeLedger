import Link from "next/link";
import { forgotPasswordAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function ForgotPasswordPage({
  searchParams
}: {
  searchParams?: Promise<{ sent?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden p-5">
      <div className="pointer-events-none absolute inset-0 ledger-grid opacity-30" aria-hidden />
      <div className="surface-panel relative w-full max-w-md animate-fade-up p-7 sm:p-8">
        <p className="font-display text-2xl font-semibold text-brand-green">FeeLedger</p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-brand-ink">Reset your password</h1>
        <p className="mt-2 text-sm leading-6 text-brand-muted">
          Enter your email address and FeeLedger will send reset instructions.
        </p>
        {params?.sent ? (
          <p className="mt-4 rounded-xl bg-brand-greenSoft p-3 text-sm text-brand-green">
            If that email exists, reset instructions have been sent.
          </p>
        ) : null}
        {params?.error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{params.error}</p>
        ) : null}
        <form action={forgotPasswordAction} className="mt-6 space-y-4">
          <Input name="email" type="email" placeholder="accountant@gracefield.test" required />
          <Button className="w-full">Send reset instructions</Button>
        </form>
        <Link href="/login" className="mt-5 block text-center text-sm font-semibold text-brand-green">
          Back to login
        </Link>
      </div>
    </main>
  );
}
