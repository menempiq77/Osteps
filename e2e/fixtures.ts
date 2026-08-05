import { expect, type Page, type Route } from "@playwright/test";

export const studentUser = {
  id: "1",
  email: "student@example.test",
  role: "STUDENT",
  school: 1,
  student: 10,
  token: "e2e-token",
  name: "Test Student",
  assigned_subjects: [{ id: 5, name: "Mathematics" }],
  default_subject_id: 5,
};

export const teacherUser = {
  id: "2",
  email: "teacher@example.test",
  role: "TEACHER",
  school: 1,
  token: "e2e-teacher-token",
  name: "Test Teacher",
  assigned_subjects: [{ id: 5, name: "Mathematics" }],
  default_subject_id: 5,
};

export async function seedAuth(page: Page, user: typeof studentUser | typeof teacherUser) {
  await page.addInitScript((authUser) => {
    localStorage.setItem("currentUser", JSON.stringify(authUser));
    localStorage.setItem(
      "persist:root",
      JSON.stringify({
        auth: JSON.stringify({
          currentUser: authUser,
          users: [],
          token: authUser.token,
          status: "succeeded",
          error: null,
        }),
        _persist: JSON.stringify({ version: -1, rehydrated: true }),
      })
    );
  }, user);
}

export async function fulfillJson(route: Route, body: unknown, status = 200) {
  await route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });
}

export async function mockCommonApi(page: Page) {
  await page.route("http://127.0.0.1:4174/api/**", async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith("/get-subjects")) {
      return fulfillJson(route, { data: [] });
    }
    if (url.pathname.endsWith("/get-school-year/1") || url.pathname.endsWith("/get-assign-year")) {
      return fulfillJson(route, { data: [] });
    }
    return fulfillJson(route, { data: [] });
  });
}

export async function expectDashboardRedirect(page: Page) {
  await expect(page).toHaveURL(/\/dashboard\/subject-cards(?:$|\/|\?)/);
}
