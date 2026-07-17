import Link from "next/link";
import { updatePasswordAction } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default async function ResetPasswordPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-bg p-5">
      <Card className="w-full max-w-md p-7">
        <h1 className="text-2xl font-bold text-slate-950">Choose a new password</h1>
        <p className="mt-2 text-sm text-slate-500">Use the link from your email, then set a new password for your FeeLedger account.</p>
        {params?.error ? <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{params.error}</p> : null}
        <form action={updatePasswordAction} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">New password</span>
            <Input className="mt-1" name="password" type="password" minLength={8} required />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Confirm password</span>
            <Input className="mt-1" name="confirmPassword" type="password" minLength={8} required />
          </label>
          <Button className="w-full">Update password</Button>
        </form>
        <Link href="/login" className="mt-5 block text-center text-sm font-semibold text-brand-green">
          Back to login
        </Link>
      </Card>
    </main>
  );
}
