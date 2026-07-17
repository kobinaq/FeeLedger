"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { roleHome } from "@/features/auth/permissions";
import { DEMO_PASSWORD, demoAccountByRole } from "@/lib/demo/accounts";
import { isDemoAuthEnabled } from "@/lib/env";

async function completeSignIn(email: string, password: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("Supabase password sign-in failed", {
      email,
      message: error.message,
      status: error.status
    });
    redirect(`/login?error=${encodeURIComponent("Check your email and password, then try again.")}`);
  }

  const userId = data.user?.id;
  const { data: profile, error: profileError } = userId
    ? await supabase.from("profiles").select("role").eq("id", userId).single()
    : { data: null, error: null };
  if (profileError || !profile) {
    console.error("Signed-in user is missing a FeeLedger profile", {
      email,
      userId,
      message: profileError?.message
    });
    redirect(`/login?error=${encodeURIComponent("Your account exists, but no FeeLedger profile is linked to it.")}`);
  }

  redirect(roleHome(profile.role));
}

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  await completeSignIn(email, password);
}

/** One-click demo login for live client walkthroughs. Disabled when DEMO_AUTH=disabled. */
export async function signInAsDemoAction(formData: FormData) {
  if (!isDemoAuthEnabled()) {
    redirect(`/login?error=${encodeURIComponent("Demo sign-in is disabled in this environment.")}`);
  }
  const role = String(formData.get("role") ?? "").trim();
  const account = demoAccountByRole(role);
  if (!account) {
    redirect(`/login?error=${encodeURIComponent("Unknown demo role.")}`);
  }
  await completeSignIn(account.email, DEMO_PASSWORD);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function forgotPasswordAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const supabase = await createClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${appUrl}/reset-password`
  });
  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/forgot-password?sent=1");
}

export async function updatePasswordAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");
  if (password.length < 8) {
    redirect(`/reset-password?error=${encodeURIComponent("Password must be at least 8 characters.")}`);
  }
  if (password !== confirm) {
    redirect(`/reset-password?error=${encodeURIComponent("Passwords do not match.")}`);
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    redirect(`/reset-password?error=${encodeURIComponent(error.message)}`);
  }
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?error=" + encodeURIComponent("Session expired. Sign in with your new password."));
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  redirect(roleHome(profile?.role));
}
