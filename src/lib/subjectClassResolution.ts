"use client";

import { fetchClasses } from "@/services/classesApi";
import { fetchSubjectClasses } from "@/services/subjectWorkspaceApi";

// ─── Subject-class → base-class localStorage mapping ────────────────────────
// When a subject class is created in subject workspace mode, we also create a  
// base class (needed for add-student API). This map persists that pairing.
const subjectClassBaseMapKey = (subjectId: number) =>
  `subject-class-base-map-s${subjectId}`;

export const readSubjectClassBaseMap = (subjectId: number): Record<string, string> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(subjectClassBaseMapKey(subjectId));
    const parsed = raw ? JSON.parse(raw) : {};
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
};

export const writeSubjectClassBaseEntry = (
  subjectId: number,
  subjectClassId: string,
  baseClassId: string
) => {
  if (typeof window === "undefined") return;
  const map = readSubjectClassBaseMap(subjectId);
  map[subjectClassId] = baseClassId;
  localStorage.setItem(subjectClassBaseMapKey(subjectId), JSON.stringify(map));
};
// ─────────────────────────────────────────────────────────────────────────────

type SubjectClassRow = {
  id?: number | string | null;
  class_id?: number | string | null;
  base_class_id?: number | string | null;
  year_id?: number | string | null;
  base_class_label?: string | null;
  name?: string | null;
  class?: {
    id?: number | string | null;
    class_name?: string | null;
    year_id?: number | string | null;
  } | null;
  classes?: {
    id?: number | string | null;
    class_name?: string | null;
    year_id?: number | string | null;
  } | null;
  base_class?: {
    id?: number | string | null;
    class_name?: string | null;
    year_id?: number | string | null;
  } | null;
};

type BaseClassRow = {
  id?: number | string | null;
  class_name?: string | null;
  name?: string | null;
  year_id?: number | string | null;
};

export type SubjectWorkspaceClassContext = {
  subjectClassId: string;
  linkedClassId: string;
  label: string;
  yearId: number;
};

export const normalizeSubjectClassText = (value: string) =>
  value.toLowerCase().replace(/[\s_-]+/g, " ").trim();

const baseClassesByYearCache = new Map<number, Promise<BaseClassRow[]>>();

const fetchBaseClassesForYear = async (yearId: number): Promise<BaseClassRow[]> => {
  if (!Number.isFinite(yearId) || yearId <= 0) return [];

  if (!baseClassesByYearCache.has(yearId)) {
    baseClassesByYearCache.set(
      yearId,
      fetchClasses(String(yearId))
        .then((rows) => ((Array.isArray(rows) ? rows : []) as BaseClassRow[]))
        .catch(() => [] as BaseClassRow[])
    );
  }

  return (await baseClassesByYearCache.get(yearId)) ?? [];
};

export const resolveBaseClassIdByYearAndLabel = async (
  yearId: number,
  classLabel?: string | null
): Promise<string> => {
  const normalizedLabel = normalizeSubjectClassText(String(classLabel ?? ""));
  if (!Number.isFinite(yearId) || yearId <= 0 || !normalizedLabel) return "";

  const baseRows = await fetchBaseClassesForYear(yearId);
  const matchedBaseClass = baseRows.find(
    (row) =>
      normalizeSubjectClassText(String(row?.class_name ?? row?.name ?? "")) === normalizedLabel
  );

  return String(matchedBaseClass?.id ?? "").trim();
};

export const resolveSubjectClassLinkedId = (row: SubjectClassRow): string =>
  String(
    row.class_id ??
      row.base_class_id ??
      row.class?.id ??
      row.classes?.id ??
      row.base_class?.id ??
      ""
  ).trim();

export const resolveSubjectClassLabel = (row: SubjectClassRow): string =>
  String(
    row.base_class_label ??
      row.class?.class_name ??
      row.classes?.class_name ??
      row.base_class?.class_name ??
      row.name ??
      `Class ${row.id ?? ""}`
  ).trim();

export const resolveSubjectClassYearId = (row: SubjectClassRow): number =>
  Number(
    row.year_id ??
      row.class?.year_id ??
      row.classes?.year_id ??
      row.base_class?.year_id ??
      0
  );

export const resolveSubjectClassLinkedIdWithFallback = async (
  row: SubjectClassRow,
  subjectId?: number | null
): Promise<string> => {
  const directLinkedId = resolveSubjectClassLinkedId(row);
  if (directLinkedId) return directLinkedId;

  const subjectClassId = String(row.id ?? "").trim();
  const wantedSubjectId = Number(subjectId ?? 0);
  const storedLinkedId =
    wantedSubjectId > 0 && subjectClassId
      ? String(readSubjectClassBaseMap(wantedSubjectId)[subjectClassId] ?? "").trim()
      : "";
  if (storedLinkedId) return storedLinkedId;

  const inferredLinkedId = await resolveBaseClassIdByYearAndLabel(
    resolveSubjectClassYearId(row),
    resolveSubjectClassLabel(row)
  );

  if (wantedSubjectId > 0 && subjectClassId && inferredLinkedId) {
    writeSubjectClassBaseEntry(wantedSubjectId, subjectClassId, inferredLinkedId);
  }

  return inferredLinkedId;
};

const resolveAllowedIds = (row: SubjectClassRow): string[] =>
  Array.from(
    new Set(
      [
        row.id,
        row.class_id,
        row.base_class_id,
        row.class?.id,
        row.classes?.id,
        row.base_class?.id,
      ]
        .map((value) => String(value ?? "").trim())
        .filter(Boolean)
    )
  );

const fetchSubjectWorkspaceRows = async (subjectId: number, wantedYearId: number) => {
  const rows = (await fetchSubjectClasses({
    subject_id: subjectId,
    year_id: Number.isFinite(wantedYearId) && wantedYearId > 0 ? wantedYearId : undefined,
  })) as SubjectClassRow[];
  const allRows =
    Number.isFinite(wantedYearId) && wantedYearId > 0
      ? ((await fetchSubjectClasses({ subject_id: subjectId })) as SubjectClassRow[])
      : rows;

  const scopedRows = (Array.isArray(rows) ? rows : []).filter((row) => {
    if (!Number.isFinite(wantedYearId) || wantedYearId <= 0) return true;
    return resolveSubjectClassYearId(row) === wantedYearId;
  });

  return {
    scopedRows,
    allScopedRows: Array.isArray(allRows) ? allRows : [],
  };
};

const resolveMatchedSubjectRow = async (params: {
  subjectId: number;
  yearId?: string | number | null;
  classLabel?: string | null;
  routeClassId?: string | number | null;
  subjectClassId?: string | number | null;
}): Promise<SubjectClassRow | null> => {
  const subjectId = Number(params.subjectId);
  if (!Number.isFinite(subjectId) || subjectId <= 0) return null;

  const normalizedLabel = normalizeSubjectClassText(String(params.classLabel ?? ""));
  const wantedYearId = Number(params.yearId ?? 0);
  const routeClassId = String(params.routeClassId ?? "").trim();
  const subjectClassId = String(params.subjectClassId ?? "").trim();

  const { scopedRows, allScopedRows } = await fetchSubjectWorkspaceRows(subjectId, wantedYearId);

  if (subjectClassId) {
    const exactSubjectRow =
      scopedRows.find((row) => String(row.id ?? "").trim() === subjectClassId) ||
      allScopedRows.find((row) => String(row.id ?? "").trim() === subjectClassId);
    if (exactSubjectRow) return exactSubjectRow;
  }

  if (normalizedLabel) {
    const exactMatch = scopedRows.find(
      (row) => normalizeSubjectClassText(resolveSubjectClassLabel(row)) === normalizedLabel
    );
    if (exactMatch) return exactMatch;

    const fallbackLabelMatches = allScopedRows.filter(
      (row) => normalizeSubjectClassText(resolveSubjectClassLabel(row)) === normalizedLabel
    );
    if (fallbackLabelMatches.length === 1) return fallbackLabelMatches[0];
    return null;
  }

  if (!routeClassId) return null;

  const routeMatches = scopedRows.filter((row) => resolveAllowedIds(row).includes(routeClassId));
  if (routeMatches.length === 1) return routeMatches[0];

  const fallbackRouteMatches = allScopedRows.filter((row) =>
    resolveAllowedIds(row).includes(routeClassId)
  );
  if (fallbackRouteMatches.length === 1) return fallbackRouteMatches[0];

  return null;
};

export const resolveSubjectWorkspaceClassContext = async (params: {
  subjectId: number;
  yearId?: string | number | null;
  classLabel?: string | null;
  routeClassId?: string | number | null;
  subjectClassId?: string | number | null;
}): Promise<SubjectWorkspaceClassContext> => {
  const matchedRow = await resolveMatchedSubjectRow(params);
  if (!matchedRow) {
    return {
      subjectClassId: "",
      linkedClassId: "",
      label: "",
      yearId: 0,
    };
  }

  const subjectId = Number(params.subjectId);
  const wantedYearId = Number(params.yearId ?? 0);
  const linkedId = await resolveSubjectClassLinkedIdWithFallback(matchedRow, subjectId);
  const label = resolveSubjectClassLabel(matchedRow);
  const matchedYearId = resolveSubjectClassYearId(matchedRow);

  return {
    subjectClassId: String(matchedRow.id ?? "").trim(),
    linkedClassId: linkedId,
    label,
    yearId: matchedYearId || wantedYearId,
  };
};

export const resolveSubjectWorkspaceClassId = async (params: {
  subjectId: number;
  yearId?: string | number | null;
  classLabel?: string | null;
  routeClassId?: string | number | null;
  subjectClassId?: string | number | null;
}): Promise<string> => {
  const context = await resolveSubjectWorkspaceClassContext(params);
  return context.linkedClassId;
};
