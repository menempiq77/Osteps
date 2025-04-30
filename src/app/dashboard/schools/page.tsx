"use client";
import { useState, useEffect } from "react";
import AddSchoolForm from "@/components/dashboard/AddSchoolForm";
import SchoolList from "@/components/dashboard/SchoolList";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import {
  fetchSchools,
  addSchool,
  updateSchool,
  deleteSchool,
} from "@/services/api";

export default function SuperAdminDashboard() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
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

    loadSchools();
  }, []);

  const handleEdit = (school: any) => {
    setEditingSchool({
      id: school.id,
      name: school.name,
      contactPerson: school.contactPerson,
      adminEmail: school.email || school.adminEmail,
      adminPassword: "", // Always empty for security
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
                  schoolAdmin: schoolData.contactPerson, // Ensure this matches your API response
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

      setOpen(false);
      setEditingSchool(null);
    } catch (err) {
      setError(
        editingSchool ? "Failed to update school" : "Failed to add school"
      );
      console.error(err);
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
    } catch (err) {
      setError("Failed to delete school");
      console.error(err);
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="p-6">Loading schools...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Schools</h1>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <Button
              onClick={() => setEditingSchool(null)}
              className="cursor-pointer"
            >
              Add School
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/50 fixed inset-0" />
            <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded shadow">
              <Dialog.Title className="text-lg font-bold mb-4">
                {editingSchool ? "Edit School" : "Add New School"}
              </Dialog.Title>
              <AddSchoolForm
                onSubmit={handleAddOrEditSchool}
                defaultValues={editingSchool}
              />
              <Dialog.Close asChild>
                <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

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

      {deletingId && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this school? This action cannot be
              undone.
            </p>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setDeletingId(null)} className="cursor-pointer">
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} className="cursor-pointer">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
