"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Check, ChevronDown, LoaderCircle, Users } from "lucide-react";
import { Select } from "antd";
import type { RootState } from "@/store/store";
import { fetchYearsBySchool } from "@/services/yearsApi";
import { assignMindUpgradeCourses } from "@/services/mindUpgradeApi";

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
  const { currentUser } = useSelector((state: RootState) => state.auth) as {
    currentUser?: CurrentUser;
  };
  const schoolId = resolveSchoolId(currentUser);
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
    if (!open || !schoolId) return;
    let cancelled = false;
    setYearError("");
    setYearsLoading(true);
    fetchYearsBySchool(schoolId)
      .then((rows) => {
        if (cancelled) return;
        const options = (Array.isArray(rows) ? rows : [])
          .map((year: any) => ({
            id: Number(year?.id),
            name: String(year?.name ?? year?.year_name ?? `Year ${year?.id}`),
          }))
          .filter((year) => year.id > 0);
        setYears(options);
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
  }, [open, schoolId]);

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
    } catch (err: any) {
      setStatus("error");
      setMessage(
        err?.response?.data?.message || err?.message || "Assignment failed."
      );
    }
  };

  return (
    <div className="rounded-3xl border border-sky-200 bg-sky-50 p-5">
      <div className="flex items-center gap-2 text-sm font-bold text-sky-800">
        <Users className="h-4 w-4" />
        Teacher tools
      </div>
      <p className="mt-2 text-sm text-sky-700">
        Make <span className="font-semibold">{trackerName}</span> available to
        students in this subject.
      </p>
      <button
        type="button"
        onClick={() => {
          setOpen((value) => !value);
          setStatus("idle");
          setMessage("");
        }}
        disabled={status === "loading"}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "loading" ? (
          <LoaderCircle className="h-4 w-4 animate-spin" />
        ) : status === "done" ? (
          <Check className="h-4 w-4" />
        ) : (
          <Users className="h-4 w-4" />
        )}
        {status === "done" ? "Assigned" : "Assign tracker"}
        <ChevronDown
          className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="mt-4 rounded-2xl border border-sky-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-2">
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
                  yearsLoading ? "Loading year groups..." : "Select year groups"
                }
              />
              {yearError && (
                <p className="mt-2 text-xs font-semibold text-rose-700">
                  {yearError}
                </p>
              )}
              {!yearError && !yearsLoading && years.length === 0 && (
                <p className="mt-2 text-xs font-semibold text-rose-700">
                  No year groups are available for this school.
                </p>
              )}
            </div>
          )}

          {!schoolId && (
            <p className="mt-3 text-xs font-semibold text-rose-700">
              Your school could not be identified, so assignment is unavailable.
            </p>
          )}
          {message && status === "error" && (
            <p className="mt-3 text-xs font-semibold text-rose-700">{message}</p>
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
            {target === "all_students" ? "to all students" : "to selected years"}
          </button>
        </div>
      )}

      {message && status === "done" && (
        <p className="mt-2 text-xs font-semibold text-emerald-700">{message}</p>
      )}
    </div>
  );
}
