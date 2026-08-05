import { useCallback, useEffect, useState } from "react";

export type FullscreenCapableDocument = Document & {
  webkitFullscreenElement?: Element | null;
  msFullscreenElement?: Element | null;
};

type FullscreenCapableElement = HTMLElement & {
  requestFullscreen?: (options?: FullscreenOptions) => Promise<void> | void;
  webkitRequestFullscreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
};

export const getCurrentFullscreenElement = (doc: FullscreenCapableDocument) =>
  doc.fullscreenElement ?? doc.webkitFullscreenElement ?? doc.msFullscreenElement ?? null;

export function useExamLockdown(
  enabled: boolean,
  containerRef: React.RefObject<HTMLElement | null>
) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [supported, setSupported] = useState(true);

  const isFullscreenActive = useCallback(() => {
    if (typeof document === "undefined") return false;
    const fullscreenDocument = document as FullscreenCapableDocument;
    const current = getCurrentFullscreenElement(fullscreenDocument);
    return current === fullscreenDocument.documentElement || current === containerRef.current;
  }, [containerRef]);

  const requestFullscreen = useCallback(async () => {
    if (typeof document === "undefined") return false;
    const target = document.documentElement as FullscreenCapableElement;
    if (isFullscreenActive()) {
      setIsFullscreen(true);
      return true;
    }
    if (!target.requestFullscreen && !target.webkitRequestFullscreen && !target.msRequestFullscreen) {
      setSupported(false);
      setIsFullscreen(false);
      return false;
    }
    try {
      if (target.requestFullscreen) {
        try {
          await target.requestFullscreen({ navigationUI: "hide" });
        } catch {
          await target.requestFullscreen();
        }
      } else if (target.webkitRequestFullscreen) {
        await Promise.resolve(target.webkitRequestFullscreen());
      } else if (target.msRequestFullscreen) {
        await Promise.resolve(target.msRequestFullscreen());
      }
      const active = isFullscreenActive();
      setSupported(true);
      setIsFullscreen(active);
      return active;
    } catch (error) {
      console.error("Failed to enter exam fullscreen:", error);
      const active = isFullscreenActive();
      setIsFullscreen(active);
      return active;
    }
  }, [isFullscreenActive]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const update = () => setIsFullscreen(isFullscreenActive());
    queueMicrotask(update);
    document.addEventListener("fullscreenchange", update);
    document.addEventListener("webkitfullscreenchange", update);
    document.addEventListener("MSFullscreenChange", update);
    return () => {
      document.removeEventListener("fullscreenchange", update);
      document.removeEventListener("webkitfullscreenchange", update);
      document.removeEventListener("MSFullscreenChange", update);
    };
  }, [isFullscreenActive]);

  useEffect(() => {
    if (enabled) queueMicrotask(() => void requestFullscreen());
  }, [enabled, requestFullscreen]);

  return { isFullscreen, setIsFullscreen, supported, requestFullscreen, isFullscreenActive };
}
