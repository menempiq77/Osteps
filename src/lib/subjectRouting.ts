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

const SHARED_PREFIXES = [
  "/dashboard/library",
  "/dashboard/time_table",
  "/dashboard/announcements",
  "/dashboard/tools",
  "/dashboard/school-admin/settings",
  "/dashboard/students/settings",
  "/dashboard/teachers/settings",
  "/dashboard/admins/settings",
];

const normalize = (path: string): string => {
  const value = path.split("?")[0].replace(/\/+$/, "");
  return value.length === 0 ? "/" : value;
};

const startsWithPrefix = (path: string, prefix: string): boolean => {
  if (path === prefix) return true;
  return path.startsWith(`${prefix}/`);
};

export const isSharedPath = (path: string): boolean => {
  const normalized = normalize(path);
  return SHARED_PREFIXES.some((prefix) => startsWithPrefix(normalized, prefix));
};

export const isSubjectScopedPath = (path: string): boolean => {
  const normalized = normalize(path);
  if (normalized.startsWith("/dashboard/s/")) return false;
  if (isSharedPath(normalized)) return false;
  return SUBJECT_SCOPED_PREFIXES.some((prefix) => startsWithPrefix(normalized, prefix));
};

export const toSubjectScopedPath = (path: string, subjectId: number): string => {
  const normalized = normalize(path);
  if (normalized.startsWith("/dashboard/s/")) return normalized;
  if (!isSubjectScopedPath(normalized)) return normalized;
  const suffix = normalized.replace("/dashboard", "") || "";
  return `/dashboard/s/${subjectId}${suffix}`;
};

export const stripSubjectScope = (path: string): string => {
  const normalized = normalize(path);
  const match = normalized.match(/^\/dashboard\/s\/\d+(\/.*)?$/);
  if (!match) return normalized;
  const suffix = match[1] ?? "";
  return `/dashboard${suffix}`;
};

export const extractSubjectIdFromPath = (path: string): number | null => {
  const normalized = normalize(path);
  const match = normalized.match(/^\/dashboard\/s\/(\d+)(?:\/.*)?$/);
  if (!match) return null;
  const id = Number(match[1]);
  return Number.isFinite(id) && id > 0 ? id : null;
};
