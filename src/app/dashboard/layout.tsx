"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Sidebar from "@/components/ui/Sidebar";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
    }
  }, [currentUser]);

  const shouldApplyMaxWidth = !pathname.startsWith(
    "/dashboard/students/reports"
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      <Sidebar />

      <div className="flex-1 h-screen overflow-y-auto">
        <div
          className={`mx-auto ${shouldApplyMaxWidth ? "max-w-7xl p-3 md:p-6" : ""}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
