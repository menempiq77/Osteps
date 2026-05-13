"use client";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";

type SubjectContextValue = {
  subjects: never[];
  activeSubjectId: number | null;
  activeSubject: null;
  loading: boolean;
  canUseSubjectContext: boolean;
  setActiveSubjectId: (
    subjectId: number,
    options?: { navigate?: boolean }
  ) => void;
  toSubjectHref: (href: string) => string;
  refreshSubjects: () => void;
};

const splitPathAndQuery = (path: string) => {
  const [rawPathname, rawQuery = ""] = String(path ?? "").split("?");
  return {
    pathname: rawPathname || "/",
    query: rawQuery ? `?${rawQuery}` : "",
  };
};

const extractSubjectIdFromPath = (path: string): number | null => {
  const match = String(path ?? "").match(/^\/dashboard\/s\/(\d+)(?:\/.*)?$/);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const stripSubjectScope = (path: string) => {
  const { pathname, query } = splitPathAndQuery(path);
  const match = pathname.match(/^\/dashboard\/s\/\d+(\/.*)?$/);
  if (!match) return `${pathname}${query}`;
  return `/dashboard${match[1] ?? ""}${query}`;
};

const toSubjectScopedPath = (path: string, subjectId: number) => {
  const { pathname, query } = splitPathAndQuery(path);
  if (!pathname.startsWith("/dashboard")) {
    return `${pathname}${query}`;
  }

  if (pathname.startsWith("/dashboard/s/")) {
    const suffix = pathname.replace(/^\/dashboard\/s\/\d+/, "");
    return `/dashboard/s/${subjectId}${suffix}${query}`;
  }

  const suffix = pathname.replace("/dashboard", "") || "";
  return `/dashboard/s/${subjectId}${suffix}${query}`;
};

export function SubjectContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

export const useSubjectContext = (): SubjectContextValue => {
  const pathname = usePathname() || "";
  const searchParams = useSearchParams();

  const querySubjectId = Number(searchParams.get("subject_id") ?? 0);
  const activeSubjectId =
    Number.isFinite(querySubjectId) && querySubjectId > 0
      ? querySubjectId
      : extractSubjectIdFromPath(pathname);

  return {
    subjects: [],
    activeSubjectId,
    activeSubject: null,
    loading: false,
    canUseSubjectContext: activeSubjectId != null,
    setActiveSubjectId: () => undefined,
    toSubjectHref: (href: string) =>
      activeSubjectId ? toSubjectScopedPath(href, activeSubjectId) : stripSubjectScope(href),
    refreshSubjects: () => undefined,
  };
};