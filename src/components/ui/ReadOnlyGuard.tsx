"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { message } from "antd";
import {
  activateReadOnlyWorkspace,
  isReadOnlyWorkspace,
} from "@/lib/readOnlyWorkspace";

/**
 * Enforces a read-only view of the dashboard when it is loaded with `?readonly=1`
 * (used when a School Admin opens an ARCHIVED subject in the embedded popup).
 *
 * It works at the network layer: every mutating request (POST/PUT/PATCH/DELETE)
 * made from this browsing context is blocked, while reads (GET/HEAD) pass
 * through untouched. Because every data-loading endpoint in the app is a GET and
 * every mutation is a POST/PUT/PATCH/DELETE, this guarantees the whole workspace
 * — classes, students, assessments, tasks, markbook, tracker, reports — stays
 * fully viewable but cannot be changed.
 *
 * The guard only ever runs inside the popup iframe: the param is present only on
 * that document, and patches are applied to the iframe's own `window`, so the
 * main dashboard window is never affected.
 */

// Sticky per-document read-only state lives in @/lib/readOnlyWorkspace so data
// queries can also key on it. Once activated we keep it on for the life of this
// browsing context, so client-side navigations that drop the query param (e.g.
// clicking the subject side bar) can't silently re-enable editing.
let PATCHED = false;

const BLOCKED_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

let lastNotifyAt = 0;
const notifyBlocked = () => {
  const now = Date.now();
  if (now - lastNotifyAt < 4000) return;
  lastNotifyAt = now;
  message.info("This subject is archived — read-only. Changes are disabled here.");
};

const installNetworkGuards = () => {
  if (PATCHED || typeof window === "undefined") return;
  PATCHED = true;

  // ── fetch ──────────────────────────────────────────────────────────────
  const originalFetch = window.fetch?.bind(window);
  if (originalFetch) {
    window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
      const method = String(
        init?.method ??
          (typeof input === "object" && input !== null && "method" in input
            ? (input as Request).method
            : "GET")
      ).toUpperCase();
      if (BLOCKED_METHODS.has(method)) {
        notifyBlocked();
        return Promise.reject(
          new DOMException("Blocked by archived read-only mode", "AbortError")
        );
      }
      return originalFetch(input as RequestInfo, init);
    }) as typeof window.fetch;
  }

  // ── XMLHttpRequest (axios uses this under the hood) ─────────────────────
  const XHR = window.XMLHttpRequest;
  if (XHR) {
    const originalOpen = XHR.prototype.open;
    const originalSend = XHR.prototype.send;

    XHR.prototype.open = function (
      this: XMLHttpRequest & { __roMethod?: string },
      method: string,
      ...rest: unknown[]
    ) {
      this.__roMethod = String(method || "GET").toUpperCase();
      // @ts-expect-error passthrough to native signature
      return originalOpen.call(this, method, ...rest);
    };

    XHR.prototype.send = function (
      this: XMLHttpRequest & { __roMethod?: string },
      ...args: unknown[]
    ) {
      if (this.__roMethod && BLOCKED_METHODS.has(this.__roMethod)) {
        notifyBlocked();
        // Fail the request without hitting the network so no data changes.
        setTimeout(() => {
          try {
            this.dispatchEvent(new Event("error"));
          } catch {
            /* noop */
          }
        }, 0);
        return;
      }
      // @ts-expect-error passthrough to native signature
      return originalSend.apply(this, args);
    };
  }
};

export default function ReadOnlyGuard() {
  const searchParams = useSearchParams();
  const [active, setActive] = useState(isReadOnlyWorkspace());

  useEffect(() => {
    if (searchParams.get("readonly") === "1") {
      activateReadOnlyWorkspace();
    }
    if (isReadOnlyWorkspace()) {
      installNetworkGuards();
      setActive(true);
    }
  }, [searchParams]);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed left-1/2 top-2 z-[1200] -translate-x-1/2"
      role="status"
      aria-live="polite"
    >
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700 shadow-sm backdrop-blur">
        Archived — read-only
      </span>
    </div>
  );
}
