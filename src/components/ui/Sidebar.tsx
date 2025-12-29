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
} from "lucide-react";
import { useState, useEffect } from "react";
import { logout } from "@/features/auth/authSlice";
import useMediaQuery from "@/hooks/useMediaQuery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUnseenAnnouncementCount } from "@/services/announcementApi";
import { fetchUnreadCount, markAllNotificationsAsRead } from "@/services/notificationsApi";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isOpen, setIsOpen] = useState(!isMobile);

  const isSUPER_ADMIN = currentUser?.role === "SUPER_ADMIN";

  // Announcement unread count
  const { data: announcementData } = useQuery({
    queryKey: ["unseen-announcement-count", currentUser?.role],
    queryFn: fetchUnseenAnnouncementCount,
    enabled: !!currentUser?.role,
  });

  // Question unread count
  const { data: questionUnreadCount = 0 } = useQuery({
    queryKey: ["unread-count", currentUser?.role],
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
        ["unread-count", currentUser?.role],
        0
      );
    },
  });

  const handleQuestionClick = () => {
    if (questionUnreadCount > 0) {
      markAllReadMutation.mutate();
    }
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
      { name: "Teachers", href: "/dashboard/teachers", icon: UserCircle },
      { name: "Manage Classes", href: "/dashboard/years", icon: Layers },
      { name: "Manage Grades", href: "/dashboard/grades", icon: BarChart2 },
      { name: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
      { name: "Manage Quiz", href: "/dashboard/quiz", icon: ClipboardList },
      {
        name: "Assesments",
        href: "/dashboard/all_assesments",
        icon: GraduationCap,
      },
      {
        name: "View Assesments",
        href: "/dashboard/student_assesments",
        icon: GraduationCap,
      },
      { name: "Trackers", href: "/dashboard/all_trackers", icon: BarChart3 },
      {
        name: "View Trackers",
        href: "/dashboard/viewtrackers",
        icon: BarChart3,
      },
      {
        name: "Leaderboard",
        href: `/dashboard/leaderboard/`,
        icon: Award,
      },
      {
        name: "Reports",
        href: "/dashboard/students/reports",
        icon: FileBarChart,
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
        name: "Behavior",
        href: `/dashboard/student_behavior`,
        icon: NotebookPen,
      },
      {
        name: "Settings",
        href: "/dashboard/school-admin/settings",
        icon: Settings,
      },
    ],
    HOD: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "Teachers", href: "/dashboard/teachers", icon: UserCircle },
      { name: "My Classes", href: "/dashboard/years", icon: Layers },
      { name: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
      { name: "Manage Quiz", href: "/dashboard/quiz", icon: ClipboardList },
      {
        name: "Assesments",
        href: "/dashboard/all_assesments",
        icon: GraduationCap,
      },
      {
        name: "View Assesments",
        href: "/dashboard/student_assesments",
        icon: GraduationCap,
      },
      { name: "Trackers", href: "/dashboard/all_trackers", icon: BarChart3 },
      {
        name: "View Trackers",
        href: "/dashboard/viewtrackers",
        icon: BarChart3,
      },
      {
        name: "Leaderboard",
        href: `/dashboard/leaderboard/`,
        icon: Award,
      },
      { name: "Library", href: "/dashboard/library", icon: Library },
      {
        name: "Reports",
        href: "/dashboard/students/reports",
        icon: FileBarChart,
      },
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
        name: "Behavior",
        href: `/dashboard/student_behavior`,
        icon: NotebookPen,
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
    TEACHER: [
      { name: "Dashboard", href: "/dashboard", icon: Home },
      { name: "My Classes", href: "/dashboard/years", icon: Layers },
      {
        name: "View Assesments",
        href: "/dashboard/student_assesments",
        icon: GraduationCap,
      },
      { name: "Subjects", href: "/dashboard/subjects", icon: BookOpen },
      { name: "Manage Quiz", href: "/dashboard/quiz", icon: ClipboardList },
      {
        name: "Reports",
        href: "/dashboard/students/reports",
        icon: FileBarChart,
      },
      { name: "Trackers", href: "/dashboard/all_trackers", icon: BarChart3 },
      {
        name: "View Trackers",
        href: "/dashboard/viewtrackers",
        icon: BarChart3,
      },
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
        href: `/dashboard/classes/${currentUser?.studentClass}/leaderboard/`,
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

  // if (pathname.startsWith("/dashboard/students/reports")) {
  //   return null;
  // }

  return (
    <div
      className={`h-screen bg-white/90 backdrop-blur-md  shadow-lg transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header with collapse button */}
        <div className="w-full p-3 md:p-4 flex items-center justify-between mb-4 border-b bg-[#38C16C] border-gray-100 pb-4">
          <Link href="/">
            {isOpen && (
              <h2 className="font-semibold text-white text-lg">
                {currentUser?.role.replace("_", " ")}
              </h2>
            )}
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
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
        <nav className="flex-1 p-3 md:p-4 overflow-y-auto scroll-hidden">
          {currentUser?.role &&
            navigation[currentUser.role]?.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={
                  item.name === "Ask a Question" ||
                  item.name === "Answer a Question"
                    ? handleQuestionClick
                    : undefined
                }
                className={`group flex items-center p-3 mb-1 rounded-lg hover:bg-green-50 transition-all relative overflow-hidden ${
                  pathname === item.href
                    ? "bg-green-50 text-[#38C16C] font-medium"
                    : "text-gray-600 hover:text-[#38C16C]"
                }`}
              >
                {/* Hover animation effect */}
                <div
                  className="absolute inset-y-0 left-0 w-1 bg-green-500 transition-all duration-300 
                       transform -translate-x-full group-hover:translate-x-0"
                />

                {/* Icon with subtle animation */}
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
                      <span className="bg-[#38C16C] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            ))}
        </nav>

        {/* Footer with Profile and Logout */}
        <div className="mt-auto border-t border-gray-100 p-3 md:p-4">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className={`flex items-center w-full p-3 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-red-500 transition-colors cursor-pointer ${
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
                isOpen ? "bg-gray-50" : "justify-center"
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
                  <div className="h-9 w-9 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                    {currentUser?.email?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-400 border-2 border-white"></div>
              </div>
              {isOpen && (
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {currentUser.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {currentUser.role.replace("_", " ")}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
