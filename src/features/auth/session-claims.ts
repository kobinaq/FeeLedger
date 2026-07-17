import type { NextRequest, NextResponse } from "next/server";
import type { User } from "@supabase/supabase-js";
import type { Role } from "@/types";

export const CLAIMS_COOKIE = "fl_claims";

export type SessionClaims = {
  /** Auth user id — cookie is only trusted when this matches the verified JWT subject. */
  userId: string;
  role: Role;
  schoolId: string | null;
  familyId: string | null;
};

type ClaimsCookiePayload = {
  v: 1;
  u: string;
  r: Role;
  s: string | null;
  f: string | null;
};

const ROLES: Role[] = ["platform_admin", "school_admin", "headteacher", "accountant", "cashier", "parent"];

function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as string[]).includes(value);
}

/** Read FeeLedger claims from Supabase JWT app_metadata (preferred, no DB). */
export function claimsFromUser(user: User): SessionClaims | null {
  const meta = user.app_metadata ?? {};
  const role = meta.feeledger_role ?? meta.role;
  if (!isRole(role)) return null;
  return {
    userId: user.id,
    role,
    schoolId: typeof meta.feeledger_school_id === "string" ? meta.feeledger_school_id : null,
    familyId: typeof meta.feeledger_family_id === "string" ? meta.feeledger_family_id : null
  };
}

/** Build app_metadata payload to embed on the Auth user (appears on subsequent JWTs). */
export function appMetadataFromProfile(profile: {
  role: Role | string;
  school_id?: string | null;
  family_id?: string | null;
}) {
  return {
    feeledger_role: profile.role,
    feeledger_school_id: profile.school_id ?? null,
    feeledger_family_id: profile.family_id ?? null
  };
}

/** Edge-safe base64url (middleware cannot rely on Node Buffer). */
function toBase64Url(value: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf8").toString("base64url");
  }
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(raw: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(raw, "base64url").toString("utf8");
  }
  const padded = raw.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeClaimsCookie(claims: SessionClaims): string {
  const payload: ClaimsCookiePayload = {
    v: 1,
    u: claims.userId,
    r: claims.role,
    s: claims.schoolId,
    f: claims.familyId
  };
  return toBase64Url(JSON.stringify(payload));
}

export function decodeClaimsCookie(raw: string | undefined, userId: string): SessionClaims | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(fromBase64Url(raw)) as ClaimsCookiePayload;
    if (parsed.v !== 1 || parsed.u !== userId || !isRole(parsed.r)) return null;
    return {
      userId: parsed.u,
      role: parsed.r,
      schoolId: parsed.s ?? null,
      familyId: parsed.f ?? null
    };
  } catch {
    return null;
  }
}

export function claimsFromRequest(request: NextRequest, user: User): SessionClaims | null {
  return claimsFromUser(user) ?? decodeClaimsCookie(request.cookies.get(CLAIMS_COOKIE)?.value, user.id);
}

export function setClaimsCookie(response: NextResponse, claims: SessionClaims) {
  response.cookies.set(CLAIMS_COOKIE, encodeClaimsCookie(claims), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearClaimsCookie(response: NextResponse) {
  response.cookies.set(CLAIMS_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}

/** Server-action helper: write claims cookie via next/headers cookies(). */
export async function writeClaimsCookieServer(claims: SessionClaims) {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  store.set(CLAIMS_COOKIE, encodeClaimsCookie(claims), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearClaimsCookieServer() {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  store.set(CLAIMS_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}
