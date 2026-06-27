import Link from "next/link";
import { signOutAction } from "@/features/auth/actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LogoutPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-bg p-5">
      <Card className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-slate-950">Sign out</h1>
        <p className="mt-2 text-sm text-slate-500">End your FeeLedger session on this device.</p>
        <form action={signOutAction} className="mt-5"><Button>Sign out now</Button></form>
        <Link href="/login" className="mt-4 inline-block font-semibold text-brand-green">Back to login</Link>
      </Card>
    </main>
  );
}
