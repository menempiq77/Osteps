"use client";

import { useEffect } from "react";
import { Alert, Button } from "antd";

type AssessmentDocumentErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const clearAssessmentDocumentDraft = () => {
  if (typeof window === "undefined") return;

  try {
    const params = new URLSearchParams(window.location.search);
    const assessmentId = params.get("assessmentId") || "";
    const taskId = params.get("taskId") || "";
    const studentId = params.get("studentId") || "";
    const role = params.get("role") === "teacher" ? "teacher" : "student";
    if (!assessmentId || !taskId || !studentId) return;

    window.localStorage.removeItem(
      `osteps:assessment-document-draft:${assessmentId}:${taskId}:${studentId}:${role}`
    );
  } catch (error) {
    console.error("Could not clear the local assessment document draft:", error);
  }
};

export default function AssessmentDocumentError({
  error,
  reset,
}: AssessmentDocumentErrorProps) {
  useEffect(() => {
    console.error("Assessment document route crashed:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col justify-center gap-4 p-4">
      <Alert
        type="error"
        showIcon
        message="Could not open the online assessment document"
        description={
          <div className="space-y-3 text-sm">
            <p>
              The page hit a client-side error while loading this paper. The fastest recovery is to retry once,
              or clear the cached local draft for this paper and reload.
            </p>
            {error?.message ? (
              <p className="break-words rounded bg-red-50 px-3 py-2 font-mono text-xs text-red-700">
                {error.message}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button type="primary" onClick={reset}>
                Try again
              </Button>
              <Button
                onClick={() => {
                  clearAssessmentDocumentDraft();
                  window.location.reload();
                }}
              >
                Clear local draft and reload
              </Button>
            </div>
          </div>
        }
      />
    </div>
  );
}