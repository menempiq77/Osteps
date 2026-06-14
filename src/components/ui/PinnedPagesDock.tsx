"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Pin, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  PINNED_PAGES_MAX_COUNT,
  PinnedPage,
  getPinnedPagesStorageKey,
  readPinnedPages,
  writePinnedPages,
} from "@/lib/pinnedPages";

const labelMap: Record<string, string> = {
  all_assesments: "Assessments",
  all_trackers: "Trackers",
  announcements: "Announcements",
  assessment_document: "PDF Workspace",
  "assessment-document": "PDF Workspace",
  attendance: "Attendance",
  behaviour: "Behaviour",
  behavior: "Behaviour",
  classes: "Classes",
  courses: "Courses",
  leaderboard: "Leaderboard",
  lessons: "Lessons",
  library: "Library",
  markbook: "Markbook",
  materials: "Materials",
  questions: "Questions",
  reports: "Reports",
  schools: "Schools",
  settings: "Settings",
  staff: "Staff",
  student: "Student Report",
  students: "Students",
  "students-staff": "Students & Staff",
  student_assesments: "Assessment Tasks",
  "student-assesments": "Assessment Tasks",
  "subject-cards": "Subject Dashboard",
  teachers: "Teachers",
  time_table: "Timetable",
  "timetable-builder": "Timetable Builder",
  "timetable-generator": "Timetable Generator",
  tools: "Tools",
  trackers: "Trackers",
  transcribe: "Transcribe",
  viewtrackers: "View Trackers",
};

// Read the heading of the currently rendered page (the student name on a report,
// the page title elsewhere). Scoped to the content area so the top-bar greeting
// ("Welcome back, ...") is never picked up.
const readContentHeading = (): string => {
  if (typeof document === "undefined") return "";
  const scope = document.querySelector(".dashboard-route-transition");
  const heading = scope?.querySelector("h1, h2");
  const text = (heading?.textContent || "").replace(/\s+/g, " ").trim();
  if (!text || /^welcome back/i.test(text)) return "";
  return text.slice(0, 48);
};

const formatSegment = (segment: string) => {
  const decoded = decodeURIComponent(segment).trim();
  if (!decoded) return "Dashboard";
  const mapped = labelMap[decoded.toLowerCase()];
  if (mapped) return mapped;

  return decoded
    .replace(/[-_]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const buildPageLabel = (pathname: string, searchParams: URLSearchParams) => {
  const explicitTitle = searchParams.get("title");
  if (explicitTitle?.trim()) return explicitTitle.trim().slice(0, 48);

  let segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "dashboard" && segments[1] === "s" && /^\d+$/.test(segments[2] || "")) {
    segments = ["dashboard", ...segments.slice(3)];
  }

  const meaningfulSegments = segments
    .filter((segment) => segment !== "dashboard" && segment !== "s")
    .filter((segment) => !/^\d+$/.test(segment));

  const baseSegment = meaningfulSegments.at(-1) || "dashboard";
  const idSegment = segments.at(-1);
  const baseLabel = formatSegment(baseSegment);

  if (idSegment && /^\d+$/.test(idSegment) && baseLabel !== "Dashboard") {
    return `${baseLabel} ${idSegment}`.slice(0, 48);
  }

  return baseLabel.slice(0, 48);
};

export default function PinnedPagesDock() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [pinnedPages, setPinnedPages] = useState<PinnedPage[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const search = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("autoDownload");
    return params.toString();
  }, [searchParams]);
  const currentHref = search ? `${pathname}?${search}` : pathname;
  const storageKey = useMemo(
    () => getPinnedPagesStorageKey(currentUser),
    [currentUser]
  );
  const currentLabel = useMemo(
    () => buildPageLabel(pathname, searchParams),
    [pathname, searchParams]
  );
  const hasExplicitTitle = Boolean(searchParams.get("title")?.trim());
  const currentPinned = pinnedPages.some((page) => page.href === currentHref);

  useEffect(() => {
    setHydrated(true);
    setPinnedPages(readPinnedPages(currentUser));
  }, [currentUser, storageKey]);

  useEffect(() => {
    if (!hydrated) return;

    const sync = () => setPinnedPages(readPinnedPages(currentUser));
    window.addEventListener("storage", sync);
    window.addEventListener("osteps:pinned-pages-updated", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("osteps:pinned-pages-updated", sync);
    };
  }, [currentUser, hydrated, storageKey]);

  const persistPinnedPages = (pages: PinnedPage[]) => {
    setPinnedPages(pages);
    writePinnedPages(pages, currentUser);
  };

  // Keep an already-pinned page's label in sync with the real page heading once
  // it renders (e.g. a student report's name loads asynchronously). This also
  // upgrades older pins with vague labels the next time the page is visited.
  useEffect(() => {
    if (!hydrated || hasExplicitTitle) return;
    if (!pinnedPages.some((page) => page.href === currentHref)) return;

    let cancelled = false;
    const tryUpdate = () => {
      if (cancelled) return;
      const heading = readContentHeading();
      if (!heading) return;
      const existing = pinnedPages.find((page) => page.href === currentHref);
      if (!existing || existing.label === heading) return;
      persistPinnedPages(
        pinnedPages.map((page) =>
          page.href === currentHref
            ? { ...page, label: heading, updatedAt: new Date().toISOString() }
            : page
        )
      );
    };

    const timers = [150, 600, 1500].map((delay) =>
      window.setTimeout(tryUpdate, delay)
    );
    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, currentHref, hasExplicitTitle, pinnedPages]);

  const toggleCurrentPage = () => {
    if (!currentHref.startsWith("/dashboard")) return;

    if (currentPinned) {
      persistPinnedPages(pinnedPages.filter((page) => page.href !== currentHref));
      return;
    }

    const timestamp = new Date().toISOString();
    const label =
      (!hasExplicitTitle ? readContentHeading() : "") ||
      currentLabel ||
      "Pinned page";
    const nextPage: PinnedPage = {
      href: currentHref,
      label,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    persistPinnedPages(
      [nextPage, ...pinnedPages.filter((page) => page.href !== currentHref)].slice(
        0,
        PINNED_PAGES_MAX_COUNT
      )
    );
  };

  const removePinnedPage = (href: string) => {
    persistPinnedPages(pinnedPages.filter((page) => page.href !== href));
  };

  if (!hydrated || !pathname.startsWith("/dashboard")) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[860] px-2 pb-1 md:left-[82px] md:right-[82px] md:px-3">
      <div className="pointer-events-auto mx-auto flex h-8 max-w-6xl items-center gap-1.5 rounded-t-xl border border-slate-200/80 bg-white/92 px-1.5 shadow-[0_-10px_30px_rgba(15,23,42,0.12)] backdrop-blur-xl">
        <button
          type="button"
          onClick={toggleCurrentPage}
          title={currentPinned ? "Unpin this page" : "Pin this page"}
          className={`flex h-6 shrink-0 items-center gap-1 rounded-full border px-2 text-[11px] font-bold transition active:scale-95 ${
            currentPinned
              ? "border-[var(--theme-border)] bg-[var(--theme-soft-2)] text-[var(--theme-dark)]"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-[var(--theme-border)] hover:text-[var(--theme-dark)]"
          }`}
        >
          <Pin className={`h-3.5 w-3.5 ${currentPinned ? "fill-current" : ""}`} />
          <span className="hidden sm:inline">{currentPinned ? "Pinned" : "Pin page"}</span>
        </button>

        <div className="h-5 w-px shrink-0 bg-slate-200" />

        <div className="pinned-pages-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto whitespace-nowrap py-0.5">
          {pinnedPages.length === 0 ? (
            <span className="px-2 text-[11px] font-medium text-slate-400">
              Pin pages here for quick return.
            </span>
          ) : (
            pinnedPages.map((page) => {
              const active = page.href === currentHref;
              return (
                <div
                  key={page.href}
                  className={`group flex h-6 max-w-[190px] shrink-0 items-center overflow-hidden rounded-full border text-[11px] shadow-sm transition ${
                    active
                      ? "border-[var(--theme-border)] bg-[var(--theme-soft)] text-[var(--theme-dark)]"
                      : "border-slate-200 bg-white text-slate-600 hover:border-[var(--theme-border)] hover:bg-[var(--theme-soft)]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => router.push(page.href)}
                    title={page.href}
                    className="min-w-0 truncate px-2 py-1 font-semibold"
                  >
                    {page.label}
                  </button>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      removePinnedPage(page.href);
                    }}
                    title="Remove pinned page"
                    className="flex h-full w-5 shrink-0 items-center justify-center border-l border-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
      <style jsx global>{`
        .pinned-pages-scrollbar::-webkit-scrollbar {
          height: 3px;
        }
        .pinned-pages-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .pinned-pages-scrollbar::-webkit-scrollbar-thumb {
          background: color-mix(in srgb, var(--primary) 35%, transparent);
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}