"use client";

import { useSerwist } from "@serwist/next/react";
import { Download, WifiOff, X } from "lucide-react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
}

type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

const INSTALL_DISMISSED_KEY = "osteps-pwa-install-dismissed";
const INSTALL_DISMISS_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
const UPDATE_INTERVAL_MS = 60_000;

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (window.navigator as NavigatorWithStandalone).standalone === true;

const isIosDevice = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return (
    /iphone|ipad|ipod/.test(userAgent) ||
    (userAgent.includes("macintosh") && window.navigator.maxTouchPoints > 1)
  );
};

export function PwaLifecycle() {
  const { serwist } = useSerwist();
  const [isOnline, setIsOnline] = useState(true);
  const [installEvent, setInstallEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIosInstall, setShowIosInstall] = useState(false);

  useEffect(() => {
    setIsOnline(window.navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!serwist) return;

    void serwist.register().catch((error: unknown) => {
      console.error("Failed to register the Osteps service worker.", error);
    });

    let reloading = false;
    const reloadForUpdate = (event: { isUpdate?: boolean }) => {
      if (!event.isUpdate || reloading) return;
      reloading = true;
      window.location.reload();
    };
    const checkForUpdate = () => {
      if (window.navigator.onLine) {
        void serwist.update();
      }
    };
    const checkWhenVisible = () => {
      if (document.visibilityState === "visible") {
        checkForUpdate();
      }
    };

    serwist.addEventListener("controlling", reloadForUpdate);
    window.addEventListener("focus", checkForUpdate);
    window.addEventListener("online", checkForUpdate);
    document.addEventListener("visibilitychange", checkWhenVisible);
    const initialUpdateTimer = window.setTimeout(checkForUpdate, 5_000);
    const updateTimer = window.setInterval(
      checkForUpdate,
      UPDATE_INTERVAL_MS
    );

    return () => {
      serwist.removeEventListener("controlling", reloadForUpdate);
      window.removeEventListener("focus", checkForUpdate);
      window.removeEventListener("online", checkForUpdate);
      document.removeEventListener("visibilitychange", checkWhenVisible);
      window.clearTimeout(initialUpdateTimer);
      window.clearInterval(updateTimer);
    };
  }, [serwist]);

  useEffect(() => {
    if (isStandalone()) return;
    const dismissedAt = Number(
      window.localStorage.getItem(INSTALL_DISMISSED_KEY)
    );
    if (
      Number.isFinite(dismissedAt) &&
      Date.now() - dismissedAt < INSTALL_DISMISS_DURATION_MS
    ) {
      return;
    }

    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    setShowIosInstall(isIosDevice());

    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
    };
  }, []);

  const dismissInstall = () => {
    window.localStorage.setItem(INSTALL_DISMISSED_KEY, String(Date.now()));
    setInstallEvent(null);
    setShowIosInstall(false);
  };

  const installApp = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  };

  return (
    <>
      {!isOnline ? (
        <div
          role="status"
          className="fixed inset-x-3 bottom-3 z-[10000] mx-auto flex max-w-lg items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-950 shadow-2xl"
        >
          <WifiOff className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>
            You are offline. Reconnect to load live school data or save changes.
          </span>
        </div>
      ) : null}

      {isOnline && (installEvent || showIosInstall) ? (
        <div className="fixed inset-x-3 bottom-3 z-[9999] mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-2xl">
          <button
            type="button"
            onClick={dismissInstall}
            className="absolute right-2 top-2 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Dismiss install message"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="flex items-start gap-3 pr-7">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#272736] text-white">
              <Download className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="font-black">Install Osteps</p>
              <p className="mt-1 text-sm leading-5 text-slate-600">
                {showIosInstall
                  ? "In Safari, open Share and choose Add to Home Screen."
                  : "Open Osteps like an app without the browser bar."}
              </p>
              {installEvent ? (
                <button
                  type="button"
                  onClick={installApp}
                  className="mt-3 rounded-xl bg-[#38C16C] px-4 py-2 text-sm font-black text-white transition hover:bg-[#2f9f5b]"
                >
                  Install app
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
