"use client";
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, message, Spin, Button, Breadcrumb } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { addQuize, deleteQuize, fetchQuizes, updateQuize } from "@/services/quizApi";

type Quiz = {
  id: string;
  name: string;
};
interface ShowDeleteConfirm {
  (id: string): void;
}
interface EditQuizRecord {
  id: string;
  name: string;
}
interface QuizFormValues {
  name: string;
}

export default function QuizPage() {
  const [form] = Form.useForm();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<string | null>(null);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const response = await fetchQuizes();
      setQuizzes(response);
    } catch (error) {
      messageApi.error("Failed to load quizzes");
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

  const onFinish = async (values: QuizFormValues): Promise<void> => {
    try {
      if (editingId) {
        await updateQuize(editingId, values);
        messageApi.success("Quiz updated successfully");
        setQuizzes((prev) =>
          prev.map((quiz) =>
            quiz.id === editingId ? { ...quiz, ...values } : quiz
          )
        );
      } else {
        const newQuiz = await addQuize(values);
        messageApi.success("Quiz added successfully");
        setQuizzes((prev) => [...prev, newQuiz]);
        await loadQuizzes();
      }
      handleCancel();
    } catch (error: any) {
      messageApi.error(error.response?.data?.message || "Operation failed");
    }
  };

  const editQuiz = (record: EditQuizRecord) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setIsModalOpen(true);
  };

  const showDeleteConfirm: ShowDeleteConfirm = (id) => {
    setQuizToDelete(id);
    setDeleteConfirmVisible(true);
  };

  const handleDelete = async () => {
    try {
      await deleteQuize(Number(quizToDelete));
      messageApi.success("Quiz deleted successfully");
      setQuizzes((prev) => prev.filter((quiz) => quiz.id !== quizToDelete));
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Failed to delete quiz"
      );
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
    <div className="overflow-auto p-3 md:p-6">
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <span>Quizes</span>,
          },
        ]}
        className="!mb-2"
      />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Quizzes</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showModal}
            className="flex items-center !bg-primary !border-primary hover:!bg-primary hover:!border-primary"
          >
            Add Quiz
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
                      Quiz Title
                    </span>
                  </th>
                  <th className="p-4 text-xs md:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes?.length > 0 ? (
                  quizzes.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-gray-300 text-xs md:text-sm text-center text-gray-800 hover:bg-[#E9FAF1] even:bg-[#E9FAF1] odd:bg-white"
                    >
                      <td className="p-2 md:p-4">{item.id}</td>
                      <td className="p-2 md:p-4">
                        <button
                          onClick={() => handleViewQuiz(item.id)}
                          className="text-green-600 hover:text-green-800 font-medium hover:underline cursor-pointer"
                        >
                          {item.name}
                        </button>
                      </td>
                      <td className="relative p-2 md:p-4 flex justify-center space-x-3">
                        <button
                          onClick={() => editQuiz(item)}
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
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center p-4">
                      No quizzes available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Modal
          title={editingId ? "Edit Quiz" : "Add New Quiz"}
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
              label="Quiz Title"
              name="name"
              rules={[
                { required: true, message: "Please input the quiz title!" },
              ]}
            >
              <Input />
            </Form.Item>

            <div className="flex justify-end gap-2">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                className="!bg-primary !border-primary hover:!bg-primary hover:!border-primary"
              >
                {editingId ? "Update" : "Submit"}
              </Button>
            </div>
          </Form>
        </Modal>

        <Modal
          title="Confirm Deletion"
          open={deleteConfirmVisible}
          onOk={handleDelete}
          onCancel={() => setDeleteConfirmVisible(false)}
          okText="Delete"
          okButtonProps={{ danger: true }}
          centered
        >
          <p>
            Are you sure you want to delete this quiz? This action cannot be
            undone.
          </p>
        </Modal>
      </div>
    </div>
  );
}
