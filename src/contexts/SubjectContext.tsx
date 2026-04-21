"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchMySubjectContext, setLastSubject } from "@/services/subjectContextApi";
import type { SubjectBrief } from "@/types/subjectContext";
import { extractSubjectIdFromPath, isSubjectScopedPath, toSubjectScopedPath } from "@/lib/subjectRouting";
import { getStoredSubjectId, isSubjectContextEnabled, storeSubjectId } from "@/lib/subjectScope";

type SubjectContextValue = {
  subjects: SubjectBrief[];
  activeSubjectId: number | null;
  activeSubject: SubjectBrief | null;
  loading: boolean;
  canUseSubjectContext: boolean;
  setActiveSubjectId: (subjectId: number, options?: { navigate?: boolean }) => void;
  toSubjectHref: (href: string) => string;
  refreshSubjects: () => void;
};

const SubjectContext = createContext<SubjectContextValue | null>(null);

const isRoleEligible = (role: string | undefined): boolean => {
  const roleKey = (role ?? "").trim().toUpperCase().replace(/\s+/g, "_");
  return ["SCHOOL_ADMIN", "ADMIN", "HOD", "TEACHER", "STUDENT"].includes(roleKey);
};

const normalizeSeedSubjects = (
  raw: Array<{ id: number; name: string; code?: string | null }> | undefined
): SubjectBrief[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => ({
      id: Number(item?.id),
      name: String(item?.name ?? ""),
      code: item?.code ?? null,
      class_label: null,
    }))
    .filter((item) => Number.isFinite(item.id) && item.id > 0 && item.name.trim().length > 0);
};

export function SubjectContextProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const role = currentUser?.role;
  const userId = currentUser?.id;
  const canUseSubjectContext = isSubjectContextEnabled() && isRoleEligible(role);
  const subjectIdParam = searchParams.get("subject_id") ?? "";
  const seedSubjects = normalizeSeedSubjects(currentUser?.assigned_subjects);
  const seedActiveSubjectId = (() => {
    const fromPath = extractSubjectIdFromPath(pathname);
    const fromStorage = getStoredSubjectId();
    const fromQuery = (() => {
      const param = searchParams.get("subject_id");
      if (!param) return null;
      const id = Number(param);
      return Number.isFinite(id) && id > 0 ? id : null;
    })();
    const fallback = Number(currentUser?.default_subject_id ?? 0);

    return [fromPath, fromQuery, fromStorage, fallback]
      .filter((value): value is number => Number.isFinite(value as number) && Number(value) > 0)
      .find((value) => seedSubjects.some((subject) => subject.id === value)) ?? null;
  })();
  const hasSeededContext =
    canUseSubjectContext && !!currentUser && seedSubjects.length > 0 && !!seedActiveSubjectId;

  const [refreshToken, setRefreshToken] = useState(0);
  const [subjects, setSubjects] = useState<SubjectBrief[]>(() =>
    hasSeededContext ? seedSubjects : []
  );
  const [activeSubjectId, setActiveSubjectIdState] = useState<number | null>(() =>
    hasSeededContext ? seedActiveSubjectId : null
  );
  const [loading, setLoading] = useState(!hasSeededContext);
  const resolvedActiveSubject =
    subjects.find((subject) => subject.id === activeSubjectId) ?? null;

  // Always keep a current-pathname ref so setActiveSubjectId never uses a stale closure value
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      if (!canUseSubjectContext || !currentUser) {
        if (mounted) {
          setSubjects([]);
          setActiveSubjectIdState(null);
          setLoading(false);
        }
        return;
      }

      if (!hasSeededContext) {
        setLoading(true);
      }
      try {
        const context = await fetchMySubjectContext({
          role: currentUser?.role,
          knownSubjects: currentUser?.assigned_subjects,
          studentId: currentUser?.student,
          studentClassId: currentUser?.studentClass,
          userId: currentUser?.id,
          email: currentUser?.email,
        });
        if (!mounted) return;

        let available = context.assigned_subjects ?? [];
        setSubjects(available);

        const fromPath = extractSubjectIdFromPath(pathname);
        const fromStorage = getStoredSubjectId();
        const fromQuery = (() => {
          const param = searchParams.get("subject_id");
          if (!param) return null;
          const id = Number(param);
          return Number.isFinite(id) && id > 0 ? id : null;
        })();
        const fallback = context.default_subject_id ?? available[0]?.id ?? null;

        const candidate = [fromPath, fromQuery, fromStorage, fallback]
          .filter((value): value is number => Number.isFinite(value as number) && Number(value) > 0)
          .find((value) => available.some((subject) => subject.id === value)) ?? null;

        setActiveSubjectIdState(candidate);
        if (candidate) {
          const candidateSubject =
            available.find((subject) => subject.id === candidate) ?? null;
          storeSubjectId(candidate, candidateSubject?.name ?? null);
          void setLastSubject(candidate);
        }
      } catch {
        if (!mounted) return;
        setSubjects([]);
        setActiveSubjectIdState(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    void bootstrap();

    return () => {
      mounted = false;
    };
  // Note: pathname and subjectIdParam are intentionally excluded — the path guard useEffect
  // handles URL-based subject detection after navigation. Including pathname here re-runs the
  // full API bootstrap on every page navigation and can override the active subject.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUseSubjectContext, userId, role, hasSeededContext, refreshToken]);

  useEffect(() => {
    if (!canUseSubjectContext || loading) return;
    if (!activeSubjectId) return;

    const pathSubjectId = extractSubjectIdFromPath(pathname);
    if (pathSubjectId && !subjects.some((subject) => subject.id === pathSubjectId)) {
      const fallback = subjects[0]?.id;
      if (fallback) {
        setActiveSubjectIdState(fallback);
        const fallbackSubject = subjects.find((subject) => subject.id === fallback) ?? null;
        storeSubjectId(fallback, fallbackSubject?.name ?? null);
        void setLastSubject(fallback);
        router.replace(toSubjectScopedPath("/dashboard", fallback, fallbackSubject?.name ?? null));
      } else {
        router.replace("/dashboard");
      }
      return;
    }

    if (isSubjectScopedPath(pathname)) {
      const activeSubject = subjects.find((subject) => subject.id === activeSubjectId) ?? null;
      router.replace(toSubjectScopedPath(pathname, activeSubjectId, activeSubject?.name ?? null));
    }
  }, [activeSubjectId, canUseSubjectContext, loading, pathname, router, subjects]);

  const setActiveSubjectId = (subjectId: number, options?: { navigate?: boolean }) => {
    if (!Number.isFinite(subjectId) || subjectId <= 0) return;
    const exists = subjects.some((subject) => subject.id === subjectId);
    if (!exists) return;

    setActiveSubjectIdState(subjectId);
    const selectedSubject = subjects.find((subject) => subject.id === subjectId) ?? null;
    storeSubjectId(subjectId, selectedSubject?.name ?? null);
    void setLastSubject(subjectId);

    const currentPathname = pathnameRef.current;
    const isSubjectCardsPath =
      currentPathname === "/dashboard/subject-cards" ||
      /^\/dashboard\/s\/\d+(?:\/[^/]+)?\/subject-cards$/.test(currentPathname);
    if (options?.navigate !== false) {
      const next = isSubjectCardsPath
        ? toSubjectScopedPath("/dashboard", subjectId, selectedSubject?.name ?? null)
        : toSubjectScopedPath(currentPathname, subjectId, selectedSubject?.name ?? null);
      router.push(next);
    }
  };

  const toSubjectHref = (href: string) => {
    if (!activeSubjectId) return href;
    return toSubjectScopedPath(href, activeSubjectId, resolvedActiveSubject?.name ?? null);
  };

  const refreshSubjects = () => setRefreshToken((t) => t + 1);

  const value = useMemo<SubjectContextValue>(
    () => ({
      subjects,
      activeSubjectId,
      activeSubject: resolvedActiveSubject,
      loading,
      canUseSubjectContext,
      setActiveSubjectId,
      toSubjectHref,
      refreshSubjects,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [subjects, activeSubjectId, resolvedActiveSubject, loading, canUseSubjectContext]
  );

  return <SubjectContext.Provider value={value}>{children}</SubjectContext.Provider>;
}

export const useSubjectContext = (): SubjectContextValue => {
  const context = useContext(SubjectContext);
  if (!context) {
    return {
      subjects: [],
      activeSubjectId: null,
      activeSubject: null,
      loading: false,
      canUseSubjectContext: false,
      setActiveSubjectId: () => undefined,
      toSubjectHref: (href: string) => href,
      refreshSubjects: () => undefined,
    };
  }
  return context;
};
