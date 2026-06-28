import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isStaff, roleHome } from "@/features/auth/permissions";
import type { CookieOptions } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const path = request.nextUrl.pathname;
  const protectedPath = path.startsWith("/admin") || path.startsWith("/parent") || path.startsWith("/platform");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("example.supabase.co")) {
    if (protectedPath) return NextResponse.redirect(new URL("/login", request.url));
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        }
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user && protectedPath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!user) return response;

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const role = profile?.role;

  if (path === "/login" && role) {
    return NextResponse.redirect(new URL(roleHome(role), request.url));
  }

  if (path.startsWith("/parent") && role !== "parent") {
    return NextResponse.redirect(new URL(roleHome(role), request.url));
  }

  if (path.startsWith("/platform") && role !== "platform_admin") {
    return NextResponse.redirect(new URL(roleHome(role), request.url));
  }

  if (path.startsWith("/admin") && !isStaff(role)) {
    return NextResponse.redirect(new URL(roleHome(role), request.url));
  }

  return response;
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/parent/:path*", "/platform/:path*"]
};
