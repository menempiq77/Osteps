"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  HomeIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BookOpenIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const Sidebar = () => {
  const pathname = usePathname();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [isOpen, setIsOpen] = useState(true);

  const navigation = {
    SUPER_ADMIN: [
      { name: "Dashboard", href: "/dashboard/super-admin", icon: HomeIcon },
      {
        name: "Schools",
        href: "/dashboard/schools",
        icon: AcademicCapIcon,
      },
      {
        name: "Admins",
        href: "/dashboard/admins",
        icon: UserGroupIcon,
      },
    ],
    SCHOOL_ADMIN: [
      { name: "Dashboard", href: "/dashboard/school-admin", icon: HomeIcon },
      {
        name: "Classes",
        href: "/dashboard/classes",
        icon: BookOpenIcon,
      },
      {
        name: "Teachers",
        href: "/dashboard/teachers",
        icon: UserGroupIcon,
      },
      {
        name: "Settings",
        href: "/dashboard/school-admin/settings",
        icon: Cog6ToothIcon,
      },
    ],
    TEACHER: [
      {
        name: "My Classes",
        href: "/dashboard/teacher/classes",
        icon: BookOpenIcon,
      },
      {
        name: "Students",
        href: "/dashboard/teacher/students",
        icon: UserGroupIcon,
      },
    ],
    STUDENT: [
      {
        name: "My Classes",
        href: "/dashboard/student/classes",
        icon: BookOpenIcon,
      },
      {
        name: "Assignments",
        href: "/dashboard/student/assignments",
        icon: AcademicCapIcon,
      },
    ],
  };

  return (
    <div
      className={`h-screen bg-white shadow-lg ${
        isOpen ? "w-64" : "w-20"
      } transition-all duration-300`}
    >
      <div className="p-4 flex flex-col h-full">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mb-4 p-2 hover:bg-gray-100 rounded-lg self-end"
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
