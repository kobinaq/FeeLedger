import Link from "next/link";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { profiles } from "@/lib/demo-data";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-bg p-5">
      <Card className="w-full max-w-md p-7 shadow-soft">
        <p className="text-sm font-semibold text-brand-amber">FeeLedger</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-950">Sign in to your account</h1>
        <p className="mt-2 text-sm text-slate-500">Choose a demo user to see the right workspace for that role.</p>
        <form className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Demo user</span>
            <Select defaultValue="accountant@gracefield.test">
              {profiles.map((profile) => (
                <option key={profile.email} value={profile.email}>{profile.email} - {profile.role.replaceAll("_", " ")}</option>
              ))}
            </Select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Password</span>
            <Input type="password" defaultValue="demo12345" />
          </label>
          <div className="grid gap-2">
            <Button formAction="/admin/dashboard" className="w-full">
              <LogIn className="h-4 w-4" />
              Continue as Staff
            </Button>
            <Link href="/parent/overview" className="text-center text-sm font-semibold text-brand-green">Continue as Parent</Link>
            <Link href="/platform/schools" className="text-center text-sm font-semibold text-slate-600">Continue as Platform Admin</Link>
          </div>
        </form>
        <Link href="/forgot-password" className="mt-5 block text-center text-sm text-slate-500">Forgot password?</Link>
      </Card>
    </main>
  );
}
