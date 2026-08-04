"use client";

import { useState } from "react";
import { Check, LoaderCircle, Users } from "lucide-react";
import { assignMindUpgradeCourses } from "@/services/mindUpgradeApi";
import { errorMessage } from "@/lib/safeRecord";

export type AssignTrackerButtonProps = {
  courseKey: string;
  trackerName: string;
};

export function AssignTrackerButton({ courseKey, trackerName }: AssignTrackerButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleAssign = async () => {
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      await assignMindUpgradeCourses({
        course_key: courseKey,
        assign_all_students: true,
      });
      setStatus("done");
      setMessage(`Assigned ${trackerName} to all students.`);
    } catch (err) {
      setStatus("error");
      setMessage(errorMessage(err, "Assignment failed."));
    }
  };

  return (
    <div className="rounded-3xl border border-sky-200 bg-sky-50 p-5">
      <div className="flex items-center gap-2 text-sm font-bold text-sky-800">
        <Users className="h-4 w-4" />
        Teacher tools
      </div>
      <p className="mt-2 text-sm text-sky-700">
        Make <span className="font-semibold">{trackerName}</span> available to every student in this subject.
      </p>
      <button
        type="button"
        onClick={handleAssign}
        disabled={status === "loading" || status === "done"}
        className={`mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white transition sm:w-auto ${
          status === "done"
            ? "bg-emerald-500"
            : status === "error"
            ? "bg-rose-500 hover:bg-rose-600"
            : "bg-sky-600 hover:bg-sky-700"
        } disabled:cursor-not-allowed disabled:opacity-70`}
      >
        {status === "loading" ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : status === "done" ? (
          <Check className="h-4 w-4" />
        ) : (
          <Users className="h-4 w-4" />
        )}
        {status === "done"
          ? "Assigned"
          : status === "error"
          ? "Try again"
          : "Assign to all students"}
      </button>
      {message && (
        <p
          className={`mt-2 text-xs font-semibold ${
            status === "done" ? "text-emerald-700" : "text-rose-700"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
