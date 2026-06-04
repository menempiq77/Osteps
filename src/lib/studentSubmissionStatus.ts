const INCOMPLETE_SUBMISSION_STATUSES = new Set([
  "",
  "draft",
  "in-progress",
  "incomplete",
  "not-completed",
  "not-started",
  "not-submitted",
]);

export const normalizeSubmissionStatusKey = (status: unknown) =>
  String(status ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");

export const isSubmittedStatus = (status: unknown, hasSubmission = false) => {
  const statusKey = normalizeSubmissionStatusKey(status);
  if (!statusKey) return hasSubmission;
  return !INCOMPLETE_SUBMISSION_STATUSES.has(statusKey);
};

export const toStudentSubmissionStatus = (status: unknown, hasSubmission = false) => {
  return isSubmittedStatus(status, hasSubmission) ? "submitted" : "not-started";
};