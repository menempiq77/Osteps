"use client";
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, message, Spin, Button } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  fetchQuizes,
  addQuize,
  updateQuize,
  deleteQuize,
} from "@/services/api";

export default function QuizPage() {
  const [form] = Form.useForm();
  const [quizzes, setQuizzes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const response = await fetchQuizes();
      setQuizzes(response);
    } catch (error) {
      message.error("Failed to load quizzes");
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
        await updateQuize(editingId, values);
        message.success("Quiz updated successfully");
      } else {
        await addQuize(values);
        message.success("Quiz added successfully");
      }
      loadQuizzes();
      handleCancel();
    } catch (error) {
      message.error(error.response?.data?.message || "Operation failed");
    }
  };

  const editQuiz = (record) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setIsModalOpen(true);
  };

  const showDeleteConfirm = (id) => {
    setQuizToDelete(id);
    setDeleteConfirmVisible(true);
  };

  const handleDelete = async () => {
    try {
      await deleteQuize(quizToDelete);
      message.success("Quiz deleted successfully");
      loadQuizzes();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to delete quiz");
    } finally {
      setDeleteConfirmVisible(false);
    }
  };

  const handleViewQuiz = (quizId: string) => {
    router.push(`/dashboard/quiz/${quizId}`);
  };

  if (loading) {
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6 max-w-6xl mx-auto">
      <Button
        icon={<ChevronLeftIcon size={24} className="align-middle" />}
        onClick={() => router.back()}
        className="mb-6 text-gray-700 border border-gray-300 hover:bg-gray-100 leading-none"
      >
        Back to Dashboard
      </Button>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Quizzes</h2>
        <button
          onClick={showModal}
          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
        >
          <PlusOutlined /> Add Quiz
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
                Quiz Title
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quizzes.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-2 whitespace-nowrap border-b">
                  {item.id}
                </td>
                <td className="px-4 py-2 whitespace-nowrap border-b">
                  <button
                    onClick={() => handleViewQuiz(item.id)}
                    className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    {item.name}
                  </button>
                </td>
                <td className="px-4 py-2 whitespace-nowrap border-b">
                  <div className="flex gap-3">
                    <button
                      onClick={() => editQuiz(item)}
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
        title={editingId ? "Edit Quiz" : "Add New Quiz"}
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
            label="Quiz Title"
            name="name"
            rules={[
              { required: true, message: "Please input the quiz title!" },
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
        title={
          <>
            <ExclamationCircleFilled style={{ color: "#ff4d4f", marginRight: 8 }} />
            Confirm Delete
          </>
        }
        open={deleteConfirmVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteConfirmVisible(false)}
        okText="Delete"
        okType="danger"
      >
        <p>
          Are you sure you want to delete this quiz? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
}