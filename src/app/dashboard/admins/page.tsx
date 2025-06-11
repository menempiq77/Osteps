"use client";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { AddSuperAdminModal } from "@/components/modals/superAdminModals/AddSuperAdminModal";
import { EditSuperAdminModal } from "@/components/modals/superAdminModals/EditSuperAdminModal";
import {
  addAdmin,
  deleteAdmin,
  fetchAdmins,
  updateAdmin,
} from "@/services/api";
import { Spin } from "antd";

// Types
type SuperAdmin = {
  id: string;
  name: string;
  phone?: string;
  email: string;
  role?: string;
  status?: "active" | "inactive";
};

type SuperAdminBasic = {
  id: string;
  name: string;
  phone?: string;
  email: string;
  role?: string;
  status?: "active" | "inactive";
  password?: string;
};

// Main Component
export default function SuperAdminsList() {
  const [superAdmins, setSuperAdmins] = useState<SuperAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [editSuperAdmin, setEditSuperAdmin] = useState<SuperAdminBasic | null>(
    null
  );
  const [deleteSuperAdmin, setDeleteSuperAdmin] = useState<SuperAdmin | null>(
    null
  );
  const [isAddSuperAdminModalOpen, setIsAddSuperAdminModalOpen] =
    useState(false);

  const loadAdmins = async () => {
    try {
      const admins = await fetchAdmins();
      setSuperAdmins(admins);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleSaveEdit = async (admin: SuperAdminBasic) => {
    try {
      const { id, ...adminData } = admin;
      await updateAdmin(id, adminData);
      setSuperAdmins(superAdmins.map((t) => (t.id === admin.id ? admin : t)));
      setEditSuperAdmin(null);
    } catch (error) {
      console.error("Failed to update admin:", error);
    }
  };

  const handleDeleteSuperAdmin = async (adminId: string) => {
    try {
      await deleteAdmin(adminId);
      setSuperAdmins(superAdmins.filter((admin) => admin.id !== adminId));
      setDeleteSuperAdmin(null);
    } catch (error) {
      console.error("Failed to delete admin:", error);
    }
  };

  const handleAddNewSuperAdmin = async (admin: Omit<SuperAdminBasic, "id">) => {
    try {
      const response = await addAdmin({
        name: admin.name,
        email: admin.email,
        password: admin.password,
        phone: admin.phone,
        role: admin.role,
        status: admin.status,
      });

      const newAdmin = {
        ...admin,
        id: response.id || Math.random().toString(36).substring(2, 9),
      };

      setSuperAdmins([...superAdmins, newAdmin]);
      await loadAdmins();
      setIsAddSuperAdminModalOpen(false);
    } catch (error) {
      console.error("Failed to add admin:", error);
    }
  };

  if (loading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Super Admins</h1>
        <Dialog.Root
          open={isAddSuperAdminModalOpen}
          onOpenChange={setIsAddSuperAdminModalOpen}
        >
          <Dialog.Trigger asChild>
            <Button className="cursor-pointer">Add Super Admin</Button>
          </Dialog.Trigger>
          <AddSuperAdminModal
            isOpen={isAddSuperAdminModalOpen}
            onOpenChange={setIsAddSuperAdminModalOpen}
            onAddSuperAdmin={handleAddNewSuperAdmin}
          />
        </Dialog.Root>
      </div>

      <div className="overflow-auto h-screen">
        <div className="relative overflow-auto">
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full bg-white border border-gray-200 mb-20">
              <thead>
                <tr className="bg-[#38C16C] text-center text-xs md:text-sm font-thin text-white">
                  <th className="p-0">
                    <span className="block py-2 px-3 border-r border-gray-300">
                      Admin Name
                    </span>
                  </th>
                  <th className="p-0">
                    <span className="block py-2 px-3 border-r border-gray-300">
                      Email
                    </span>
                  </th>
                  <th className="p-0">
                    <span className="block py-2 px-3 border-r border-gray-300">
                      Role
                    </span>
                  </th>
                  <th className="p-4 text-xs md:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {superAdmins?.length > 0 ? (
                  superAdmins?.map((admin) => (
                    <tr
                      key={admin.id}
                      className="border-b border-gray-200 text-xs md:text-sm text-center text-gray-800 hover:bg-[#E9FAF1] even:bg-[#E9FAF1] odd:bg-white"
                    >
                      <td className="p-2 md:p-4">{admin.name}</td>
                      <td className="p-2 md:p-4">{admin.email}</td>
                      <td className="p-2 md:p-4">{admin.role || "N/A"}</td>
                      <td className="relative p-2 md:p-4 flex justify-center space-x-3">
                        <Dialog.Root>
                          <Dialog.Trigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Edit"
                              onClick={() => setEditSuperAdmin(admin)}
                              className="cursor-pointer text-green-500 hover:text-green-700"
                            >
                              <EditOutlined />
                            </Button>
                          </Dialog.Trigger>
                          {editSuperAdmin?.id === admin.id && (
                            <EditSuperAdminModal
                              admin={editSuperAdmin}
                              isOpen={!!editSuperAdmin}
                              onOpenChange={(open) =>
                                !open && setEditSuperAdmin(null)
                              }
                              onSave={handleSaveEdit}
                            />
                          )}
                        </Dialog.Root>

                        <Dialog.Root>
                          <Dialog.Trigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Delete"
                              onClick={() => setDeleteSuperAdmin(admin)}
                              className="cursor-pointer text-red-500 hover:text-red-700"
                            >
                              <DeleteOutlined />
                            </Button>
                          </Dialog.Trigger>
                          {deleteSuperAdmin?.id === admin.id && (
                            <Dialog.Portal>
                              <Dialog.Overlay className="fixed inset-0 bg-black/30" />
                              <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-md">
                                <Dialog.Title className="text-lg font-semibold">
                                  Confirm Deletion
                                </Dialog.Title>
                                <p className="mt-2 text-gray-600">
                                  Are you sure you want to delete{" "}
                                  <strong>{deleteSuperAdmin.name}</strong>?
                                </p>
                                <div className="mt-4 flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setDeleteSuperAdmin(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() =>
                                      handleDeleteSuperAdmin(
                                        deleteSuperAdmin.id
                                      )
                                    }
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </Dialog.Content>
                            </Dialog.Portal>
                          )}
                        </Dialog.Root>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No admins found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
