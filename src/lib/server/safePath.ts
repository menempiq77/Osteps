import path from "path";

/**
 * Sanitize a single untrusted path segment so it can never traverse
 * directories. Strips everything except alphanumerics, dot, underscore,
 * dash and space, and collapses any leading/trailing dots so values like
 * "..", "." or "%2e%2e" cannot escape the intended directory.
 */
export const safePathSegment = (value: string | null | undefined): string => {
  const cleaned = String(value ?? "")
    .trim()
    .replace(/[^a-zA-Z0-9._\- ]/g, "_")
    .replace(/\.{2,}/g, "_")
    .replace(/^\.+/, "")
    .replace(/\.+$/, "")
    .trim();
  return cleaned || "unknown";
};

/**
 * Resolve one or more untrusted segments beneath `baseDir` and guarantee the
 * result stays inside `baseDir`. Returns null when the resolved path would
 * escape the base directory (defense-in-depth on top of segment sanitizing).
 */
export const resolveWithinDir = (
  baseDir: string,
  ...segments: Array<string | null | undefined>
): string | null => {
  const base = path.resolve(baseDir);
  const safeSegments = segments.map((s) => safePathSegment(s));
  const resolved = path.resolve(base, ...safeSegments);
  if (resolved !== base && !resolved.startsWith(base + path.sep)) {
    return null;
  }
  return resolved;
};
