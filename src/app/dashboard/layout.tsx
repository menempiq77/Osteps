"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Sidebar from "@/components/ui/Sidebar";
import { redirect, usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();

  if (!currentUser) {
    redirect("/");
  }
  const shouldApplyMaxWidth = !pathname.startsWith(
    "/dashboard/students/reports"
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      <Sidebar />

      <div className="flex-1 h-screen overflow-y-auto">
        <div
          className={`mx-auto ${shouldApplyMaxWidth ? "max-w-7xl p-6" : ""}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
