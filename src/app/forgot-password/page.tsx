import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-bg p-5">
      <Card className="w-full max-w-md p-7">
        <h1 className="text-2xl font-bold text-slate-950">Reset your password</h1>
        <p className="mt-2 text-sm text-slate-500">Enter your email address and FeeLedger will send reset instructions.</p>
        <form className="mt-6 space-y-4">
          <Input type="email" placeholder="accountant@gracefield.test" />
          <Button className="w-full">Send reset instructions</Button>
        </form>
        <Link href="/login" className="mt-5 block text-center text-sm font-semibold text-brand-green">Back to login</Link>
      </Card>
    </main>
  );
}
