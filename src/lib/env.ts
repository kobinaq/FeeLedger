export function requirePublicEnv(name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY") {
  const value = process.env[name];
  if (!value || value.includes("example.supabase.co") || value.includes("your-") || value === "demo-anon-key") {
    throw new Error(`Missing or invalid ${name}. Set it in .env.local before running FeeLedger.`);
  }
  return value;
}

export function requireServerEnv(name: "SUPABASE_SERVICE_ROLE_KEY") {
  const value = process.env[name];
  if (!value || value.includes("your-") || value === "demo-service-role-key") {
    throw new Error(`Missing or invalid ${name}. Keep the service role key server-side only.`);
  }
  return value;
}

/** Demo auth for live client walkthroughs. Enabled by default; set DEMO_AUTH/NEXT_PUBLIC_DEMO_AUTH=disabled to turn off. */
export function isDemoAuthEnabled() {
  const flag = process.env.NEXT_PUBLIC_DEMO_AUTH ?? process.env.DEMO_AUTH;
  if (flag === "disabled" || flag === "false" || flag === "0") return false;
  return true;
}

export function showDemoCredentials() {
  if (process.env.NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS === "false") return false;
  if (process.env.NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS === "true") return true;
  return isDemoAuthEnabled();
}
