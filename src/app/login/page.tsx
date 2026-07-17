import Link from "next/link";
import { CheckCircle2, LogIn, ShieldCheck } from "lucide-react";
import { signInAction, signInAsDemoAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { demoAccounts } from "@/lib/demo/accounts";
import { isDemoAuthEnabled, showDemoCredentials } from "@/lib/env";

export default async function LoginPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const demoEnabled = isDemoAuthEnabled();
  const showCreds = showDemoCredentials();

  return (
    <main className="min-h-screen bg-brand-bg px-5 py-8 text-brand-ink">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_440px]">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-normal text-brand-amber">FeeLedger</p>
            <h1 className="mt-4 text-4xl font-bold tracking-normal">School fee collection with the finance office in control.</h1>
            <p className="mt-4 text-base leading-7 text-brand-muted">
              Review balances, record payments, issue receipts, manage payment plans, and give parents a clear view of what they owe.
            </p>
          </div>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {["Role-aware access", "Receipt trail", "Payment plan tracking"].map((item) => (
              <div key={item} className="rounded-md border border-brand-line bg-white p-4 shadow-soft">
                <CheckCircle2 className="h-5 w-5 text-brand-success" />
                <p className="mt-3 text-sm font-semibold">{item}</p>
              </div>
            ))}
          </div>
        </section>
        <Card className="w-full p-7 shadow-panel">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-greenDark text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-amber">FeeLedger</p>
              <h2 className="text-xl font-bold text-brand-ink">Sign in</h2>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-brand-muted">Use your school, parent, or platform account to continue.</p>
          {params?.error ? <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">{params.error}</p> : null}
          <form action={signInAction} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <Input className="mt-1" name="email" type="email" placeholder="accountant@gracefield.test" required />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Password</span>
              <Input className="mt-1" name="password" type="password" required />
            </label>
            <Button className="w-full">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </form>
          <Link href="/forgot-password" className="mt-5 block text-center text-sm font-medium text-brand-muted hover:text-brand-green">
            Forgot password?
          </Link>

          {demoEnabled ? (
            <div className="mt-6 border-t border-slate-200 pt-5">
              <p className="text-sm font-semibold text-slate-800">Try a live demo role</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">One-click sign-in for client walkthroughs. Uses the Gracefield demo school.</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {demoAccounts.map((account) => (
                  <form key={account.role} action={signInAsDemoAction}>
                    <input type="hidden" name="role" value={account.role} />
                    <button
                      type="submit"
                      className="w-full rounded-md border border-brand-line bg-white px-3 py-2.5 text-left transition hover:border-brand-green hover:bg-emerald-50"
                    >
                      <span className="block text-sm font-semibold text-slate-900">{account.label}</span>
                      <span className="mt-0.5 block text-[11px] leading-4 text-slate-500">{account.description}</span>
                    </button>
                  </form>
                ))}
              </div>
              {showCreds ? (
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Manual demo password: <span className="font-semibold text-slate-700">demo12345</span>
                </p>
              ) : null}
            </div>
          ) : null}
        </Card>
      </div>
    </main>
  );
}
