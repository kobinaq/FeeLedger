"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { roleHome } from "@/features/auth/permissions";

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
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

  redirect(roleHome(profile?.role));
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function forgotPasswordAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/login`
  });
  redirect("/forgot-password?sent=1");
}
