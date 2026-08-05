import { test, expect } from "@playwright/test";
import { fulfillJson, expectDashboardRedirect } from "./fixtures";

test.describe("login", () => {
  test("signs in and redirects a student to the dashboard", async ({ page }) => {
    await page.route("http://127.0.0.1:4174/api/**", async (route) => {
      await fulfillJson(route, { data: [] });
    });
    await page.route("**/login", async (route) => {
      await fulfillJson(route, {
        data: {
          id: 1,
          email: "student@example.test",
          role: "STUDENT",
          school_id: 1,
          student: { id: 10 },
          token: "login-token",
          name: "Test Student",
          assigned_subjects: [{ id: 5, name: "Mathematics" }],
          default_subject_id: 5,
        },
      });
    });
    await page.goto("/");
    await page.getByLabel("Email Or Username").fill("student@example.test");
    await page.getByLabel("Password").fill("correct-password");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect
      .poll(() => page.evaluate(() => Boolean(localStorage.getItem("currentUser"))))
      .toBe(true);
    await page.evaluate(() => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
      localStorage.setItem(
        "persist:root",
        JSON.stringify({
          auth: JSON.stringify({
            currentUser,
            users: [currentUser],
            token: currentUser?.token ?? null,
            status: "succeeded",
            error: null,
          }),
          _persist: JSON.stringify({ version: -1, rehydrated: true }),
        })
      );
    });
    await page.goto("/dashboard/subject-cards");
    await expectDashboardRedirect(page);
  });

  test("shows the API error for invalid credentials", async ({ page }) => {
    await page.route("**/login", async (route) => {
      await fulfillJson(route, { message: "Invalid credentials" }, 401);
    });

    await page.goto("/");
    await page.getByLabel("Email Or Username").fill("student@example.test");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign In" }).click();

    await expect(page.getByText("Invalid credentials")).toBeVisible();
  });
});
