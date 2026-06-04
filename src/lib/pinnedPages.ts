export type PinnedPageOwner = {
  id?: string | number | null;
  email?: string | null;
  role?: string | null;
  student?: string | number | null;
};

export type PinnedPage = {
  href: string;
  label: string;
  createdAt: string;
  updatedAt: string;
};

export const PINNED_PAGES_MAX_COUNT = 12;

const STORAGE_PREFIX = "osteps:pinned-pages:v1";

export const getPinnedPagesStorageKey = (owner?: PinnedPageOwner | null) => {
  const role = String(owner?.role || "guest").trim().toLowerCase() || "guest";
  const identity = String(owner?.id || owner?.student || owner?.email || "anonymous")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9@._-]+/g, "-");

  return `${STORAGE_PREFIX}:${role}:${identity || "anonymous"}`;
};

const normalizePinnedPage = (value: unknown): PinnedPage | null => {
  if (!value || typeof value !== "object") return null;
  const row = value as Partial<PinnedPage>;
  const href = String(row.href || "").trim();
  const label = String(row.label || "").trim();
  if (!href || !href.startsWith("/dashboard")) return null;

  const timestamp = new Date().toISOString();
  return {
    href,
    label: label || "Pinned page",
    createdAt: String(row.createdAt || row.updatedAt || timestamp),
    updatedAt: String(row.updatedAt || row.createdAt || timestamp),
  };
};

export const readPinnedPages = (owner?: PinnedPageOwner | null): PinnedPage[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(getPinnedPagesStorageKey(owner));
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];

    const byHref = new Map<string, PinnedPage>();
    for (const item of parsed) {
      const normalized = normalizePinnedPage(item);
      if (normalized && !byHref.has(normalized.href)) {
        byHref.set(normalized.href, normalized);
      }
    }

    return Array.from(byHref.values()).slice(0, PINNED_PAGES_MAX_COUNT);
  } catch {
    return [];
  }
};

export const writePinnedPages = (
  pages: PinnedPage[],
  owner?: PinnedPageOwner | null
) => {
  if (typeof window === "undefined") return;

  const normalizedPages = pages
    .map(normalizePinnedPage)
    .filter((page): page is PinnedPage => Boolean(page))
    .slice(0, PINNED_PAGES_MAX_COUNT);

  window.localStorage.setItem(
    getPinnedPagesStorageKey(owner),
    JSON.stringify(normalizedPages)
  );
  window.dispatchEvent(new CustomEvent("osteps:pinned-pages-updated"));
};