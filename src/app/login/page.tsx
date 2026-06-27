import Link from "next/link";
import { LogIn } from "lucide-react";
import { signInAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function LoginPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-bg p-5">
      <Card className="w-full max-w-md p-7 shadow-soft">
        <p className="text-sm font-semibold text-brand-amber">FeeLedger</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">Sign in to your account</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in with your school, parent, or platform account.</p>
        {params?.error ? <p className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{params.error}</p> : null}
        <form action={signInAction} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Email</span>
            <Input name="email" type="email" placeholder="accountant@gracefield.test" required />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Password</span>
            <Input name="password" type="password" required />
          </label>
          <div className="grid gap-2">
            <Button className="w-full">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </div>
        </form>
        <Link href="/forgot-password" className="mt-5 block text-center text-sm text-slate-500">Forgot password?</Link>
      </Card>
    </main>
  );
}
