"use client";
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, message, Spin, Button } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";
import { addCategory, fetchCategories, updateCategory, deleteCategory as deleteCategoryApi, } from "@/services/libraryApi";

export default function LibraryCategories() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetchCategories();
      setData(response);
    } catch (error) {
      messageApi.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingId(null);
  };

  const onFinish = async (values) => {
    try {
      if (editingId) {
        await updateCategory(editingId, values);
        messageApi.success("Category updated successfully");
      } else {
        await addCategory(values);
        messageApi.success("Category added successfully");
      }
      loadCategories();
      handleCancel();
    } catch (error) {
      messageApi.error(error.response?.data?.message || "Operation failed");
    }
  };

  const editCategory = (record) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setIsModalOpen(true);
  };

  const showDeleteConfirm = (id) => {
    setCategoryToDelete(id);
    setDeleteConfirmVisible(true);
  };

  const handleDelete = async () => {
    try {
      await deleteCategoryApi(categoryToDelete);
      messageApi.success("Category deleted successfully");
      loadCategories();
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Failed to delete category"
      );
    } finally {
      setDeleteConfirmVisible(false);
    }
  };

  if (loading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="p-3 md:p-6">
      {contextHolder}
      <div className="max-w-7xl mx-auto">
        <Button
          icon={<ChevronLeftIcon size={24} className="align-middle" />}
          onClick={() => router.back()}
          className="mb-6 text-gray-700 border border-gray-300 hover:bg-gray-100 leading-none"
        >
          Back to Library
        </Button>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Library Categories</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
            className="flex items-center !bg-primary !border-primary hover:!bg-primary hover:!border-primary"
          >
            Add Category
          </Button>
        </div>

        <div className="relative overflow-auto">
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full bg-white border border-gray-300 mb-20">
              <thead>
                <tr className="bg-primary text-center text-xs md:text-sm font-thin text-white">
                  <th className="p-0">
                    <span className="block py-2 px-3 border-r border-gray-300">
                      ID
                    </span>
                  </th>
                  <th className="p-0">
                    <span className="block py-2 px-3 border-r border-gray-300">
                      Category Name
                    </span>
                  </th>
                  <th className="p-4 text-xs md:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-300 text-xs md:text-sm text-center text-gray-800 hover:bg-[#E9FAF1] even:bg-[#E9FAF1] odd:bg-white"
                  >
                    <td className="p-2 md:p-4">{item.id}</td>
                    <td className="p-2 md:p-4 font-medium">{item.name}</td>
                    <td className="relative p-2 md:p-4 flex justify-center space-x-3">
                      <button
                        onClick={() => editCategory(item)}
                        className="text-green-500 hover:text-green-700 cursor-pointer"
                        title="Edit"
                      >
                        <EditOutlined />
                      </button>
                      <button
                        onClick={() => showDeleteConfirm(item.id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        title="Delete"
                      >
                        <DeleteOutlined />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Modal
          title={editingId ? "Edit Category" : "Add New Category"}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          destroyOnHidden
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Category Name"
              name="name"
              rules={[
                { required: true, message: "Please input the category name!" },
              ]}
            >
              <Input />
            </Form.Item>

            <div className="flex justify-end gap-2">
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" className="!bg-primary !border-primary hover:!bg-primary hover:!border-primary">
                {editingId ? "Update" : "Submit"}
              </Button>
            </div>
          </Form>
        </Modal>

        <Modal
          title="Confirm Delettion"
          open={deleteConfirmVisible}
          onOk={handleDelete}
          onCancel={() => setDeleteConfirmVisible(false)}
          okText="Delete"
           okButtonProps={{ danger: true }}
          centered
        >
          <p>
            Are you sure you want to delete this category? This action cannot be
            undone.
          </p>
        </Modal>
      </div>
    </div>
  );
}