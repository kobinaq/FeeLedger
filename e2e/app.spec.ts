import { expect, test } from "@playwright/test";

test("login page renders real Supabase auth form", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Sign in to your account" })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
});

test("protected admin route redirects unauthenticated users", async ({ page }) => {
  await page.goto("/admin/dashboard");
  await expect(page).toHaveURL(/\/login/);
});
