type StudentProfileOverride = {
  isSen?: boolean;
  senDetails?: string;
  updatedAt: number;
};

const STORAGE_KEY = "student-profile-overrides-v1";

const readStore = (): Record<string, StudentProfileOverride> => {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeStore = (store: Record<string, StudentProfileOverride>) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore storage failures
  }
};

export const readStudentProfileOverride = (candidateIds: Array<string | number | null | undefined>) => {
  const store = readStore();

  for (const candidateId of candidateIds) {
    const key = String(candidateId ?? "").trim();
    if (!key) continue;
    if (store[key]) return store[key];
  }

  return null;
};

export const writeStudentProfileOverride = (
  candidateIds: Array<string | number | null | undefined>,
  override: Omit<StudentProfileOverride, "updatedAt">
) => {
  const ids = Array.from(
    new Set(candidateIds.map((candidateId) => String(candidateId ?? "").trim()).filter(Boolean))
  );
  if (ids.length === 0) return;

  const store = readStore();
  const nextValue: StudentProfileOverride = {
    ...override,
    updatedAt: Date.now(),
  };

  ids.forEach((id) => {
    store[id] = nextValue;
  });

  writeStore(store);
};