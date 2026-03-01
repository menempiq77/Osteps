"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Settings,
  Megaphone,
  BarChart2,
  UserCircle,
  HelpCircle,
  NotebookPen,
  LucideLogOut,
  BarChart3,
  Award,
  FolderOpen,
  Library,
  FileBarChart,
  CheckSquare,
  Layers,
  ClipboardList,
  Wrench,
  Brain,
} from "lucide-react";
import { useState, useEffect } from "react";
import { logout } from "@/features/auth/authSlice";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUnseenAnnouncementCount } from "@/services/announcementApi";
import { fetchUnreadCount, markAllNotificationsAsRead } from "@/services/notificationsApi";
import { useSubjectContext } from "@/contexts/SubjectContext";
import { isSharedPath } from "@/lib/subjectRouting";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isOpen, setIsOpen] = useState(!isMobile);
  const [orderedItems, setOrderedItems] = useState<any[]>([]);
  const [draggingItemName, setDraggingItemName] = useState<string | null>(null);
  const { toSubjectHref, canUseSubjectContext, activeSubjectId, activeSubject } = useSubjectContext();
  const isIslamiatContext =
    !canUseSubjectContext ||
    !activeSubject ||
    /islam|islamiat|islamic/i.test(activeSubject.name);

  const roleKey = (currentUser?.role ?? "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_");

  const isSUPER_ADMIN = roleKey === "SUPER_ADMIN";

  // Announcement unread count
  const { data: announcementData } = useQuery({
    queryKey: ["unseen-announcement-count", roleKey],
    queryFn: fetchUnseenAnnouncementCount,
    enabled: !!roleKey,
  });

  // Question unread count
  const { data: questionUnreadCount = 0 } = useQuery({
    queryKey: ["unread-count", roleKey],
    queryFn: fetchUnreadCount,
    enabled: !isSUPER_ADMIN,
  });

  const announcementUnreadCount = announcementData?.unseen_count ?? 0;

  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  const handleLogout = () => {
    dispatch(logout());
    router?.replace("/");
  };

  const queryClient = useQueryClient();

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.setQueryData(
        ["unread-count", roleKey],
        0
      );
    },
  });

  const handleQuestionClick = () => {
    if (questionUnreadCount > 0) {
      markAllReadMutation.mutate();
    }
  };

  const normalizePath = (value?: string) =>
    value ? value.split("?")[0].replace(/\/+$/, "") || "/" : "/";

  const isItemActive = (href: string) => {
    const current = normalizePath(pathname || "");
    const routedHref =
      canUseSubjectContext && !isSharedPath(href) && activeSubjectId
        ? toSubjectHref(href)
        : href;
    const target = normalizePath(routedHref);
    if (current === target) return true;
    if (target === "/dashboard") return current === "/dashboard";
    return current.startsWith(`${target}/`);
  };

  const navigation = {
    SUPER_ADMIN: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Schools", href: "/dashboard/schools", icon: GraduationCap },
      { name: "Admins", href: "/dashboard/admins", icon: Users },
      {
        name: "Announcements",
        href: "/dashboard/announcements",
        icon: Megaphone,
        badge: announcementUnreadCount,
      },
      {
        name: "Settings",
        href: "/dashboard/admins/settings",
        icon: Settings,
      },
    ],
    ADMIN: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Schools", href: "/dashboard/schools", icon: GraduationCap },
      { name: "Admins", href: "/dashboard/admins", icon: Users },
      {
        name: "Announcements",
        href: "/dashboard/announcements",
        icon: Megaphone,
        badge: announcementUnreadCount,
      },
      {
        name: "Settings",
        href: "/dashboard/admins/settings",
        icon: Settings,
      },
    ],
    SCHOOL_ADMIN: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Manager", href: "/dashboard/manager", icon: Layers },
      { name: "View", href: "/dashboard/view", icon: FolderOpen },
      {
        name: "Leaderboard",
        href: `/dashboard/leaderboard/`,
        icon: Award,
      },
      { name: "Library", href: "/dashboard/library", icon: Library },
      {
        name: "Content Approvals",
        href: "/dashboard/approvals",
        icon: CheckSquare,
      },
      { name: "Timetable", href: "/dashboard/time_table", icon: BookOpen },
      {
        name: "Announcements",
        href: "/dashboard/announcements",
        icon: Megaphone,
        badge: announcementUnreadCount,
      },
      {
        name: "Tools",
        href: "/dashboard/tools",
        icon: Wrench,
      },
      {
        name: "Mind-upgrade",
        href: "/dashboard/mind-upgrade",
        icon: Brain,
        
      },
      {
        name: "Settings",
        href: "/dashboard/school-admin/settings",
        icon: Settings,
      },
    ],
    HOD: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Manager", href: "/dashboard/manager", icon: Layers },
      { name: "View", href: "/dashboard/view", icon: FolderOpen },
      {
        name: "Leaderboard",
        href: `/dashboard/leaderboard/`,
        icon: Award,
      },
      { name: "Library", href: "/dashboard/library", icon: Library },
      {
        name: "Content Approvals",
        href: "/dashboard/approvals",
        icon: CheckSquare,
      },
      { name: "Timetable", href: "/dashboard/time_table", icon: BookOpen },
      {
        name: "Announcements",
        href: "/dashboard/announcements",
        icon: Megaphone,
        badge: announcementUnreadCount,
      },
      {
        name: "Tools",
        href: "/dashboard/tools",
        icon: Wrench,
      },
      {
        name: "Mind-upgrade",
        href: "/dashboard/mind-upgrade",
        icon: Brain,
        
      },
      {
        name: "Settings",
        href: "/dashboard/school-admin/settings",
        icon: Settings,
      },
    ],
    TEACHER: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "My Classes", href: "/dashboard/years", icon: Layers },
      { name: "View", href: "/dashboard/view", icon: FolderOpen },
      { name: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
      { name: "Manage Quiz", href: "/dashboard/quiz", icon: ClipboardList },
      { name: "Trackers", href: "/dashboard/all_trackers", icon: BarChart3 },
      {
        name: "Leaderboard",
        href: `/dashboard/leaderboard`,
        icon: Award,
      },
      { name: "My Materials", href: "/dashboard/materials", icon: FolderOpen },
      { name: "Library", href: "/dashboard/library", icon: Library },
      { name: "Timetable", href: "/dashboard/time_table", icon: BookOpen },
      {
        name: "Announcements",
        href: "/dashboard/announcements",
        icon: Megaphone,
        badge: announcementUnreadCount,
      },
      {
        name: "Behavior",
        href: `/dashboard/student_behavior`,
        icon: NotebookPen,
      },
      {
        name: "Tools",
        href: "/dashboard/tools",
        icon: Wrench,
      },
      {
        name: "Answer a Question",
        href: "/dashboard/questions",
        icon: HelpCircle,
        badge: questionUnreadCount,
      },
      {
        name: "Settings",
        href: "/dashboard/teachers/settings",
        icon: Settings,
      },
    ],
    STUDENT: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      {
        name: "Assesments",
        href: "/dashboard/students/assignments",
        icon: GraduationCap,
      },
      { name: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
      {
        name: "Trackers",
        href: `/dashboard/trackers/${currentUser?.studentClass}`,
        icon: BarChart3,
      },
      {
        name: "Leaderboard",
        href: `/dashboard/leaderboard`,
        icon: Award,
      },
      {
        name: "Shared Materials",
        href: "/dashboard/shared_materials",
        icon: FolderOpen,
      },
      { name: "Library", href: "/dashboard/library", icon: Library },
      { name: "Timetable", href: "/dashboard/time_table", icon: BookOpen },
      {
        name: "Announcements",
        href: "/dashboard/announcements",
        icon: Megaphone,
        badge: announcementUnreadCount,
      },
      {
        name: "Ask a Question",
        href: "/dashboard/questions",
        icon: HelpCircle,
        badge: questionUnreadCount,
      },
      {
        name: "Mind-upgrade",
        href: "/dashboard/mind-upgrade",
        icon: Brain,
      },
      {
        name: "Behavior",
        href: `/dashboard/behavior/${currentUser?.student}`,
        icon: NotebookPen,
      },
      {
        name: "Settings",
        href: "/dashboard/students/settings",
        icon: Settings,
      },
    ],
  };

  const sidebarOrderStorageKey = `sidebar-order-${roleKey || "UNKNOWN"}`;

  const applySavedSidebarOrder = (items: any[]) => {
    if (typeof window === "undefined") return items;
    try {
      const raw = localStorage.getItem(sidebarOrderStorageKey);
      if (!raw) return items;
      const savedOrder: string[] = JSON.parse(raw);
      if (!Array.isArray(savedOrder) || savedOrder.length === 0) return items;

      const rank = new Map(savedOrder.map((name, idx) => [name, idx]));
      return [...items].sort((a, b) => {
        const aRank = rank.has(a.name) ? (rank.get(a.name) as number) : Number.MAX_SAFE_INTEGER;
        const bRank = rank.has(b.name) ? (rank.get(b.name) as number) : Number.MAX_SAFE_INTEGER;
        return aRank - bRank;
      });
    } catch {
      return items;
    }
  };

  const persistSidebarOrder = (items: any[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      sidebarOrderStorageKey,
      JSON.stringify(items.map((item) => item.name))
    );
  };

  useEffect(() => {
    let navItems = ((navigation as any)[roleKey] || []) as any[];
    if (!isIslamiatContext) {
      navItems = navItems.filter((item: any) => item.name !== "Mind-upgrade");
    }
    setOrderedItems(applySavedSidebarOrder(navItems));
  }, [roleKey, announcementUnreadCount, questionUnreadCount, isIslamiatContext]);

  const handleReorderSidebarItems = (draggedName: string, targetName: string) => {
    if (!draggedName || !targetName || draggedName === targetName) return;
    const updated = [...orderedItems];
    const draggedIndex = updated.findIndex((item) => item.name === draggedName);
    const targetIndex = updated.findIndex((item) => item.name === targetName);
    if (draggedIndex < 0 || targetIndex < 0) return;
    const [moved] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, moved);
    setOrderedItems(updated);
    persistSidebarOrder(updated);
  };

  // if (pathname.startsWith("/dashboard/students/reports")) {
  //   return null;
  // }

  return (
    <div
      className={`sidebar-shell h-screen bg-white/85 backdrop-blur-xl shadow-lg transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header with collapse button */}
        <div
          className="sidebar-header w-full p-3 md:p-4 flex items-center justify-between mb-4 border-b border-gray-100 pb-4"
        >
          <Link href="/">
            {isOpen && (
              <h2 className="font-semibold text-white text-lg">
                  {(roleKey || currentUser?.role || "").toString().replace("_", " ")}
              </h2>
            )}
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav
          className="flex-1 p-3 md:p-4 overflow-y-auto sidebar-scrollbar relative"
        >
          {!!roleKey &&
            orderedItems?.map((item: any) => (
              <div
                key={item.name}
                draggable
                onDragStart={() => setDraggingItemName(item.name)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggingItemName) {
                    handleReorderSidebarItems(draggingItemName, item.name);
                  }
                }}
                onDragEnd={() => setDraggingItemName(null)}
                className={`rounded-lg ${draggingItemName === item.name ? "opacity-70" : ""}`}
              >
                <Link
                  href={
                    canUseSubjectContext && !isSharedPath(item.href) && activeSubjectId
                      ? toSubjectHref(item.href)
                      : item.href
                  }
                  onClick={
                    item.name === "Ask a Question" ||
                    item.name === "Answer a Question"
                      ? handleQuestionClick
                      : undefined
                  }
                  className={`sidebar-nav-item group flex items-center p-3 mb-1 rounded-lg cursor-pointer shadow-none transition-all duration-200 relative overflow-hidden ${
                    isItemActive(item.href)
                      ? "sidebar-nav-item-active font-semibold sidebar-item-active"
                      : "text-gray-600 hover:text-[var(--theme-dark)] hover:bg-[var(--theme-soft)]"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 flex-shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "mr-3 group-hover:scale-110"
                        : "mx-auto group-hover:scale-110"
                    }`}
                  />

                  {isOpen && (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm transition-all duration-200 group-hover:translate-x-1">
                        {item.name}
                      </span>
                      {"badge" in item && (
                        <span
                          className="text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                          style={{ backgroundColor: "var(--primary)" }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>

              </div>
            ))}
        </nav>

        {/* Footer with Profile and Logout */}
        <div className="mt-auto border-t border-gray-100 p-3 md:p-4">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`sidebar-logout-item flex items-center w-full p-3 rounded-xl shadow-none hover:bg-[#feecec] text-gray-600 hover:text-red-500 transition-all cursor-pointer ${
              !isOpen ? "justify-center" : ""
            }`}
          >
            <LucideLogOut className="h-5 w-5" />
            {isOpen && <span className="text-sm ml-3">Logout</span>}
          </button>

          {/* Profile Section */}
          {currentUser && (
            <div
              className={`flex items-center p-3 mt-2 rounded-lg ${
                isOpen ? "sidebar-profile bg-gray-50" : "justify-center"
              }`}
            >
              <div className="relative">
                {currentUser.profile_path &&
                currentUser.profile_path !==
                  "https://dashboard.osteps.com/storage" ? (
                  <img
                    src={currentUser.profile_path}
                    alt="Profile"
                    className="h-9 w-9 rounded-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    {currentUser?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div
                  className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: "var(--primary)" }}
                ></div>
              </div>
              {isOpen && (
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {currentUser.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {(roleKey || currentUser.role).replace("_", " ")}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        .sidebar-shell {
          border-right: 1px solid rgba(148, 163, 184, 0.24);
          background:
            radial-gradient(
              580px 280px at 8% -12%,
              color-mix(in srgb, var(--primary) 22%, transparent),
              transparent 58%
            ),
            radial-gradient(
              540px 260px at 100% 0%,
              color-mix(in srgb, var(--theme-scroll-end) 18%, transparent),
              transparent 62%
            ),
            rgba(255, 255, 255, 0.88);
        }
        .sidebar-header {
          background: linear-gradient(
            120deg,
            var(--theme-scroll-start),
            var(--theme-scroll-end)
          );
        }
        .sidebar-profile {
          border: 1px solid rgba(148, 163, 184, 0.24);
          background: rgba(248, 250, 252, 0.8);
        }
        .sidebar-item-active {
          animation: sidebarActivePop 280ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sidebar-nav-item-active {
          background: linear-gradient(
            90deg,
            color-mix(in srgb, var(--primary) 26%, white),
            color-mix(in srgb, var(--theme-scroll-end) 16%, white)
          );
          color: #0f172a;
          border: 1px solid color-mix(in srgb, var(--primary) 36%, white);
        }
        .sidebar-nav-item-active:hover {
          background: linear-gradient(
            90deg,
            color-mix(in srgb, var(--primary) 32%, white),
            color-mix(in srgb, var(--theme-scroll-end) 20%, white)
          );
        }
        .sidebar-nav-item:hover {
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.1);
        }
        .sidebar-logout-item:hover {
          box-shadow: 0 10px 24px rgba(153, 27, 27, 0.32);
        }
        @keyframes sidebarActivePop {
          0% {
            opacity: 0.55;
            transform: translateX(8px) scale(0.985);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
        .sidebar-scrollbar {
          direction: rtl;
          scrollbar-width: thin;
          scrollbar-color: var(--primary) #e5e7eb;
        }
        .sidebar-scrollbar > * {
          direction: ltr;
        }
        .sidebar-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: #e5e7eb;
          border-radius: 999px;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(
            180deg,
            var(--theme-scroll-start),
            var(--theme-scroll-end)
          );
          border-radius: 999px;
          border: 2px solid #e5e7eb;
        }
        .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            180deg,
            var(--theme-scroll-end),
            var(--theme-dark)
          );
        }
      `}</style>
    </div>
  );
};

export default Sidebar;


