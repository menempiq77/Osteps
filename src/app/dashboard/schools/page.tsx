"use client";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import AddSchoolForm from "@/components/dashboard/AddSchoolForm";
import { addSchool } from "@/features/school/schoolSlice";
import { createSchoolAdmin } from "@/features/auth/authSlice";

export default function SuperAdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { schools } = useSelector((state: RootState) => state.school);

  const handleAddSchool = (schoolData: {
    name: string;
    contactPerson: string;
    adminEmail: string;
    terms: number;
    academicYear: string;
  }) => {
    const newSchool = {
      id: Date.now().toString(),
      ...schoolData,
    };

    // Dispatch actions directly
    dispatch(addSchool(newSchool));
    dispatch(
      createSchoolAdmin({
        id: Date.now().toString(),
        email: schoolData.adminEmail,
        role: "SCHOOL_ADMIN",
        schoolId: newSchool.id,
      })
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Schools</h1>
      <AddSchoolForm onSubmit={handleAddSchool} />
      {/* School List Component */}
    </div>
  );
}
