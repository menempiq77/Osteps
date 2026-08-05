import { test, expect } from "@playwright/test";
import { fulfillJson, seedAuth, studentUser } from "./fixtures";

test("leaving exam fullscreen opens the incident modal and posts an exit reason", async ({ page }) => {
  await seedAuth(page, studentUser);
  await page.route("http://127.0.0.1:4174/api/**", async (route) => {
    await fulfillJson(route, { data: [] });
  });
  await page.route("**/api/assessment-document?**", async (route) => {
    if (route.request().method() === "GET") {
      return fulfillJson(route, {
        assessmentId: "42",
        taskId: "7",
        studentId: "10",
        status: "draft",
        studentLocked: false,
        studentAnnotations: [],
        teacherAnnotations: [],
        metadata: {},
      });
    }
    return fulfillJson(route, {
      assessmentId: "42",
      taskId: "7",
      studentId: "10",
      status: "draft",
      studentLocked: false,
      studentAnnotations: [],
      teacherAnnotations: [],
      metadata: {},
    });
  });
  await page.addInitScript(() => {
    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      get: () => (window as Window & { __e2eFullscreen?: boolean }).__e2eFullscreen
        ? document.documentElement
        : null,
    });
    (window as Window & { __e2eFullscreen?: boolean }).__e2eFullscreen = false;
    Object.defineProperty(HTMLElement.prototype, "requestFullscreen", {
      configurable: true,
      value: async () => {},
    });
  });

  await page.goto(
    "/dashboard/assessment-document?role=student&assessmentId=42&taskId=7&studentId=10&fileUrl=data:application/pdf;base64,JVBERi0xLjQK&examMode=1&examStartAt=2020-01-01T00%3A00%3A00Z&examEndAt=2099-01-01T00%3A00%3A00Z"
  );
  await expect(page.getByText("Start exam mode")).toBeVisible({ timeout: 30_000 });
  await page.evaluate(() => {
    (window as Window & { __e2eFullscreen?: boolean }).__e2eFullscreen = true;
    document.dispatchEvent(new Event("fullscreenchange"));
  });
  await expect(page.getByText("Start exam mode")).not.toBeVisible();

  const incidentRequest = page.waitForRequest(
    (request) =>
      request.url().includes("/api/assessment-document?") &&
      request.method() === "POST"
  );
  await page.evaluate(() => {
    (window as Window & { __e2eFullscreen?: boolean }).__e2eFullscreen = false;
    document.dispatchEvent(new Event("fullscreenchange"));
  });
  await expect(page.getByText("Exit exam?")).toBeVisible();
  await page.getByPlaceholder("Explain why you need to leave the exam screen...").fill("Need to leave for an urgent reason.");
  await page.getByRole("button", { name: "Exit exam", exact: true }).click();

  const request = await incidentRequest;
  expect(request.postDataJSON()).toMatchObject({
    layer: "student",
    metadata: { lastExamExitReason: "Need to leave for an urgent reason.", lastExamExitContext: "fullscreen" },
  });
});
