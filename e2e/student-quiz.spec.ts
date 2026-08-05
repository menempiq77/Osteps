import { test, expect } from "@playwright/test";
import { fulfillJson, mockCommonApi, seedAuth, studentUser } from "./fixtures";

test("student loads an assigned quiz, answers one question, and submits", async ({ page }) => {
  await seedAuth(page, studentUser);
  await page.addInitScript(() => {
    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      get: () => document.documentElement,
    });
  });
  await mockCommonApi(page);

  await page.route("http://127.0.0.1:4174/api/get-quiz-questions/9", async (route) => {
    await fulfillJson(route, {
      data: {
        id: 9,
        name: "Mock assigned quiz",
        quiz_queston: [
          {
            id: 91,
            quiz_id: 9,
            question_text: "Which answer is correct?",
            type: "multiple_choice",
            correct_answer: 1,
            options: [
              { id: 1, option_text: "Correct answer", is_correct: 1 },
              { id: 2, option_text: "Other answer", is_correct: 0 },
            ],
          },
        ],
      },
    });
  });
  const submitRequest = page.waitForRequest(
    (request) =>
      request.url() === "http://127.0.0.1:4174/api/submitQuizAnswers" &&
      request.method() === "POST"
  );
  await page.route("http://127.0.0.1:4174/api/submitQuizAnswers", async (route) => {
    await fulfillJson(route, { success: true });
  });
  await page.route("http://127.0.0.1:4174/api/get-student-tasks/**", async (route) => {
    await fulfillJson(route, { data: [] });
  });

  await page.goto("/dashboard/students/assignments/7/task-quiz/9");
  await expect(page.getByText("Which answer is correct?")).toBeVisible();
  await page.getByText("Correct answer", { exact: true }).click();
  await page.getByPlaceholder("Enter your self mark").fill("1");
  await page.getByRole("button", { name: "Submit Answers" }).click();

  const request = await submitRequest;
  const body = request.postDataJSON() as { quiz_id: number; student_id: number; answers: unknown };
  expect(body.quiz_id).toBe(9);
  expect(body.student_id).toBe(10);
  expect(body.answers).toBeTruthy();
});
