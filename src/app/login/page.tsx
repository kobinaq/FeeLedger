import Link from "next/link";
import { Banknote, CheckCircle2, LogIn, ShieldCheck, Sparkles } from "lucide-react";
import { signInAction, signInAsDemoAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { demoAccounts } from "@/lib/demo/accounts";
import { isDemoAuthEnabled, showDemoCredentials } from "@/lib/env";

export default async function LoginPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const params = await searchParams;
  const demoEnabled = isDemoAuthEnabled();
  const showCreds = showDemoCredentials();

  return (
    <main className="relative min-h-screen overflow-hidden text-brand-ink">
      <div className="pointer-events-none absolute inset-0 ledger-grid opacity-40" aria-hidden />
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-green/15 blur-3xl animate-soft-pulse" aria-hidden />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-brand-amber/20 blur-3xl" aria-hidden />

      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden animate-fade-up lg:block">
          <p className="font-display text-4xl font-semibold text-brand-green">FeeLedger</p>
          <h1 className="mt-5 max-w-xl font-display text-5xl font-semibold leading-[1.08] text-brand-ink">
            Fee collection that keeps the accounts office in control.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-brand-muted">
            Record payments, issue receipts, manage payment plans, and give parents a clear view of what they owe —
            without the clutter of a full school system.
          </p>
          <div className="mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
            {[
              { title: "Role-aware access", icon: ShieldCheck, delay: "anim-delay-1" },
              { title: "Receipt trail", icon: CheckCircle2, delay: "anim-delay-2" },
              { title: "Payment plans", icon: Banknote, delay: "anim-delay-3" }
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-2xl border border-brand-line/80 bg-white/80 p-4 shadow-soft backdrop-blur-sm animate-fade-up ${item.delay}`}
              >
                <item.icon className="h-5 w-5 text-brand-greenMid" />
                <p className="mt-3 text-sm font-semibold text-brand-ink">{item.title}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="animate-fade-up anim-delay-1">
          <div className="mb-5 lg:hidden">
            <p className="font-display text-3xl font-semibold text-brand-green">FeeLedger</p>
            <p className="mt-2 text-sm text-brand-muted">School fee collection, clearly managed.</p>
          </div>

          <div className="surface-panel p-7 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green text-white shadow-soft">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-amber">Welcome back</p>
                <h2 className="font-display text-2xl font-semibold text-brand-ink">Sign in</h2>
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-brand-muted">
              Use your school, parent, or platform account to continue.
            </p>

            {params?.error ? (
              <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                {params.error}
              </p>
            ) : null}

            <form action={signInAction} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-brand-ink">Email</span>
                <Input className="mt-1.5" name="email" type="email" placeholder="accountant@gracefield.test" required />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-brand-ink">Password</span>
                <Input className="mt-1.5" name="password" type="password" required />
              </label>
              <Button className="w-full">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </form>

            <Link
              href="/forgot-password"
              className="mt-5 block text-center text-sm font-medium text-brand-muted transition hover:text-brand-green"
            >
              Forgot password?
            </Link>

            {demoEnabled ? (
              <div className="mt-7 rounded-2xl border border-brand-green/15 bg-brand-greenSoft/70 p-4">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-amber" />
                  <div>
                    <p className="text-sm font-semibold text-brand-ink">Walk through as…</p>
                    <p className="mt-1 text-xs leading-5 text-brand-muted">
                      Live demo of <span className="font-semibold text-brand-green">Gracefield Preparatory</span>. Pick a
                      role — no password needed.
                    </p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {demoAccounts.map((account, index) => {
                    const delay = ["anim-delay-1", "anim-delay-2", "anim-delay-3", "anim-delay-4"][index % 4];
                    return (
                      <form key={account.role} action={signInAsDemoAction} className={`animate-fade-up ${delay}`}>
                        <input type="hidden" name="role" value={account.role} />
                        <button
                          type="submit"
                          className="group w-full rounded-xl border border-white/80 bg-white px-3 py-3 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-brand-green/30 hover:shadow-lift"
                        >
                          <span className="block text-sm font-semibold text-brand-ink group-hover:text-brand-green">
                            {account.label}
                          </span>
                          <span className="mt-0.5 block text-[11px] leading-4 text-brand-muted">{account.description}</span>
                        </button>
                      </form>
                    );
                  })}
                </div>
                {showCreds ? (
                  <p className="mt-3 text-xs leading-5 text-brand-muted">
                    Manual demo password: <span className="font-semibold text-brand-ink">demo12345</span>
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
