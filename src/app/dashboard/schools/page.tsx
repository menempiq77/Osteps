"use client";
import { useState, useEffect } from "react";
import AddSchoolForm from "@/components/dashboard/AddSchoolForm";
import SchoolList from "@/components/dashboard/SchoolList";
import { Spin, Modal, Button, message } from "antd";
import { addSchool, deleteSchool, fetchSchools, updateSchool } from "@/services/schoolApi";

export default function SuperAdminDashboard() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
      messageApi?.success(editingSchool ? "Updated school Successfully!" : "Added school Successfully!")
      setOpen(false);
      setEditingSchool(null);
    } catch (err) {
      setError(
        editingSchool ? "Failed to update school" : "Failed to add school"
      );
      console.error(err);
      messageApi?.error(editingSchool ? "Failed to update school" : "Failed to add school")
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
      messageApi?.success("Deleted school Successfully!")
    } catch (err) {
      setError("Failed to delete school");
      messageApi?.error("Failed to delete school")
      console.error(err);
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div className="p-3 md:p-6 flex justify-center items-center h-64">
      <Spin size="large" />
    </div>
  );

  return (
    <div className="p-3 md:p-6">
      {contextHolder}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Schools</h1>
        <Button
          onClick={() => {
            setEditingSchool(null);
            setOpen(true);
          }}
          className="!bg-primary !text-white hover:!bg-primary/90 !border-0"
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
        footer={null}
        destroyOnHidden
      >
        <AddSchoolForm
          onSubmit={handleAddOrEditSchool}
          defaultValues={editingSchool}
        />
      </Modal>

      <SchoolList
        schools={schools.map((school) => ({
          id: school.id,
          name: school.name,
          adminEmail: school.email,
          contactPerson: school.schoolAdmin,
          academicYear: school.year_structure,
        }))}
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