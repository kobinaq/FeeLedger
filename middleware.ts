import { NextResponse, type NextRequest } from "next/server";

const roleHome: Record<string, string> = {
  parent: "/parent/overview",
  platform_admin: "/platform/schools",
  school_admin: "/admin/dashboard",
  headteacher: "/admin/dashboard",
  accountant: "/admin/dashboard",
  cashier: "/admin/payments/new"
};

export function middleware(request: NextRequest) {
  const role = request.cookies.get("feeledger_role")?.value;
  const path = request.nextUrl.pathname;

  if (path === "/login" && role && roleHome[role]) {
    return NextResponse.redirect(new URL(roleHome[role], request.url));
  }

  if (path.startsWith("/parent") && role && role !== "parent") {
    return NextResponse.redirect(new URL(roleHome[role] ?? "/login", request.url));
  }

  if (path.startsWith("/platform") && role && role !== "platform_admin") {
    return NextResponse.redirect(new URL(roleHome[role] ?? "/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/parent/:path*", "/platform/:path*"]
};
