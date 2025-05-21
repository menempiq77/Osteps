"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  Cog6ToothIcon,
  MegaphoneIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import {
  ChartBarIcon,
  UserCircleIcon,
  BookTextIcon,
  Building,
  HelpCircle,
  NotebookPen,
} from "lucide-react";
import { useState, useEffect } from "react";
import { logout } from "@/features/auth/authSlice";
import useMediaQuery from "@/hooks/useMediaQuery";

const Sidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(3);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isOpen, setIsOpen] = useState(!isMobile);

  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    const fetchUnreadAnnouncements = async () => {
      try {
        // const response = await fetch('/api/announcements/unread-count');
        setUnreadAnnouncements(3);
      } catch (error) {
        console.error("Failed to fetch unread announcements:", error);
      }
    };

    fetchUnreadAnnouncements();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  const navigation = {
    SUPER_ADMIN: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Schools", href: "/dashboard/schools", icon: AcademicCapIcon },
      { name: "Admins", href: "/dashboard/admins", icon: UserGroupIcon },
      {
        name: "Announcements",
        href: "/dashboard/announcements",
        icon: MegaphoneIcon,
        badge: unreadAnnouncements > 0 ? unreadAnnouncements : null,
      },
    ],
    SCHOOL_ADMIN: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Teachers", href: "/dashboard/teachers", icon: UserCircleIcon },
      // { name: "Students", href: "/dashboard/students", icon: UserGroupIcon },
      { name: "Manage Classes", href: "/dashboard/years", icon: BookOpenIcon },
      { name: "Manage Grades", href: "/dashboard/grades", icon: ChartBarIcon },
      { name: "Quiz", href: "/dashboard/quiz", icon: BookOpenIcon },
      { name: "Library", href: "/dashboard/library", icon: BookTextIcon },
      // { name: "Trackers", href: "/dashboard/trackers", icon: Building },
      { name: "Timetable", href: "/dashboard/timetable", icon: BookOpenIcon },
      {
        name: "Announcements",
        href: "/dashboard/announcements",
        icon: MegaphoneIcon,
        badge: unreadAnnouncements > 0 ? unreadAnnouncements : null,
      },
      {
        name: "Settings",
        href: "/dashboard/school-admin/settings",
        icon: Cog6ToothIcon,
      },
    ],
    TEACHER: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "My Classes", href: "/dashboard/years", icon: BookOpenIcon },
      // { name: "Students", href: "/dashboard/students", icon: UserGroupIcon },
      { name: "Library", href: "/dashboard/library", icon: BookTextIcon },
      { name: "Quiz", href: "/dashboard/quiz", icon: BookOpenIcon },
      { name: "Reports", href: "/dashboard/students/reports", icon: Building },
      // { name: "Trackers", href: "/dashboard/trackers", icon: Building  },
      {
        name: "View Trackers",
        href: "/dashboard/viewtrackers",
        icon: Building,
      },
      { name: "Timetable", href: "/dashboard/timetable", icon: BookOpenIcon },
      {
        name: "Announcements",
        href: "/dashboard/announcements",
        icon: MegaphoneIcon,
        badge: unreadAnnouncements > 0 ? unreadAnnouncements : null,
      },
      {
        name: "Answer a Question",
        href: "/dashboard/questions",
        icon: HelpCircle,
      },
      {
        name: "Settings",
        href: "/dashboard/teachers/settings",
        icon: Cog6ToothIcon,
      },
    ],
    STUDENT: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      {
        name: "Assesments",
        href: "/dashboard/students/assignments",
        icon: AcademicCapIcon,
      },
      {
        name: "Trackers",
        href: `/dashboard/trackers/${currentUser?.id}`,
        icon: Building,
      },
      { name: "Timetable", href: "/dashboard/timetable", icon: BookOpenIcon },
      { name: "Library", href: "/dashboard/library", icon: BookTextIcon },
      {
        name: "Announcements",
        href: "/dashboard/announcements",
        icon: MegaphoneIcon,
        badge: unreadAnnouncements > 0 ? unreadAnnouncements : null,
      },
      {
        name: "Ask a Question",
        href: "/dashboard/questions",
        icon: HelpCircle,
      },
      {
        name: "Behavior",
        href: `/dashboard/behavior/${currentUser?.id}`,
        icon: NotebookPen,
      },
      {
        name: "Settings",
        href: "/dashboard/students/settings",
        icon: Cog6ToothIcon,
      },
    ],
  };

  if (pathname.startsWith("/dashboard/students/reports")) {
    return null;
  }

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
            navigation[currentUser.role].map((item) => (
              <Link
                key={item.name}
                href={item.href}
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
                    {item.badge && isOpen && (
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
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
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
                <div className="h-9 w-9 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                  {currentUser.email[0].toUpperCase()}
                </div>
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
