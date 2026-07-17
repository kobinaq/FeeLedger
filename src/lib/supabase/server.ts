import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { CookieOptions } from "@supabase/ssr";
import { requirePublicEnv, requireServerEnv } from "@/lib/env";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(requirePublicEnv("NEXT_PUBLIC_SUPABASE_URL"), requirePublicEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
      }
    }
  });
}

export function createServiceClient() {
  return createSupabaseClient(requirePublicEnv("NEXT_PUBLIC_SUPABASE_URL"), requireServerEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
