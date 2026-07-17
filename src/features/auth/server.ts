import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canViewAdminNav, isStaff, roleHome, type AdminNavKey } from "@/features/auth/permissions";

export async function getSessionProfile() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !profile) return null;
  return profile;
}

export async function requireProfile() {
  const profile = await getSessionProfile();
  if (!profile) redirect("/login");
  return profile;
}

export async function requireAdminProfile() {
  const profile = await requireProfile();
  if (!isStaff(profile.role)) redirect(roleHome(profile.role));
  return profile;
}

/** Staff gate + nav capability check (blocks deep links cashiers/headteachers shouldn't open). */
export async function requireAdminNav(key: AdminNavKey) {
  const profile = await requireAdminProfile();
  if (!canViewAdminNav(profile.role, key)) redirect(roleHome(profile.role));
  return profile;
}

export async function requireParentProfile() {
  const profile = await requireProfile();
  if (profile.role !== "parent") redirect(roleHome(profile.role));
  if (!profile.family_id) redirect("/login");
  return profile;
}

export async function requirePlatformProfile() {
  const profile = await requireProfile();
  if (profile.role !== "platform_admin") redirect(roleHome(profile.role));
  return profile;
}

export async function requireRole(allowed: string[]) {
  const profile = await requireProfile();
  if (!allowed.includes(profile.role)) redirect(roleHome(profile.role));
  return profile;
}
