export type StudentHintBucket = {
  ids: string[];
  usernames: string[];
  emails: string[];
  names: string[];
};

const STORAGE_KEY = "subject-student-hints-v1";

const EMPTY_BUCKET: StudentHintBucket = {
  ids: [],
  usernames: [],
  emails: [],
  names: [],
};

const normalize = (value: unknown) => String(value ?? "").trim().toLowerCase();

export const makeSubjectHintScopeKey = (
  subjectId?: number | null,
  subjectClassId?: string | number | null
): string | null => {
  const sid = Number(subjectId ?? 0);
  const scid = String(subjectClassId ?? "").trim();
  if (!Number.isFinite(sid) || sid <= 0 || !scid) return null;
  return `${sid}:${scid}`;
};

const readStore = (): Record<string, StudentHintBucket> => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeStore = (next: Record<string, StudentHintBucket>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};

const unique = (list: string[]) => Array.from(new Set(list.filter(Boolean)));

export const readSubjectStudentHints = (scopeKey: string | null): StudentHintBucket => {
  if (!scopeKey) return EMPTY_BUCKET;
  const bucket = readStore()[scopeKey];
  if (!bucket || typeof bucket !== "object") return EMPTY_BUCKET;

  return {
    ids: unique((bucket.ids || []).map((value) => String(value).trim())),
    usernames: unique((bucket.usernames || []).map(normalize)),
    emails: unique((bucket.emails || []).map(normalize)),
    names: unique((bucket.names || []).map(normalize)),
  };
};

export const mergeSubjectStudentHints = (
  scopeKey: string | null,
  patch: Partial<StudentHintBucket>
): StudentHintBucket => {
  if (!scopeKey) return EMPTY_BUCKET;

  const store = readStore();
  const prev = readSubjectStudentHints(scopeKey);
  const next: StudentHintBucket = {
    ids: unique([...(prev.ids || []), ...((patch.ids || []).map((v) => String(v).trim()))]),
    usernames: unique([...(prev.usernames || []), ...((patch.usernames || []).map(normalize))]),
    emails: unique([...(prev.emails || []), ...((patch.emails || []).map(normalize))]),
    names: unique([...(prev.names || []), ...((patch.names || []).map(normalize))]),
  };

  store[scopeKey] = next;
  writeStore(store);
  return next;
};

export const matchesSubjectStudentHint = (
  student: Record<string, any>,
  bucket: StudentHintBucket
): boolean => {
  if (!student || !bucket) return false;
  const id = String(student?.id ?? student?.student_id ?? "").trim();
  const username = normalize(student?.user_name);
  const email = normalize(student?.email);
  const name = normalize(student?.student_name);

  return (
    (!!id && bucket.ids.includes(id)) ||
    (!!username && bucket.usernames.includes(username)) ||
    (!!email && bucket.emails.includes(email)) ||
    (!!name && bucket.names.includes(name))
  );
};
