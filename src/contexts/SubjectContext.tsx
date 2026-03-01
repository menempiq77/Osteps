"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchMySubjectContext, setLastSubject } from "@/services/subjectContextApi";
import type { SubjectBrief } from "@/types/subjectContext";
import { extractSubjectIdFromPath, isSubjectScopedPath, toSubjectScopedPath } from "@/lib/subjectRouting";
import { getStoredSubjectId, storeSubjectId } from "@/lib/subjectScope";

type SubjectContextValue = {
  subjects: SubjectBrief[];
  activeSubjectId: number | null;
  activeSubject: SubjectBrief | null;
  loading: boolean;
  canUseSubjectContext: boolean;
  setActiveSubjectId: (subjectId: number, options?: { navigate?: boolean }) => void;
  toSubjectHref: (href: string) => string;
};

const SubjectContext = createContext<SubjectContextValue | null>(null);

const isRoleEligible = (role: string | undefined): boolean => {
  const roleKey = (role ?? "").trim().toUpperCase().replace(/\s+/g, "_");
  return ["SCHOOL_ADMIN", "HOD", "TEACHER", "STUDENT"].includes(roleKey);
};

export function SubjectContextProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const [subjects, setSubjects] = useState<SubjectBrief[]>([]);
  const [activeSubjectId, setActiveSubjectIdState] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const role = currentUser?.role;
  const canUseSubjectContext = isRoleEligible(role);

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

      setLoading(true);
      try {
        const context = await fetchMySubjectContext();
        if (!mounted) return;

        const available = context.assigned_subjects ?? [];
        setSubjects(available);

        const fromPath = extractSubjectIdFromPath(pathname);
        const fromStorage = getStoredSubjectId();
        const fallback = context.default_subject_id ?? available[0]?.id ?? null;

        const candidate = [fromPath, fromStorage, fallback]
          .filter((value): value is number => Number.isFinite(value as number) && Number(value) > 0)
          .find((value) => available.some((subject) => subject.id === value)) ?? null;

        setActiveSubjectIdState(candidate);
        if (candidate) {
          storeSubjectId(candidate);
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
  }, [canUseSubjectContext, currentUser, pathname]);

  useEffect(() => {
    if (!canUseSubjectContext || loading) return;
    if (!activeSubjectId) return;

    const pathSubjectId = extractSubjectIdFromPath(pathname);
    if (pathSubjectId && !subjects.some((subject) => subject.id === pathSubjectId)) {
      const fallback = subjects[0]?.id;
      if (fallback) {
        setActiveSubjectIdState(fallback);
        storeSubjectId(fallback);
        void setLastSubject(fallback);
        router.replace(toSubjectScopedPath("/dashboard", fallback));
      } else {
        router.replace("/dashboard");
      }
      return;
    }

    if (isSubjectScopedPath(pathname)) {
      router.replace(toSubjectScopedPath(pathname, activeSubjectId));
    }
  }, [activeSubjectId, canUseSubjectContext, loading, pathname, router, subjects]);

  const setActiveSubjectId = (subjectId: number, options?: { navigate?: boolean }) => {
    if (!Number.isFinite(subjectId) || subjectId <= 0) return;
    const exists = subjects.some((subject) => subject.id === subjectId);
    if (!exists) return;

    setActiveSubjectIdState(subjectId);
    storeSubjectId(subjectId);
    void setLastSubject(subjectId);

    if (options?.navigate !== false) {
      const next = toSubjectScopedPath(pathname, subjectId);
      router.push(next);
    }
  };

  const toSubjectHref = (href: string) => {
    if (!activeSubjectId) return href;
    return toSubjectScopedPath(href, activeSubjectId);
  };

  const value = useMemo<SubjectContextValue>(
    () => ({
      subjects,
      activeSubjectId,
      activeSubject: subjects.find((subject) => subject.id === activeSubjectId) ?? null,
      loading,
      canUseSubjectContext,
      setActiveSubjectId,
      toSubjectHref,
    }),
    [subjects, activeSubjectId, loading, canUseSubjectContext]
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
    };
  }
  return context;
};
