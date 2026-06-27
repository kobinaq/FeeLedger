import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function LogoutPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-bg p-5">
      <Card className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-slate-950">You have signed out</h1>
        <p className="mt-2 text-sm text-slate-500">Your demo session has ended.</p>
        <Link href="/login" className="mt-5 inline-block font-semibold text-brand-green">Sign in again</Link>
      </Card>
    </main>
  );
}
