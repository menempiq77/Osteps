import { test, expect } from "@playwright/test";
import { fulfillJson, mockCommonApi, seedAuth, teacherUser } from "./fixtures";

test("teacher assigns an assessment to a term", async ({ page }) => {
  await seedAuth(page, teacherUser);
  await mockCommonApi(page);

  await page.route("**/get-assign-year**", async (route) => {
    await fulfillJson(route, {
      data: [{
        classes: {
          id: 20,
          year_id: 3,
          class_name: "Class A",
          number_of_terms: 1,
          year: { id: 3, name: "Year 3" },
        },
      }],
    });
  });
  await page.route("**/get-class/3**", async (route) => {
    await fulfillJson(route, { data: [{ id: 20, year_id: 3, class_name: "Class A" }] });
  });
  await page.route("**/get-term/20**", async (route) => {
    await fulfillJson(route, { data: [{ id: 30, name: "Term 1", assign_assessments: [] }] });
  });
  const assignmentRequest = page.waitForRequest(
    (request) =>
      request.url().includes("/api/assign-assessments") &&
      request.method() === "POST"
  );
  await page.route("**/assign-assessments", async (route) => {
    await fulfillJson(route, { success: true });
  });

  await page.goto("/dashboard/all_assesments/42/assign");
  await expect(page.getByText("Term 1")).toBeVisible();
  await page.getByRole("button", { name: "Assign", exact: true }).click();

  const request = await assignmentRequest;
  expect(request.postDataJSON()).toEqual({ assessment_id: 42, term_id: 30 });
  await expect(page.getByText("Assessment assigned successfully!")).toBeVisible();
});
