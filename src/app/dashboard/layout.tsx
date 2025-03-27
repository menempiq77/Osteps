"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Sidebar from "@/components/ui/Sidebar";
import { redirect } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  if (!currentUser) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 h-screen overflow-y-auto">
        <div className="p-6 mx-auto max-w-7xl">{children}</div>
      </div>
    </div>
  );
}
