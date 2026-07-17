import { expect, test } from "@playwright/test";

test("login page renders real Supabase auth form and demo pathway", async ({ request }) => {
  const response = await request.get("/login");
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain("Use your school, parent, or platform account to continue.");
  expect(html).toContain('name="email"');
  expect(html).toContain('name="password"');
  expect(html).toContain("Try a live demo role");
  expect(html).toContain("Accountant");
  expect(html).toContain("Cashier");
});

test("protected admin route redirects unauthenticated users", async ({ request }) => {
  const response = await request.get("/admin/dashboard", { maxRedirects: 0 });
  expect(response.status()).toBeGreaterThanOrEqual(300);
  expect(response.status()).toBeLessThan(400);
  expect(response.headers().location).toContain("/login");
});

test("reminders API rejects unauthenticated requests", async ({ request }) => {
  const response = await request.post("/api/reminders", {
    data: { familyId: "00000000-0000-0000-0000-000000000001", message: "hi" }
  });
  expect([401, 503]).toContain(response.status());
});
