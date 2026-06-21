export type StudentCardMarkerKey =
  | "star"
  | "red-flag"
  | "red-flags-2"
  | "red-flags-3"
  | "sparkles"
  | "heart"
  | "smile"
  | "sad"
  | "angry"
  | "idea"
  | "fire"
  | "trophy"
  | "check";

export type StudentCardMarkerOption = {
  key: StudentCardMarkerKey;
  symbol: string;
  label: string;
};

const STORAGE_KEY = "osteps:student-card-markers:v1";

export const STUDENT_CARD_MARKER_OPTIONS: StudentCardMarkerOption[] = [
  { key: "star", symbol: "⭐", label: "Star" },
  { key: "red-flag", symbol: "🚩", label: "Red flag" },
  { key: "red-flags-2", symbol: "🚩🚩", label: "Two red flags" },
  { key: "red-flags-3", symbol: "🚩🚩🚩", label: "Three red flags" },
  { key: "sparkles", symbol: "✨", label: "Sparkles" },
  { key: "heart", symbol: "💚", label: "Heart" },
  { key: "smile", symbol: "😊", label: "Smile" },
  { key: "sad", symbol: "😔", label: "Sad face" },
  { key: "angry", symbol: "😠", label: "Angry face" },
  { key: "idea", symbol: "💡", label: "Idea" },
  { key: "fire", symbol: "🔥", label: "Fire" },
  { key: "trophy", symbol: "🏆", label: "Trophy" },
  { key: "check", symbol: "✅", label: "Check" },
];

type StudentCardMarkerStore = Record<string, Record<string, StudentCardMarkerKey>>;

const VALID_KEYS = new Set<StudentCardMarkerKey>(
  STUDENT_CARD_MARKER_OPTIONS.map((option) => option.key)
);

const normalize = (value: unknown) => String(value ?? "").trim();

const readStore = (): StudentCardMarkerStore => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writeStore = (next: StudentCardMarkerStore) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
};

export const getStudentCardMarkerOption = (
  key: StudentCardMarkerKey | null | undefined
): StudentCardMarkerOption | null =>
  STUDENT_CARD_MARKER_OPTIONS.find((option) => option.key === key) || null;

export const readStudentCardMarkers = (
  ownerKey: string | null | undefined
): Record<string, StudentCardMarkerKey> => {
  const normalizedOwnerKey = normalize(ownerKey);
  if (!normalizedOwnerKey) return {};

  const rawBucket = readStore()[normalizedOwnerKey];
  if (!rawBucket || typeof rawBucket !== "object") return {};

  return Object.entries(rawBucket).reduce<Record<string, StudentCardMarkerKey>>(
    (acc, [studentId, markerKey]) => {
      const normalizedStudentId = normalize(studentId);
      if (!normalizedStudentId || !VALID_KEYS.has(markerKey as StudentCardMarkerKey)) {
        return acc;
      }
      acc[normalizedStudentId] = markerKey as StudentCardMarkerKey;
      return acc;
    },
    {}
  );
};

export const writeStudentCardMarker = (
  ownerKey: string | null | undefined,
  studentId: string | number | null | undefined,
  markerKey: StudentCardMarkerKey | null
): Record<string, StudentCardMarkerKey> => {
  const normalizedOwnerKey = normalize(ownerKey);
  const normalizedStudentId = normalize(studentId);
  if (!normalizedOwnerKey || !normalizedStudentId) return {};

  const store = readStore();
  const bucket = {
    ...readStudentCardMarkers(normalizedOwnerKey),
  };

  if (markerKey && VALID_KEYS.has(markerKey)) {
    bucket[normalizedStudentId] = markerKey;
  } else {
    delete bucket[normalizedStudentId];
  }

  if (Object.keys(bucket).length === 0) {
    delete store[normalizedOwnerKey];
  } else {
    store[normalizedOwnerKey] = bucket;
  }

  writeStore(store);

  // Persist to backend so markers survive across browsers/devices.
  import("@/services/api").then(({ saveStudentCardMarker }) => {
    saveStudentCardMarker(normalizedStudentId, markerKey).catch(() => {
      /* best-effort — localStorage is the fallback */
    });
  });

  return bucket;
};

// Load markers from the backend and merge into localStorage cache.
export const syncMarkersFromBackend = async (
  ownerKey: string | null | undefined
): Promise<Record<string, StudentCardMarkerKey>> => {
  const normalizedOwnerKey = normalize(ownerKey);
  if (!normalizedOwnerKey) return {};

  try {
    const { fetchStudentCardMarkers } = await import("@/services/api");
    const backendData = await fetchStudentCardMarkers();

    const store = readStore();
    const merged: Record<string, StudentCardMarkerKey> = {};

    for (const [studentId, markerKey] of Object.entries(backendData)) {
      if (VALID_KEYS.has(markerKey as StudentCardMarkerKey)) {
        merged[normalize(studentId)] = markerKey as StudentCardMarkerKey;
      }
    }

    // Merge any localStorage-only entries that aren't on the backend yet,
    // and push them to the backend.
    const localBucket = readStudentCardMarkers(normalizedOwnerKey);
    for (const [studentId, markerKey] of Object.entries(localBucket)) {
      if (!(studentId in merged) && VALID_KEYS.has(markerKey)) {
        merged[studentId] = markerKey;
        import("@/services/api").then(({ saveStudentCardMarker }) => {
          saveStudentCardMarker(studentId, markerKey).catch(() => {});
        });
      }
    }

    store[normalizedOwnerKey] = merged;
    writeStore(store);
    return merged;
  } catch {
    return readStudentCardMarkers(normalizedOwnerKey);
  }
};