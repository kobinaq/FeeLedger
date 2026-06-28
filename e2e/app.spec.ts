import { expect, test } from "@playwright/test";

test("login page renders real Supabase auth form", async ({ request }) => {
  const response = await request.get("/login");
  expect(response.ok()).toBe(true);
  const html = await response.text();
  expect(html).toContain("Sign in to your account");
  expect(html).toContain("name=\"email\"");
  expect(html).toContain("name=\"password\"");
});

test("protected admin route redirects unauthenticated users", async ({ request }) => {
  const response = await request.get("/admin/dashboard", { maxRedirects: 0 });
  expect(response.status()).toBeGreaterThanOrEqual(300);
  expect(response.status()).toBeLessThan(400);
  expect(response.headers().location).toContain("/login");
});
