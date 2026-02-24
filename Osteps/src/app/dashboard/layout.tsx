"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Sidebar from "@/components/ui/Sidebar";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "osteps-dashboard-theme";
const THEMES = {
  green: {
    label: "Green",
    primary: "#38C16C",
    soft: "#eef9f2",
    soft2: "#dff3e7",
    border: "#b9e2cd",
    dark: "#2f8f5b",
    shadow: "rgba(22, 101, 52, 0.35)",
    scrollStart: "#34d399",
    scrollEnd: "#16a34a",
  },
  blue: {
    label: "Blue",
    primary: "#2F80ED",
    soft: "#edf4ff",
    soft2: "#d9e9ff",
    border: "#b9d2ff",
    dark: "#1f5fb8",
    shadow: "rgba(30, 64, 175, 0.35)",
    scrollStart: "#60a5fa",
    scrollEnd: "#2563eb",
  },
  red: {
    label: "Red",
    primary: "#E35D5D",
    soft: "#fff0f0",
    soft2: "#ffe0e0",
    border: "#f7bbbb",
    dark: "#b84141",
    shadow: "rgba(153, 27, 27, 0.32)",
    scrollStart: "#f87171",
    scrollEnd: "#dc2626",
  },
  purple: {
    label: "Purple",
    primary: "#8B5CF6",
    soft: "#f3efff",
    soft2: "#e9dfff",
    border: "#d3c0ff",
    dark: "#6a3fd0",
    shadow: "rgba(109, 40, 217, 0.33)",
    scrollStart: "#a78bfa",
    scrollEnd: "#7c3aed",
  },
  orange: {
    label: "Orange",
    primary: "#F08A24",
    soft: "#fff5e9",
    soft2: "#ffe8cd",
    border: "#f6d0a2",
    dark: "#b86315",
    shadow: "rgba(180, 83, 9, 0.34)",
    scrollStart: "#fb923c",
    scrollEnd: "#ea580c",
  },
} as const;

type ThemeName = keyof typeof THEMES;

const applyTheme = (themeName: ThemeName) => {
  const theme = THEMES[themeName];
  const root = document.documentElement;
  root.style.setProperty("--primary", theme.primary);
  root.style.setProperty("--theme-soft", theme.soft);
  root.style.setProperty("--theme-soft-2", theme.soft2);
  root.style.setProperty("--theme-border", theme.border);
  root.style.setProperty("--theme-dark", theme.dark);
  root.style.setProperty("--theme-shadow", theme.shadow);
  root.style.setProperty("--theme-scroll-start", theme.scrollStart);
  root.style.setProperty("--theme-scroll-end", theme.scrollEnd);
  root.style.setProperty("--theme-name", themeName);
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isRouteTransitioning, setIsRouteTransitioning] = useState(false);
  const [themeName, setThemeName] = useState<ThemeName>("green");

  const formatSegmentLabel = (segment: string) => {
    const cleaned = decodeURIComponent(segment).replace(/[-_]+/g, " ").trim();
    if (!cleaned) return "";
    return cleaned
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const breadcrumbItems = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const items: Array<{ label: string; href: string }> = [];

    if (!segments.length) return items;

    let runningPath = "";
    segments.forEach((segment) => {
      runningPath += `/${segment}`;
      items.push({
        label: formatSegmentLabel(segment),
        href: runningPath,
      });
    });

    return items;
  }, [pathname]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    const raw = localStorage.getItem(THEME_STORAGE_KEY) as ThemeName | null;
    const nextTheme: ThemeName =
      raw && Object.prototype.hasOwnProperty.call(THEMES, raw) ? raw : "green";
    setThemeName(nextTheme);
    applyTheme(nextTheme);
  }, [isHydrated]);

  const handleThemeChange = (nextTheme: ThemeName) => {
    setThemeName(nextTheme);
    applyTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  };

  useEffect(() => {
    if (isHydrated && !currentUser) {
      router.push("/");
    }
  }, [currentUser, router, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    setIsRouteTransitioning(true);
    const timer = setTimeout(() => setIsRouteTransitioning(false), 420);
    return () => clearTimeout(timer);
  }, [pathname, isHydrated]);

  if (!isHydrated || !currentUser) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const shouldApplyMaxWidth = !pathname.startsWith("/dashboard/students/reports");

  return (
    <div className="dashboard-theme-scope min-h-screen bg-[var(--theme-soft)] flex">
      <Sidebar />

      <div className="flex-1 h-screen overflow-y-auto relative">
        <div
          className={`dashboard-route-overlay ${
            isRouteTransitioning ? "dashboard-route-overlay-active" : ""
          }`}
        />
        <div
          className={`mx-auto ${shouldApplyMaxWidth ? "max-w-7xl p-3 md:p-6" : ""}`}
        >
          <div className="mb-4 rounded-xl border border-[var(--theme-border)] bg-white px-3 py-2 md:px-4 md:py-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                {breadcrumbItems.map((item, index) => {
                  const isLast = index === breadcrumbItems.length - 1;
                  return (
                    <div key={item.href} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => router.push(item.href)}
                        disabled={isLast}
                        className={`transition-colors ${
                          isLast
                            ? "cursor-default font-medium text-gray-800"
                            : "text-gray-500 hover:text-[var(--theme-dark)]"
                        }`}
                      >
                        {item.label}
                      </button>
                      {!isLast && <span className="text-gray-300">/</span>}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-soft)] px-2 py-1">
                  {(Object.keys(THEMES) as ThemeName[]).map((name) => (
                    <button
                      key={name}
                      type="button"
                      title={THEMES[name].label}
                      onClick={() => handleThemeChange(name)}
                      className={`h-5 w-5 rounded-full border transition ${
                        themeName === name
                          ? "scale-110 ring-2 ring-offset-1 ring-[var(--theme-border)]"
                          : "opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: THEMES[name].primary }}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="rounded-lg border border-[var(--theme-border)] bg-[var(--theme-soft)] px-3 py-1.5 text-sm font-medium text-[var(--theme-dark)] transition hover:bg-[var(--theme-soft-2)]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => window.history.forward()}
                  className="rounded-lg border border-[var(--theme-border)] bg-[var(--theme-soft)] px-3 py-1.5 text-sm font-medium text-[var(--theme-dark)] transition hover:bg-[var(--theme-soft-2)]"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div
            key={pathname}
            className={`dashboard-route-transition ${
              isRouteTransitioning ? "dashboard-route-transition-active" : ""
            }`}
          >
            {children}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .dashboard-theme-scope [class*="text-green-"] {
          color: var(--theme-dark) !important;
        }
        .dashboard-theme-scope [class*="bg-green-50"] {
          background-color: color-mix(in srgb, var(--primary) 12%, white) !important;
        }
        .dashboard-theme-scope [class*="bg-green-100"] {
          background-color: color-mix(in srgb, var(--primary) 20%, white) !important;
        }
        .dashboard-theme-scope [class*="border-green-"] {
          border-color: color-mix(in srgb, var(--primary) 45%, white) !important;
        }
        .dashboard-theme-scope [class*="hover:text-green-"]:hover {
          color: var(--theme-dark) !important;
        }
        .dashboard-theme-scope [class*="hover:bg-green-"]:hover {
          background-color: color-mix(in srgb, var(--primary) 20%, white) !important;
        }
        .dashboard-route-transition {
          animation: dashboardRouteSwap 420ms cubic-bezier(0.22, 1, 0.36, 1);
          transform-origin: top center;
          will-change: transform, opacity, filter;
        }
        .dashboard-route-transition-active {
          animation: dashboardRouteSwap 420ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .dashboard-route-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          z-index: 10;
          background: linear-gradient(
            110deg,
            color-mix(in srgb, var(--primary) 20%, transparent) 0%,
            color-mix(in srgb, var(--primary) 12%, transparent) 45%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: translateX(-12%);
        }
        .dashboard-route-overlay-active {
          animation: dashboardRouteOverlay 420ms ease;
        }
        @keyframes dashboardRouteSwap {
          0% {
            opacity: 0;
            transform: translateX(28px) translateY(6px) scale(0.992);
            filter: blur(2px);
          }
          100% {
            opacity: 1;
            transform: translateX(0) translateY(0) scale(1);
            filter: blur(0);
          }
        }
        @keyframes dashboardRouteOverlay {
          0% {
            opacity: 0;
            transform: translateX(-12%);
          }
          30% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateX(10%);
          }
        }
      `}</style>
    </div>
  );
}
