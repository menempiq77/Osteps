"use client";
import { useState, useEffect } from "react";
import AddSchoolForm from "@/components/dashboard/AddSchoolForm";
import SchoolList from "@/components/dashboard/SchoolList";
import { Spin, Modal, Button, message, Breadcrumb } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  addSchool,
  deleteSchool,
  fetchSchools,
  impersonateSchoolAdmin,
  updateSchool,
} from "@/services/schoolApi";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IMPERSONATION_STORAGE_KEY, setCurrentUser } from "@/features/auth/authSlice";
import { RootState } from "@/store/store";

export default function SuperAdminDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingSchoolId, setViewingSchoolId] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const loadSchools = async () => {
    try {
      const data = await fetchSchools();
      setSchools(data);
    } catch (err) {
      setError("Failed to fetch schools");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadSchools();
  }, []);

  const handleEdit = (school: any) => {
    setEditingSchool({
      id: school.id,
      name: school.name,
      contactPerson: school.contactPerson,
      adminEmail: school.email || school.adminEmail,
      adminPassword: "",
      academicYear: school.year_structure || school.academicYear,
    });
    setOpen(true);
  };

  const handleViewSchool = async (school: any) => {
    if (!currentUser) return;

    const schoolId = Number(school.id);
    if (!Number.isFinite(schoolId) || schoolId <= 0) {
      messageApi?.error("Cannot open this school because its id is missing.");
      return;
    }

    setViewingSchoolId(String(school.id));
    try {
      const impersonatedUser = await impersonateSchoolAdmin(schoolId);
      const impersonatedSchool = impersonatedUser?.school || {};
      const impersonatedToken = impersonatedUser?.token;

      if (!impersonatedToken) {
        throw new Error("No school admin token was returned.");
      }

      localStorage.setItem(
        IMPERSONATION_STORAGE_KEY,
        JSON.stringify({
          currentUser,
          token: currentUser.token,
          returnPath: "/dashboard/schools",
        })
      );

      dispatch(setCurrentUser({
        id: String(impersonatedUser?.id || school.adminUserId || school.admin_user_id || school.user_id || `school-${schoolId}`),
        email: impersonatedUser?.email || school.adminEmail || school.email || "",
        role: "SCHOOL_ADMIN",
        name: impersonatedSchool?.name || school.name || school.schoolName || impersonatedUser?.name || "School Admin",
        school: Number(impersonatedSchool?.id || schoolId),
        contact: impersonatedSchool?.contact || school.contactPerson || school.schoolAdmin || school.contact || "",
        token: impersonatedToken,
        assigned_subjects: Array.isArray(impersonatedUser?.assigned_subjects)
          ? impersonatedUser.assigned_subjects
          : [],
        subject_roles: Array.isArray(impersonatedUser?.subject_roles)
          ? impersonatedUser.subject_roles
          : [],
        default_subject_id: typeof impersonatedUser?.default_subject_id === "number"
          ? impersonatedUser.default_subject_id
          : null,
      }));

      router.push("/dashboard/subject-cards");
    } catch (err: any) {
      console.error(err);
      messageApi?.error(
        err?.response?.data?.message ||
          err?.response?.data?.msg ||
          err?.message ||
          "Could not open this school as school admin."
      );
    } finally {
      setViewingSchoolId(null);
    }
  };

  const handleAddOrEditSchool = async (schoolData: any) => {
    try {
      if (editingSchool) {
        // Update existing school
        const updatedSchool = await updateSchool(editingSchool.id, {
          name: schoolData.name,
          contact: schoolData.contactPerson,
          school_admin: schoolData.contactPerson,
          email: schoolData.adminEmail,
          password: schoolData.adminPassword,
          year_structure: schoolData.academicYear,
        });

        setSchools((prev) =>
          prev.map((school) =>
            school.id === editingSchool.id
              ? {
                  ...school,
                  ...updatedSchool.data,
                  schoolAdmin: schoolData.contactPerson,
                  email: schoolData.adminEmail,
                }
              : school
          )
        );
      } else {
        // Add new school
        const newSchool = await addSchool({
          name: schoolData.name,
          contact: schoolData.contactPerson,
          school_admin: schoolData.contactPerson,
          email: schoolData.adminEmail,
          password: schoolData.adminPassword,
          year_structure: schoolData.academicYear,
        });

        setSchools((prev) => [
          ...prev,
          {
            ...newSchool.data,
            schoolAdmin: schoolData.contactPerson,
            email: schoolData.adminEmail,
          },
        ]);
      }
      await loadSchools();
      messageApi?.success(
        editingSchool
          ? "Updated school Successfully!"
          : "Added school Successfully!"
      );
      setOpen(false);
      setEditingSchool(null);
    } catch (err) {
      setError(
        editingSchool ? "Failed to update school" : "Failed to add school"
      );
      console.error(err);
      messageApi?.error(
        editingSchool ? "Failed to update school" : "Failed to add school"
      );
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;

    try {
      await deleteSchool(deletingId);
      setSchools((prev) => prev.filter((school) => school.id !== deletingId));
      setDeletingId(null);
      messageApi?.success("Deleted school Successfully!");
    } catch (err) {
      setError("Failed to delete school");
      const errorMessage = axios.isAxiosError(err)
        ? (err.response?.data?.msg as string) || "Failed to delete school"
        : "Failed to delete school";
      messageApi?.error(errorMessage);
      console.error(err);
      setDeletingId(null);
    }
  };

  if (loading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="premium-page rounded-2xl p-3 md:p-6">
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <span>Schools</span>,
          },
        ]}
        className="!mb-2"
      />
      <div className="premium-hero flex items-center justify-between mb-6 rounded-xl px-4 py-3">
        <h1 className="text-2xl font-bold">Schools</h1>
        <Button
          type="primary"
          onClick={() => {
            setEditingSchool(null);
            setOpen(true);
          }}
          className="premium-pill-btn !border-0 !font-semibold"
          style={{
            background: "linear-gradient(90deg, var(--primary), var(--theme-scroll-end))",
            color: "#ffffff",
            minWidth: "140px",
            borderColor: "transparent",
          }}
        >
          Add School
        </Button>
      </div>

      <Modal
        title={editingSchool ? "Edit School" : "Add New School"}
        open={open}
        onCancel={() => {
          setOpen(false);
          setEditingSchool(null);
        }}
        footer={[
          <Button
            key="cancel"
            onClick={() => {
              setOpen(false);
              setEditingSchool(null);
            }}
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            htmlType="submit"
            form="school-form"
            className="!bg-primary !text-white !border-0"
          >
            {editingSchool ? "Update School" : "Create School"}
          </Button>,
        ]}
        destroyOnHidden
        centered
        styles={{
          body: {
            maxHeight: "70vh",
            overflowY: "auto",
            paddingBottom: 16,
          },
        }}
      >
        <AddSchoolForm
          onSubmit={handleAddOrEditSchool}
          defaultValues={editingSchool}
          formId="school-form"
        />
      </Modal>

      <SchoolList
        schools={schools.map((school) => ({
          id: school.id,
          name: school.name,
          adminEmail: school.email,
          contactPerson: school.schoolAdmin,
          academicYear: school.year_structure,
          adminUserId: school.admin_user_id || school.user_id || school.admin?.id,
          contact: school.contact,
          schoolAdmin: school.schoolAdmin,
        }))}
        onView={handleViewSchool}
        viewingSchoolId={viewingSchoolId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        title="Confirm Deletion"
        open={!!deletingId}
        onOk={confirmDelete}
        onCancel={() => setDeletingId(null)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        <p>
          Are you sure you want to delete this school? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
}
