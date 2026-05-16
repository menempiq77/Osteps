"use client";
import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Modal, Form, Input, message, Spin, Button } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, GripVertical } from "lucide-react";
import {
  addCategory,
  fetchCategories,
  updateCategory,
  deleteCategory as deleteCategoryApi,
  reorderCategories,
} from "@/services/libraryApi";

type CategoryItem = {
  id: number;
  name: string;
  position?: number | null;
};

const sortCategoryItems = (items: CategoryItem[]) => {
  return [...items].sort((left, right) => {
    const leftPosition = Number(left.position ?? 0);
    const rightPosition = Number(right.position ?? 0);
    const leftHasPosition = Number.isFinite(leftPosition) && leftPosition > 0;
    const rightHasPosition = Number.isFinite(rightPosition) && rightPosition > 0;

    if (leftHasPosition !== rightHasPosition) {
      return leftHasPosition ? -1 : 1;
    }

    if (leftHasPosition && rightHasPosition && leftPosition !== rightPosition) {
      return leftPosition - rightPosition;
    }

    return left.id - right.id;
  });
};

export default function LibraryCategories() {
  const [form] = Form.useForm();
  const [data, setData] = useState<CategoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);
  const [reorderingId, setReorderingId] = useState<number | null>(null);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetchCategories();
      setData(sortCategoryItems(response));
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

  const onFinish = async (values: { name: string }) => {
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

  const editCategory = (record: CategoryItem) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setIsModalOpen(true);
  };

  const showDeleteConfirm = (id: number) => {
    setCategoryToDelete(id);
    setDeleteConfirmVisible(true);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (
      reorderingId !== null ||
      !result.destination ||
      result.destination.index === result.source.index
    ) {
      return;
    }

    const previousData = [...data];
    const reorderedData = [...data];
    const [movedItem] = reorderedData.splice(result.source.index, 1);
    reorderedData.splice(result.destination.index, 0, movedItem);

    const withPositions = reorderedData.map((item, itemIndex) => ({
      ...item,
      position: itemIndex + 1,
    }));

    setData(withPositions);
    setReorderingId(movedItem.id);

    try {
      await reorderCategories(
        withPositions.map((item) => ({
          id: item.id,
          position: item.position ?? 0,
        }))
      );
      messageApi.success("Category order updated");
    } catch (error: any) {
      setData(previousData);
      messageApi.error(
        error?.response?.data?.message || "Failed to reorder categories"
      );
    } finally {
      setReorderingId(null);
    }
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

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
        <p className="mb-4 text-sm text-gray-500">
          Hold the drag handle and move a row up or down to change the order.
        </p>

        <div className="relative overflow-auto">
          <div className="overflow-x-auto rounded-lg">
            <DragDropContext onDragEnd={(result) => void handleDragEnd(result)}>
              <Droppable droppableId="library-categories-table">
                {(provided) => (
                  <table
                    className="min-w-full bg-white border border-gray-300 mb-20"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <thead>
                      <tr className="bg-gray-50 text-center text-xs md:text-sm font-semibold text-gray-700">
                        <th className="w-14 p-0">
                          <span className="block py-2 px-3 border-r border-gray-300">
                            Move
                          </span>
                        </th>
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
                      {data.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={`library-category-${item.id}`}
                          index={index}
                          isDragDisabled={reorderingId !== null}
                        >
                          {(provided, snapshot) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`border-b border-gray-300 text-xs md:text-sm text-center text-gray-800 hover:bg-[#E9FAF1] ${snapshot.isDragging ? "bg-[#E9FAF1]" : index % 2 === 0 ? "bg-white" : "bg-[#E9FAF1]"}`}
                            >
                              <td className="p-2 md:p-4">
                                <button
                                  type="button"
                                  {...provided.dragHandleProps}
                                  className="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-40"
                                  title="Drag to reorder"
                                  disabled={reorderingId !== null}
                                >
                                  <GripVertical size={18} className="mx-auto" />
                                </button>
                              </td>
                              <td className="p-2 md:p-4">{item.id}</td>
                              <td className="p-2 md:p-4 font-medium">{item.name}</td>
                              <td className="p-2 md:p-4">
                                <div className="flex justify-center space-x-3">
                                  <button
                                    onClick={() => editCategory(item)}
                                    className="text-green-500 hover:text-green-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                                    title="Edit"
                                    disabled={reorderingId !== null}
                                  >
                                    <EditOutlined />
                                  </button>
                                  <button
                                    onClick={() => showDeleteConfirm(item.id)}
                                    className="text-red-500 hover:text-red-700 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                                    title="Delete"
                                    disabled={reorderingId !== null}
                                  >
                                    <DeleteOutlined />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  </table>
                )}
              </Droppable>
            </DragDropContext>
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