export const normalizeSubjectImageUrl = (value: unknown): string | null => {
  const raw = String(value ?? "").trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
};
