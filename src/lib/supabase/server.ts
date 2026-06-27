import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { CookieOptions } from "@supabase/ssr";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://example.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "demo-anon-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        }
      }
    }
  );
}

export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://example.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "demo-service-role-key",
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}
