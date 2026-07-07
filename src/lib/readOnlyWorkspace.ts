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
 * The flag is a module-level singleton. Module state is per-JS-realm, so the
 * iframe has its own copy that never leaks into the parent dashboard window.
 * Once we see `readonly=1` we keep it sticky for the life of the document so
 * client-side navigations that drop the query param (e.g. clicking the subject
 * side bar) still load archived data.
 */
let READONLY_ACTIVATED = false;

export const isReadOnlyWorkspace = (): boolean => READONLY_ACTIVATED;

export const activateReadOnlyWorkspace = (): void => {
  READONLY_ACTIVATED = true;
};

export const readOnlyFromSearchParams = (
  searchParams: ReadonlyURLSearchParams | URLSearchParams | null | undefined
): boolean => {
  if (searchParams?.get("readonly") === "1") {
    READONLY_ACTIVATED = true;
  }
  return READONLY_ACTIVATED;
};

/**
 * Hook returning whether the current document is an archived read-only
 * workspace. Reads the `readonly=1` param and latches the sticky flag, so any
 * data query keyed on this value refetches with archived data included.
 */
export const useReadOnlyWorkspace = (): boolean => {
  const searchParams = useSearchParams();
  // Latch synchronously during render so the first data fetch already sees it.
  const activeNow = readOnlyFromSearchParams(searchParams);
  const [active, setActive] = useState(activeNow);

  useEffect(() => {
    if (READONLY_ACTIVATED && !active) {
      setActive(true);
    }
  }, [active, searchParams]);

  return active || READONLY_ACTIVATED;
};
