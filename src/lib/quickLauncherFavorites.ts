import type { User } from "@/features/auth/types";

export const QUICK_LAUNCHER_FAVORITES_STORAGE_KEY = "osteps:quick-launcher:favorites";
export const QUICK_LAUNCHER_FAVORITES_CHANGED_EVENT = "osteps:quick-launcher:favorites-changed";

const FAVORITES_USER_STORAGE_PREFIX = `${QUICK_LAUNCHER_FAVORITES_STORAGE_KEY}:user:`;

type FavoriteOwner = Partial<Pick<User, "id" | "email" | "role" | "school" | "schoolId">> | null | undefined;

const normalizeFavoriteIds = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter((id): id is string => typeof id === "string" && id.trim().length > 0)));
};

const readIdsFromKey = (key: string): string[] | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(key);
    if (stored == null) return null;
    return normalizeFavoriteIds(JSON.parse(stored));
  } catch {
    return [];
  }
};

const safeStoragePart = (value: unknown) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9@._-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getQuickLauncherFavoritesStorageKey = (owner?: FavoriteOwner) => {
  const userPart = safeStoragePart(owner?.id) || safeStoragePart(owner?.email);
  if (!userPart) return QUICK_LAUNCHER_FAVORITES_STORAGE_KEY;

  const rolePart = safeStoragePart(owner?.role) || "user";
  const schoolPart = safeStoragePart(owner?.school ?? owner?.schoolId) || "global";
  return `${FAVORITES_USER_STORAGE_PREFIX}${rolePart}:${schoolPart}:${userPart}`;
};

export const readQuickLauncherFavoriteIds = (owner?: FavoriteOwner) => {
  const scopedKey = getQuickLauncherFavoritesStorageKey(owner);
  const scopedIds = readIdsFromKey(scopedKey);
  if (scopedIds !== null) return scopedIds;

  // One-time migration path for users who already saved favourites before
  // account-scoped storage existed. The next write saves them to the scoped key.
  return readIdsFromKey(QUICK_LAUNCHER_FAVORITES_STORAGE_KEY) ?? [];
};

export const writeQuickLauncherFavoriteIds = (ids: string[], owner?: FavoriteOwner) => {
  if (typeof window === "undefined") return;

  const favoriteIds = normalizeFavoriteIds(ids);
  const scopedKey = getQuickLauncherFavoritesStorageKey(owner);
  const payload = JSON.stringify(favoriteIds);

  try {
    window.localStorage.setItem(scopedKey, payload);

    // Keep the legacy key in sync so currently-open tabs and older builds do not
    // wipe favourites during the transition to per-account persistence.
    window.localStorage.setItem(QUICK_LAUNCHER_FAVORITES_STORAGE_KEY, payload);

    window.dispatchEvent(
      new CustomEvent(QUICK_LAUNCHER_FAVORITES_CHANGED_EVENT, {
        detail: { favoriteIds, storageKey: scopedKey },
      })
    );
  } catch {
    // Ignore private browsing/localStorage failures.
  }
};
