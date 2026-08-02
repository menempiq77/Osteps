"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { fetchSubjects } from "@/services/subjectsApi";
import { fetchSubjectClasses } from "@/services/subjectWorkspaceApi";
import { findSimilarSubjects, getSubjectFamilyLabel } from "@/lib/subjectSimilarity";
import type { SubjectBrief } from "@/types/subjectContext";

export type SimilarSubject = SubjectBrief & { archived: boolean };

const normalizeSubjects = (raw: any): SubjectBrief[] => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => ({
      id: Number(item?.id),
      name: String(item?.name ?? ""),
      code: item?.code ?? null,
      class_label: null,
      dashboard_image_url: null,
    }))
    .filter((item) => Number.isFinite(item.id) && item.id > 0 && item.name.trim().length > 0);
};

// Stable fallback: a fresh literal would change identity on every render.
const EMPTY_SUBJECTS: SubjectBrief[] = [];

const isActiveClass = (row: any) =>
  row?.is_active === undefined ? true : Number(row?.is_active) === 1;

/**
 * Subjects of the same family as the active subject (e.g. "Islamic" ↔ "Islamiyat"
 * ↔ "التربية الإسلامية"), so their content can be imported into the current
 * workspace. Archived twins are the common case, so each result carries whether
 * all of its subject-classes are inactive.
 */
export function useSimilarSubjects(enabled = true) {
  const { subjects, activeSubject, activeSubjectId, canUseSubjectContext } = useSubjectContext();
  const inSubjectContext = canUseSubjectContext && !!activeSubjectId;
  const queryEnabled = enabled && inSubjectContext;

  // The context list is scoped to the user's assignments and can omit archived
  // subjects; the school-wide list fills those in.
  const { data: schoolSubjects = EMPTY_SUBJECTS, isLoading: loadingPool } = useQuery({
    queryKey: ["similar-subjects-pool"],
    queryFn: async () => {
      try {
        return normalizeSubjects(await fetchSubjects());
      } catch {
        return [] as SubjectBrief[];
      }
    },
    enabled: queryEnabled,
    staleTime: 5 * 60 * 1000,
  });

  // Memoised so consumers get a stable array identity — an unstable one loops
  // any effect that depends on it.
  const matches = useMemo(() => {
    const pool = Array.from(
      new Map(
        [...subjects, ...schoolSubjects].map((subject) => [Number(subject.id), subject])
      ).values()
    );
    return findSimilarSubjects(activeSubject, pool);
  }, [subjects, schoolSubjects, activeSubject]);
  const matchIdsKey = matches.map((subject) => subject.id).join(",");

  const { data: archivedIds, isLoading: loadingArchived } = useQuery({
    queryKey: ["similar-subjects-archived", matchIdsKey],
    queryFn: async () => {
      const ids = new Set<number>();
      await Promise.all(
        matches.map(async (subject) => {
          try {
            const classes = await fetchSubjectClasses({
              subject_id: Number(subject.id),
              include_inactive: true,
            });
            const rows = Array.isArray(classes) ? classes : [];
            if (rows.length > 0 && !rows.some(isActiveClass)) {
              ids.add(Number(subject.id));
            }
          } catch {
            // Unknown class state — treat the subject as active.
          }
        })
      );
      return ids;
    },
    enabled: queryEnabled && matches.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const similarSubjects: SimilarSubject[] = useMemo(
    () =>
      matches.map((subject) => ({
        ...subject,
        archived: archivedIds?.has(Number(subject.id)) ?? false,
      })),
    [matches, archivedIds]
  );

  return {
    similarSubjects,
    familyLabel: getSubjectFamilyLabel(activeSubject?.name),
    activeSubject,
    activeSubjectId: activeSubjectId ?? null,
    loading: queryEnabled && (loadingPool || loadingArchived),
  };
}
