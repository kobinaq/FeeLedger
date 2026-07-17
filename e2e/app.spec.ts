import { expect, test } from "@playwright/test";

test.describe("public auth surfaces", () => {
  test("login page renders Supabase auth form", async ({ request }) => {
    const response = await request.get("/login");
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html).toContain("Use your school, parent, or platform account to continue.");
    expect(html).toContain('name="email"');
    expect(html).toContain('name="password"');
    expect(html).toContain("Sign In");
  });

  test("forgot password page is reachable", async ({ request }) => {
    const response = await request.get("/forgot-password");
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html.toLowerCase()).toMatch(/password|email|reset/);
  });

  test("home page responds", async ({ request }) => {
    const response = await request.get("/");
    expect(response.status()).toBeLessThan(500);
  });
});

test.describe("auth guards", () => {
  test("admin dashboard redirects unauthenticated users", async ({ request }) => {
    const response = await request.get("/admin/dashboard", { maxRedirects: 0 });
    expect(response.status()).toBeGreaterThanOrEqual(300);
    expect(response.status()).toBeLessThan(400);
    expect(response.headers().location).toContain("/login");
  });

  test("parent portal redirects unauthenticated users", async ({ request }) => {
    const response = await request.get("/parent/overview", { maxRedirects: 0 });
    expect(response.status()).toBeGreaterThanOrEqual(300);
    expect(response.status()).toBeLessThan(400);
    expect(response.headers().location).toContain("/login");
  });

  test("platform workspace redirects unauthenticated users", async ({ request }) => {
    const response = await request.get("/platform/schools", { maxRedirects: 0 });
    expect(response.status()).toBeGreaterThanOrEqual(300);
    expect(response.status()).toBeLessThan(400);
    expect(response.headers().location).toContain("/login");
  });

  test("nested admin routes also redirect", async ({ request }) => {
    for (const path of ["/admin/payments/new", "/admin/settings", "/admin/bills"]) {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status(), path).toBeGreaterThanOrEqual(300);
      expect(response.status(), path).toBeLessThan(400);
      expect(response.headers().location, path).toContain("/login");
    }
  });
});

test.describe("public API hardening", () => {
  test("Paystack webhook rejects invalid signature", async ({ request }) => {
    const response = await request.post("/api/paystack/webhook", {
      data: { event: "charge.success", data: { reference: "FL-test" } },
      headers: {
        "content-type": "application/json",
        "x-paystack-signature": "invalid"
      }
    });
    // Without real Supabase service role the route may 500 after signature fail storage,
    // but it must never accept an invalid signature as success.
    expect([400, 401, 500]).toContain(response.status());
    if (response.status() !== 500) {
      const body = await response.json().catch(() => ({}));
      expect(body.ok).not.toBe(true);
    }
  });

  test("Paystack webhook rejects empty body", async ({ request }) => {
    const response = await request.post("/api/paystack/webhook", {
      data: "",
      headers: { "content-type": "application/json" }
    });
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
});
