const SUBJECT_SCOPED_PREFIXES = [
  "/dashboard",
  "/dashboard/manager",
  "/dashboard/view",
  "/dashboard/leaderboard",
  "/dashboard/years",
  "/dashboard/classes",
  "/dashboard/grades",
  "/dashboard/quiz",
  "/dashboard/teachers",
  "/dashboard/student_behavior",
  "/dashboard/all_assesments",
  "/dashboard/all_trackers",
  "/dashboard/viewtrackers",
  "/dashboard/students/reports",
  "/dashboard/mind-upgrade",
  "/dashboard/subjects",
];

const SUBJECT_CONTEXT_ENABLED = process.env.NEXT_PUBLIC_SUBJECT_CONTEXT_ENABLED !== "false";

const SHARED_PREFIXES = [
  "/dashboard/subject-cards",
  "/dashboard/library",
  "/dashboard/time_table",
  "/dashboard/announcements",
  "/dashboard/tools",
  "/dashboard/school-admin/settings",
  "/dashboard/students/settings",
  "/dashboard/teachers/settings",
  "/dashboard/admins/settings",
];

const SHARED_EXACT_PATHS = [
  "/dashboard/students",
  "/dashboard/teachers",
];

const SUBJECT_ROUTE_ROOTS = new Set([
  "manager",
  "view",
  "leaderboard",
  "years",
  "classes",
  "grades",
  "quiz",
  "teachers",
  "student_behavior",
  "all_assesments",
  "all_trackers",
  "viewtrackers",
  "students",
  "mind-upgrade",
  "subjects",
  "subject-cards",
  "library",
  "time_table",
  "announcements",
  "tools",
  "school-admin",
  "admins",
]);

const normalize = (path: string): string => {
  const value = path.split("?")[0].replace(/\/+$/, "");
  return value.length === 0 ? "/" : value;
};

const startsWithPrefix = (path: string, prefix: string): boolean => {
  if (path === prefix) return true;
  return path.startsWith(`${prefix}/`);
};

export const toSubjectPathSegment = (subjectName?: string | null): string => {
  const normalized = String(subjectName ?? "")
    .replace(/islamiat/gi, "Islamic")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "subject";
};

const stripReadableSubjectSegment = (suffix: string): string => {
  const trimmed = String(suffix ?? "").replace(/^\/+/, "");
  if (!trimmed) return "";

  const segments = trimmed.split("/").filter(Boolean);
  if (segments.length === 0) return "";
  if (SUBJECT_ROUTE_ROOTS.has(segments[0])) {
    return `/${segments.join("/")}`;
  }

  const remaining = segments.slice(1);
  return remaining.length > 0 ? `/${remaining.join("/")}` : "";
};

export const isSharedPath = (path: string): boolean => {
  const normalized = normalize(path);
  if (SHARED_EXACT_PATHS.includes(normalized)) return true;
  return SHARED_PREFIXES.some((prefix) => startsWithPrefix(normalized, prefix));
};

export const isSubjectScopedPath = (path: string): boolean => {
  if (!SUBJECT_CONTEXT_ENABLED) return false;
  const normalized = normalize(path);
  if (normalized.startsWith("/dashboard/s/")) return false;
  if (isSharedPath(normalized)) return false;
  return SUBJECT_SCOPED_PREFIXES.some((prefix) => startsWithPrefix(normalized, prefix));
};

export const toSubjectScopedPath = (
  path: string,
  subjectId: number,
  subjectName?: string | null
): string => {
  const normalized = normalize(path);
  if (!SUBJECT_CONTEXT_ENABLED) return stripSubjectScope(normalized);
  const suffix = normalized.startsWith("/dashboard/s/")
    ? stripSubjectScope(normalized).replace("/dashboard", "") || ""
    : normalized.replace("/dashboard", "") || "";
  if (!normalized.startsWith("/dashboard/s/") && !isSubjectScopedPath(normalized)) return normalized;
  return `/dashboard/s/${subjectId}/${toSubjectPathSegment(subjectName)}${suffix}`;
};

export const stripSubjectScope = (path: string): string => {
  const normalized = normalize(path);
  const match = normalized.match(/^\/dashboard\/s\/\d+(\/.*)?$/);
  if (!match) return normalized;
  const suffix = stripReadableSubjectSegment(match[1] ?? "");
  return `/dashboard${suffix}`;
};

export const extractSubjectIdFromPath = (path: string): number | null => {
  const normalized = normalize(path);
  const match = normalized.match(/^\/dashboard\/s\/(\d+)(?:\/.*)?$/);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isFinite(id) && id > 0 ? id : null;
};
