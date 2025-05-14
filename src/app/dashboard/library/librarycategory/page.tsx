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
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory as deleteCategoryApi,
} from "@/services/api";
import { ChevronLeftIcon } from "lucide-react";

export default function LibraryCategories() {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetchCategories();
      setData(response);
    } catch (error) {
      message.error("Failed to load categories");
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
        message.success("Category updated successfully");
      } else {
        await addCategory(values);
        message.success("Category added successfully");
      }
      loadCategories();
      handleCancel();
    } catch (error) {
      message.error(error.response?.data?.message || "Operation failed");
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
      message.success("Category deleted successfully");
      loadCategories();
    } catch (error) {
      message.error(
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
    <div className="p-3 md:p-6 max-w-6xl mx-auto">
      <Button
        icon={<ChevronLeftIcon size={24} className="align-middle" />}
        onClick={() => router.back()}
        className="mb-6 text-gray-700 border border-gray-300 hover:bg-gray-100 leading-none"
      >
        Back to Library
      </Button>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Library Categories</h2>
        <button
          onClick={showModal}
          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          <PlusOutlined /> Add Category
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                ID
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Category Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2 whitespace-nowrap border-b">
                  {item.id}
                </td>
                <td className="px-4 py-2 whitespace-nowrap border-b">
                  {item.name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap border-b">
                  <div className="flex gap-3">
                    <button
                      onClick={() => editCategory(item)}
                      className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    >
                      <EditOutlined />
                    </button>
                    <button
                      onClick={() => showDeleteConfirm(item.id)}
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        title={editingId ? "Edit Category" : "Add New Category"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
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
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-1 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1 bg-blue-500 text-white rounded"
            >
              {editingId ? "Update" : "Submit"}
            </button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Confirm Delete"
        open={deleteConfirmVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteConfirmVisible(false)}
        okText="Delete"
        okType="danger"
      >
        <p>
          Are you sure you want to delete this category? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
}
