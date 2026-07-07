"use client";

import { useEffect, useState } from "react";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { useSearchParams } from "next/navigation";

/**
 * Shared state for the archived subject "read-only workspace" popup.
 *
 * When a School Admin opens an ARCHIVED subject, the real subject workspace is
 * embedded in an iframe loaded with `?readonly=1`. Inside that browsing context
 * two things must happen:
 *   1. Mutations are blocked (handled by ReadOnlyGuard's network patches).
 *   2. Data queries must include ARCHIVED (inactive) years/classes/students so
 *      the workspace shows everything as it was, instead of coming up empty
 *      (archiving a subject deactivates all of its subject-classes).
 *
 * Persistence: the query param is only present on the iframe's first URL. A
 * module-level singleton keeps it sticky for SPA navigations, but that resets on
 * a hard reload inside the iframe (e.g. some links do a full document load),
 * which would silently re-enable Manager/Approvals/editing. To survive hard
 * reloads we also latch the flag into `window.name`, which is scoped to the
 * iframe's browsing context and is NOT shared with the parent dashboard window,
 * so read-only never leaks out of the popup.
 */
export const READONLY_WINDOW_NAME = "osteps-archived-readonly";

let READONLY_ACTIVATED = false;

const detectedFromWindowName = (): boolean =>
  typeof window !== "undefined" && window.name === READONLY_WINDOW_NAME;

export const isReadOnlyWorkspace = (): boolean => {
  if (READONLY_ACTIVATED) return true;
  if (detectedFromWindowName()) READONLY_ACTIVATED = true;
  return READONLY_ACTIVATED;
};

export const activateReadOnlyWorkspace = (): void => {
  READONLY_ACTIVATED = true;
  // Latch into the iframe browsing context so it survives hard reloads.
  if (typeof window !== "undefined" && window.name !== READONLY_WINDOW_NAME) {
    try {
      window.name = READONLY_WINDOW_NAME;
    } catch {
      /* noop */
    }
  }
};

export const readOnlyFromSearchParams = (
  searchParams: ReadonlyURLSearchParams | URLSearchParams | null | undefined
): boolean => {
  if (searchParams?.get("readonly") === "1") {
    activateReadOnlyWorkspace();
  }
  return isReadOnlyWorkspace();
};

/**
 * Hook returning whether the current document is an archived read-only
 * workspace. Reads the `readonly=1` param (and the sticky `window.name` latch),
 * so any data query keyed on this value refetches with archived data included.
 */
export const useReadOnlyWorkspace = (): boolean => {
  const searchParams = useSearchParams();
  // Latch synchronously during render so the first data fetch already sees it.
  const activeNow = readOnlyFromSearchParams(searchParams);
  const [active, setActive] = useState(activeNow);

  useEffect(() => {
    if (isReadOnlyWorkspace() && !active) {
      setActive(true);
    }
  }, [active, searchParams]);

  return active || isReadOnlyWorkspace();
};
