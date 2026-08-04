"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { Check, LoaderCircle, Users, X } from "lucide-react";
import { Select } from "antd";
import { usePathname, useSearchParams } from "next/navigation";
import type { RootState } from "@/store/store";
import { assignMindUpgradeCourses } from "@/services/mindUpgradeApi";
import { fetchSubjectClasses } from "@/services/subjectWorkspaceApi";
import { fetchYearsBySchool } from "@/services/yearsApi";
import { extractSubjectIdFromPath } from "@/lib/subjectRouting";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { asRecord, errorMessage } from "@/lib/safeRecord";

type CurrentUser = {
  school?: string | number | { id?: string | number };
  school_id?: string | number;
  schoolId?: string | number;
};

type YearOption = { id: number; name: string };

export type AssignTrackerButtonProps = {
  courseKey: string;
  trackerName: string;
};

function resolveSchoolId(user: CurrentUser | null | undefined): number | null {
  const school = user?.school;
  const nested = typeof school === "object" && school !== null ? school.id : school;
  const id = Number(nested ?? user?.school_id ?? user?.schoolId);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function AssignTrackerButton({
  courseKey,
  trackerName,
}: AssignTrackerButtonProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { activeSubjectId } = useSubjectContext();
  const { currentUser } = useSelector((state: RootState) => state.auth) as {
    currentUser?: CurrentUser;
  };
  const schoolId = resolveSchoolId(currentUser);
  const pathSubjectId = extractSubjectIdFromPath(pathname);
  const querySubjectId = Number(searchParams.get("subject_id"));
  const subjectId =
    pathSubjectId ??
    (Number.isInteger(querySubjectId) && querySubjectId > 0
      ? querySubjectId
      : activeSubjectId);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<"all_students" | "year_groups">(
    "all_students"
  );
  const [selectedYearIds, setSelectedYearIds] = useState<number[]>([]);
  const [years, setYears] = useState<YearOption[]>([]);
  const [yearsLoading, setYearsLoading] = useState(false);
  const [yearError, setYearError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setYearError("");
    setYearsLoading(true);
    setYears([]);
    if (!subjectId) {
      setYears([]);
      setYearError("No subject is selected, so year groups are unavailable.");
      setYearsLoading(false);
      return () => {
        cancelled = true;
      };
    }

    if (!schoolId) {
      setYearError(
        "Your school could not be identified, so year groups are unavailable."
      );
      setYearsLoading(false);
      return () => {
        cancelled = true;
      };
    }

    Promise.all([
      fetchSubjectClasses({ subject_id: subjectId, include_inactive: true }),
      fetchYearsBySchool(schoolId),
    ])
      .then(([subjectClassRows, schoolYearRows]) => {
        if (cancelled) return;
        const subjectYearIds = new Set(
          (Array.isArray(subjectClassRows) ? subjectClassRows : [])
            .map((row) => Number(asRecord(row)?.year_id ?? asRecord(asRecord(row)?.year)?.id))
            .filter((id) => id > 0)
        );
        const options = new Map<number, string>();
        for (const year of Array.isArray(schoolYearRows) ? schoolYearRows : []) {
          const id = Number(year?.id);
          const name = String(year?.name ?? year?.year_name ?? "").trim();
          if (id > 0 && subjectYearIds.has(id) && name) {
            options.set(id, name);
          }
        }
        setYears(
          Array.from(options, ([id, name]) => ({
            id,
            name,
          }))
        );
      })
      .catch(() => {
        if (!cancelled) setYearError("Could not load year groups.");
      })
      .finally(() => {
        if (!cancelled) setYearsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, schoolId, subjectId]);

  const selectedYearNames = useMemo(
    () =>
      selectedYearIds
        .map((id) => years.find((year) => year.id === id)?.name)
        .filter(Boolean)
        .join(", "),
    [selectedYearIds, years]
  );

  const canSubmit =
    status !== "loading" &&
    (target === "all_students"
      ? true
      : selectedYearIds.length > 0 && Boolean(schoolId));

  const handleAssign = async () => {
    if (!canSubmit) return;
    setStatus("loading");
    setMessage("");
    try {
      await assignMindUpgradeCourses({
        course_key: courseKey,
        ...(target === "all_students"
          ? { assign_all_students: true }
          : { year_ids: selectedYearIds }),
      });
      setStatus("done");
      setMessage(
        target === "all_students"
          ? `Assigned ${trackerName} to all students.`
          : `Assigned ${trackerName} to ${selectedYearNames}.`
      );
      setOpen(false);
    } catch (err: unknown) {
      setStatus("error");
      setMessage(errorMessage(err, "Assignment failed."));
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setStatus("idle");
          setMessage("");
        }}
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "loading" ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : status === "done" ? (
          <Check className="h-4 w-4" />
        ) : (
          <Users className="h-4 w-4" />
        )}
        {status === "done" ? "Assigned" : "Assign tracker"}
      </button>

      {message && status === "done" && (
        <p className="mt-2 text-xs font-semibold text-emerald-700">{message}</p>
      )}

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
          >
            <div
              className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-sky-200 bg-sky-50 p-5 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="assign-tracker-title"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition hover:bg-white hover:text-slate-700"
                aria-label="Close assignment dialog"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-2 text-sm font-bold text-sky-800">
                <Users className="h-4 w-4" />
                <span id="assign-tracker-title">Assign tracker</span>
              </div>
              <p className="mt-2 pr-8 text-sm text-sky-700">
                Make <span className="font-semibold">{trackerName}</span>{" "}
                available to students in this subject.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(["all_students", "year_groups"] as const).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setTarget(value);
                      setMessage("");
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      target === value
                        ? "bg-sky-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {value === "all_students" ? "All students" : "Year groups"}
                  </button>
                ))}
              </div>

              {target === "year_groups" && (
                <div className="mt-3">
                  <Select
                    mode="multiple"
                    className="w-full"
                    value={selectedYearIds}
                    loading={yearsLoading}
                    disabled={yearsLoading || years.length === 0}
                    onChange={(values) =>
                      setSelectedYearIds((values as number[]).map(Number))
                    }
                    options={years.map((year) => ({
                      value: year.id,
                      label: year.name,
                    }))}
                    placeholder={
                      yearsLoading
                        ? "Loading year groups..."
                        : "Select year groups"
                    }
                  />
                  {yearError && (
                    <p className="mt-2 text-xs font-semibold text-rose-700">
                      {yearError}
                    </p>
                  )}
                  {!yearError && !yearsLoading && years.length === 0 && (
                    <p className="mt-2 text-xs font-semibold text-rose-700">
                      No year groups are available for this subject.
                    </p>
                  )}
                </div>
              )}

              {!schoolId && (
                <p className="mt-3 text-xs font-semibold text-rose-700">
                  Your school could not be identified, so assignment is
                  unavailable.
                </p>
              )}
              {message && status === "error" && (
                <p className="mt-3 text-xs font-semibold text-rose-700">
                  {message}
                </p>
              )}
              <button
                type="button"
                onClick={handleAssign}
                disabled={!canSubmit}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {status === "loading" && (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                )}
                Assign{" "}
                {target === "all_students"
                  ? "to all students"
                  : "to selected years"}
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
