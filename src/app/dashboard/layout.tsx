"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Sidebar from "@/components/ui/Sidebar";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !currentUser) {
      console.log("DEBUG: No currentUser found after hydration, redirecting to /");
      router.push("/");
    } else if (currentUser) {
      console.log("DEBUG: Current user found:", currentUser.email, "Role:", currentUser.role);
    }
  }, [currentUser, router, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    setIsRouteTransitioning(true);
    const timer = setTimeout(() => setIsRouteTransitioning(false), 420);
    return () => clearTimeout(timer);
  }, [pathname, isHydrated]);

  // Show loading while not hydrated or while checking auth
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

  const shouldApplyMaxWidth = !pathname.startsWith(
    "/dashboard/students/reports"
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
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
          <div className="mb-4 rounded-xl border border-[#d9ece2] bg-white px-3 py-2 md:px-4 md:py-3">
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
                            : "text-gray-500 hover:text-[#2f8f5b]"
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
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className="rounded-lg border border-[#b9e2cd] bg-[#eef9f2] px-3 py-1.5 text-sm font-medium text-[#2f8f5b] transition hover:bg-[#dff3e7]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => window.history.forward()}
                  className="rounded-lg border border-[#b9e2cd] bg-[#eef9f2] px-3 py-1.5 text-sm font-medium text-[#2f8f5b] transition hover:bg-[#dff3e7]"
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
            rgba(56, 193, 108, 0.16) 0%,
            rgba(15, 118, 110, 0.12) 45%,
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
