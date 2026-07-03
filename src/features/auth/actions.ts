"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { roleHome } from "@/features/auth/permissions";

export async function signInAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error("Supabase password sign-in failed", {
      email,
      message: error.message,
      status: error.status,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
    });
    const detail = error.status ? `${error.message} (${error.status})` : error.message;
    redirect(`/login?error=${encodeURIComponent(detail)}`);
  }

  const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("email", email).single();
  if (profileError || !profile) {
    console.error("Signed-in user is missing a FeeLedger profile", {
      email,
      message: profileError?.message,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
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
