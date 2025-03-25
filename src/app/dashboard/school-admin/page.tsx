"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ClassManager from "@/components/dashboard/ClassManager";

export default function SchoolAdminDashboard() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { classes } = useSelector((state: RootState) => state.class);

  const schoolClasses = classes.filter(
    (c) => c.schoolId === currentUser?.schoolId
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">School Admin Dashboard</h1>
      <ClassManager schoolId={currentUser?.schoolId || ""} />
      {/* Term Configuration Component */}
    </div>
  );
}
