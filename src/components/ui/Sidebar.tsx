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
import { ChartBarIcon, UserCircleIcon, BookTextIcon, Building } from "lucide-react";
import { useState, useEffect } from "react";
import { logout } from "@/features/auth/authSlice";
import useMediaQuery from "@/hooks/useMediaQuery";

const Sidebar = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isOpen, setIsOpen] = useState(!isMobile);

  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/";
  };

  const navigation = {
    SUPER_ADMIN: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Schools", href: "/dashboard/schools", icon: AcademicCapIcon },
      { name: "Admins", href: "/dashboard/admins", icon: UserGroupIcon },
      { name: "Announcements", href: "/dashboard/announcements", icon: MegaphoneIcon  },
    ],
    SCHOOL_ADMIN: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "Teachers", href: "/dashboard/teachers", icon: UserCircleIcon },
      { name: "Students", href: "/dashboard/students", icon: UserGroupIcon },
      { name: "Manage Classes", href: "/dashboard/years", icon: BookOpenIcon },
      { name: "Manage Grades", href: "/dashboard/grades", icon: ChartBarIcon },
      { name: "Library", href: "/dashboard/library", icon: BookTextIcon },
      // { name: "Trackers", href: "/dashboard/trackers", icon: Building },
      { name: "Timetable", href: "/dashboard/timetable", icon: BookOpenIcon },
      { name: "Announcements", href: "/dashboard/announcements", icon: MegaphoneIcon  },
      {
        name: "Settings",
        href: "/dashboard/school-admin/settings",
        icon: Cog6ToothIcon,
      },
    ],
    TEACHER: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "My Classes", href: "/dashboard/years", icon: BookOpenIcon },
      { name: "Students", href: "/dashboard/students", icon: UserGroupIcon },
      { name: "Library", href: "/dashboard/library", icon: BookTextIcon },
      // { name: "Trackers", href: "/dashboard/trackers", icon: Building  },
      { name: "Timetable", href: "/dashboard/timetable", icon: BookOpenIcon },
      { name: "Announcements", href: "/dashboard/announcements", icon: MegaphoneIcon  },
    ],
    STUDENT: [
      { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
      { name: "My Classes", href: "/dashboard/years", icon: BookOpenIcon },
      {
        name: "Assignments",
        href: "/dashboard/students/assignments",
        icon: AcademicCapIcon,
      },
      { name: "Timetable", href: "/dashboard/timetable", icon: BookOpenIcon },
      { name: "Library", href: "/dashboard/library", icon: BookTextIcon },
      { name: "Announcements", href: "/dashboard/announcements", icon: MegaphoneIcon  },
    ],
  };

  if (pathname.startsWith("/dashboard/students/reports")) {
    return null;
  }  

  return (
    <div
      className={`h-screen bg-white shadow-lg transition-all duration-300 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="w-full flex items-center justify-between mb-4">
          <Link href="/">
            {isOpen && <h2 className="font-semibold">{currentUser?.role}</h2>}
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg
              className="w-6 h-6"
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

        <nav className="flex-1">
          {currentUser?.role &&
            navigation[currentUser.role].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center p-3 mb-1 rounded-lg hover:bg-blue-50 ${
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700"
                }`}
              >
                <item.icon
                  className={`h-6 w-6 ${isOpen ? "mr-3" : "mx-auto"}`}
                />
                {isOpen && <span className="text-sm">{item.name}</span>}
              </Link>
            ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 mt-2 rounded-lg hover:bg-blue-50 text-gray-700"
        >
          <ArrowLeftOnRectangleIcon
            className={`h-6 w-6 ${isOpen ? "mr-3" : "mx-auto"}`}
          />
          {isOpen && <span className="text-sm">Logout</span>}
        </button>

        {currentUser && (
          <div className="mt-auto border-t pt-4">
            <div className="flex items-center p-2">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {currentUser.email[0].toUpperCase()}
                </div>
              </div>
              {isOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {currentUser.email}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {currentUser.role.replace("_", " ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;