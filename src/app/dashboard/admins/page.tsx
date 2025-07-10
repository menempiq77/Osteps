"use client";
import { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { AddSuperAdminModal } from "@/components/modals/superAdminModals/AddSuperAdminModal";
import { EditSuperAdminModal } from "@/components/modals/superAdminModals/EditSuperAdminModal";
import { Button, Spin, Modal, message } from "antd";
import {
  addAdmin,
  deleteAdmin,
  fetchAdmins,
  updateAdmin,
} from "@/services/adminsApi";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

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
      messageApi?.success("Admin Update Successfully!")
    } catch (error) {
      console.error("Failed to update admin:", error);
      messageApi?.error("Failed to Update Successfully!")
    }
  };

  const handleDeleteSuperAdmin = async (adminId: string) => {
    try {
      await deleteAdmin(adminId);
      setSuperAdmins(superAdmins.filter((admin) => admin.id !== adminId));
      setDeleteSuperAdmin(null);
      setIsDeleteModalOpen(false);
      messageApi?.success("Admin Deleted Successfully!")
    } catch (error) {
      console.error("Failed to delete admin:", error);
      messageApi?.error("Failed to delete Successfully!")
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
      messageApi?.success("Admin Added Successfully!")
    } catch (error) {
      console.error("Failed to add admin:", error);
      messageApi?.error("Failed to add Successfully!")
    }
  };

  if (loading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto">
      {contextHolder}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sub Admins</h1>
        <Button
          type="primary"
          className="!bg-primary !text-white !border-none"
          onClick={() => setIsAddSuperAdminModalOpen(true)}
        >
          Add Sub Admin
        </Button>
      </div>

      <div className="relative overflow-auto">
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 mb-20">
            <thead>
              <tr className="bg-primary text-center text-xs md:text-sm font-thin text-white">
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
                      <Button
                        title="Edit"
                        onClick={() => setEditSuperAdmin(admin)}
                        className="!text-green-500 hover:!text-green-700 !border-none !shadow-none "
                        icon={<EditOutlined />}
                      />

                      <Button
                        title="Delete"
                        onClick={() => {
                          setDeleteSuperAdmin(admin);
                          setIsDeleteModalOpen(true);
                        }}
                        className="!text-red-500 hover:!text-red-700 !border-none !shadow-none "
                        icon={<DeleteOutlined />}
                      />
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

      <AddSuperAdminModal
        isOpen={isAddSuperAdminModalOpen}
        onOpenChange={setIsAddSuperAdminModalOpen}
        onAddSuperAdmin={handleAddNewSuperAdmin}
      />

      {editSuperAdmin && (
        <EditSuperAdminModal
          admin={editSuperAdmin}
          isOpen={!!editSuperAdmin}
          onOpenChange={(open) => !open && setEditSuperAdmin(null)}
          onSave={handleSaveEdit}
        />
      )}

      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onOk={() =>
          deleteSuperAdmin && handleDeleteSuperAdmin(deleteSuperAdmin.id)
        }
        onCancel={() => {
          setDeleteSuperAdmin(null);
          setIsDeleteModalOpen(false);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete{" "}
          <strong>{deleteSuperAdmin?.name}</strong>?
        </p>
      </Modal>
    </div>
  );
}
