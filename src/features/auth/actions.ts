"use server";

import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { roleHome } from "@/features/auth/permissions";
import {
  appMetadataFromProfile,
  clearClaimsCookieServer,
  writeClaimsCookieServer,
  type SessionClaims
} from "@/features/auth/session-claims";
import type { Role } from "@/types";

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
    ? await supabase.from("profiles").select("role, school_id, family_id").eq("id", userId).single()
    : { data: null, error: null };
  if (profileError || !profile || !userId) {
    console.error("Signed-in user is missing a FeeLedger profile", {
      email,
      userId,
      message: profileError?.message
    });
    redirect(`/login?error=${encodeURIComponent("Your account exists, but no FeeLedger profile is linked to it.")}`);
  }

  // Embed role/school on the Auth user so middleware can route without a profiles query.
  try {
    const service = createServiceClient();
    await service.auth.admin.updateUserById(userId, {
      app_metadata: appMetadataFromProfile(profile)
    });
    // Refresh so the browser session JWT picks up app_metadata when possible.
    await supabase.auth.refreshSession();
  } catch (metadataError) {
    console.error("Failed to sync FeeLedger claims to app_metadata", {
      userId,
      message: metadataError instanceof Error ? metadataError.message : String(metadataError)
    });
  }

  const claims: SessionClaims = {
    userId,
    role: profile.role as Role,
    schoolId: profile.school_id ?? null,
    familyId: profile.family_id ?? null
  };
  await writeClaimsCookieServer(claims);

  redirect(roleHome(profile.role));
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  await clearClaimsCookieServer();
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
