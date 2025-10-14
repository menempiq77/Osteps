"use client";
import React, { useState } from "react";
import {
  PlusCircle,
  FileText,
  Eye,
  Download,
} from "lucide-react";
import {
  Modal,
  Input,
  Form,
  message,
  Upload,
  Select,
  Button,
  Breadcrumb,
} from "antd";
import { RcFile } from "antd/lib/upload";
import dayjs from "dayjs";
import Link from "next/link";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const { Option } = Select;

type Material = {
  id: number;
  title: string;
  class: string;
  date: string;
  // file_path is a blob/object url or an actual url string
  file_path?: string;
  fileName?: string;
};

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: 1,
      title: "Math Worksheet - Fractions",
      class: "Class A",
      date: "Oct 10, 2025",
      file_path: "", // no real file yet
      fileName: "",
    },
    {
      id: 2,
      title: "Science Notes - Human Body",
      class: "Class B",
      date: "Oct 9, 2025",
      file_path: "",
      fileName: "",
    },
    {
      id: 3,
      title: "English Worksheet - Grammar",
      class: "Class C",
      date: "Oct 8, 2025",
      file_path: "",
      fileName: "",
    },
  ]);

  // modal & form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [form] = Form.useForm();

  // file state for upload (temp) to show preview / store objectURL
  const [currentUploadFile, setCurrentUploadFile] = useState<{
    file?: RcFile;
    previewUrl?: string;
  } | null>(null);

  // classes options (you can replace with API later)
  const classOptions = ["Class A", "Class B", "Class C", "Class D"];

  // ---------- Add ----------
  const openAddModal = () => {
    form.resetFields();
    setCurrentUploadFile(null);
    setIsAddModalOpen(true);
  };

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      // determine file URL and name from currentUploadFile or from values
      const file_path = currentUploadFile?.previewUrl || values.file_path || "";
      const fileName = currentUploadFile?.file?.name || values.fileName || "";

      const newMaterial: Material = {
        id: materials.length ? Math.max(...materials.map((m) => m.id)) + 1 : 1,
        title: values.title,
        class: values.class,
        date: dayjs().format("MMM D, YYYY"),
        file_path,
        fileName,
      };

      setMaterials((prev) => [...prev, newMaterial]);
      setIsAddModalOpen(false);
      form.resetFields();
      setCurrentUploadFile(null);
      message.success("Material added successfully!");
    } catch (err) {
      // validation errors handled by antd form
    }
  };

  // ---------- Edit ----------
  const openEditModal = (material: Material) => {
    setSelectedMaterial(material);
    form.setFieldsValue({
      title: material.title,
      class: material.class,
      // file fields left empty; user can pick new file or leave as-is
    });
    setCurrentUploadFile(
      material.file_path
        ? { previewUrl: material.file_path, file: undefined }
        : null
    );
    setIsEditModalOpen(true);
  };

  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      const file_path =
        currentUploadFile?.previewUrl || selectedMaterial?.file_path || "";
      const fileName =
        currentUploadFile?.file?.name || selectedMaterial?.fileName || "";

      const updated = materials.map((m) =>
        m.id === selectedMaterial?.id
          ? {
              ...m,
              title: values.title,
              class: values.class,
              file_path,
              fileName,
            }
          : m
      );
      setMaterials(updated);
      setIsEditModalOpen(false);
      setSelectedMaterial(null);
      form.resetFields();
      setCurrentUploadFile(null);
      message.success("Material updated successfully!");
    } catch (err) {}
  };

  // ---------- Delete ----------
  const openDeleteModal = (material: Material) => {
    setSelectedMaterial(material);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!selectedMaterial) return;
    setMaterials((prev) => prev.filter((m) => m.id !== selectedMaterial.id));
    setIsDeleteModalOpen(false);
    message.success("Material deleted successfully!");
    setSelectedMaterial(null);
  };

  // ---------- Upload handlers ----------
  // Prevent automatic upload; create object URL for preview/download
  const beforeUpload = (file: RcFile) => {
    // create preview url
    const url = URL.createObjectURL(file);
    setCurrentUploadFile({ file, previewUrl: url });
    // set form fields (optional)
    form.setFieldsValue({ fileName: file.name });
    // return false to prevent antd from uploading automatically
    return false;
  };

  // handle manual remove from upload component
  const handleRemove = () => {
    if (currentUploadFile?.previewUrl) {
      // revoke object URL
      URL.revokeObjectURL(currentUploadFile.previewUrl);
    }
    setCurrentUploadFile(null);
    form.setFieldsValue({ fileName: undefined });
    return true;
  };

  // download helper: uses anchor download for object URLs or external URL
  const renderDownloadAnchor = (m: Material) => {
    if (!m.file_path) {
      return (
        <Button size="small" type="text" disabled title="No file attached">
          <Download size={16} />
        </Button>
      );
    }

    // fileName fallback
    const downloadName = m.fileName || "material";

    return (
      <a
        href={m.file_path}
        download={downloadName}
        target="_blank"
        rel="noreferrer noopener"
        title={`Download ${downloadName}`}
      >
        <Button size="small" type="text">
          <Download size={16} />
        </Button>
      </a>
    );
  };

  return (
    <div className="p-6 bg-gray-50">
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <span>My Materials</span>,
          },
        ]}
        className="!mb-6"
      />
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          📚 My Materials
        </h1>
        <button
          onClick={openAddModal}
          className="mt-3 sm:mt-0 flex items-center gap-2 bg-primary hover:bg-primary/80 cursor-pointer text-white px-4 py-2 rounded transition-all"
        >
          <PlusCircle size={18} />
          <span>Upload New</span>
        </button>
      </div>

      {/* Materials List */}
      <div className="bg-white shadow-md rounded p-4 md:p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs uppercase bg-green-50 text-green-700">
              <tr>
                <th scope="col" className="px-6 py-3 rounded-tl-lg">
                  Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Class
                </th>
                <th scope="col" className="px-6 py-3">
                  View Attached Material
                </th>
                <th scope="col" className="px-6 py-3">
                  Uploaded On
                </th>
                <th scope="col" className="px-6 py-3 text-right rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {materials.map((item) => (
                <tr
                  key={item.id}
                  className="border-b last:border-none hover:bg-gray-50 transition-all"
                >
                  <td className="px-6 py-4 font-medium text-gray-800 flex items-center gap-2">
                    <FileText className="text-green-500" size={18} />
                    {item.title}
                  </td>

                  <td className="px-6 py-4">{item.class}</td>

                  <td className="px-6 py-4">
                    {item.file_path ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={item.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#38C16C] hover:text-green-700 font-medium transition"
                        >
                          <Eye size={16} />
                          View
                        </a>
                        <span className="text-xs text-gray-400">
                          ({item.fileName})
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        No file attached
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-gray-500">{item.date}</td>

                  <td className="px-6 py-4 flex items-center justify-end gap-2">
                    {/* Download */}
                    {renderDownloadAnchor(item)}
                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-green-500 hover:text-green-700 cursor-pointer transition"
                      title="Edit"
                    >
                      <EditOutlined />
                    </button>
                    {/* Delete */}
                    <button
                      onClick={() => openDeleteModal(item)}
                      className="text-red-500 hover:text-red-700 cursor-pointer transition"
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

        {materials.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p>No materials uploaded yet.</p>
          </div>
        )}
      </div>

      {/* ========== ADD Modal ========== */}
      <Modal
        title="Upload New Material"
        open={isAddModalOpen}
        onOk={handleAdd}
        onCancel={() => {
          setIsAddModalOpen(false);
          setCurrentUploadFile(null);
          form.resetFields();
        }}
        okText="Add"
        cancelText="Cancel"
        centered
        okButtonProps={{
          className: "!bg-[#38C16C] hover:bg-green-600 text-white font-medium",
        }}
        cancelButtonProps={{
          className: "font-medium",
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <Input placeholder="Enter material title" />
          </Form.Item>

          <Form.Item
            label="Class"
            name="class"
            rules={[{ required: true, message: "Please select a class" }]}
          >
            <Select placeholder="Select class">
              {classOptions.map((c) => (
                <Option value={c} key={c}>
                  {c}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Attach File (optional)">
            <Upload
              beforeUpload={beforeUpload}
              onRemove={handleRemove}
              fileList={
                currentUploadFile?.file
                  ? [
                      {
                        uid: "-1",
                        name: currentUploadFile.file.name,
                        status: "done",
                        size: currentUploadFile.file.size,
                      },
                    ]
                  : []
              }
              maxCount={1}
              className="!w-full"
            >
              <Button className="!w-full">Choose File</Button>
            </Upload>

            {/* show selected file name */}
            {currentUploadFile?.previewUrl && (
              <div className="mt-2 text-sm text-gray-600">
                Selected:{" "}
                <span className="font-medium">
                  {currentUploadFile.file?.name || "file"}
                </span>
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>

      {/* ========== EDIT Modal ========== */}
      <Modal
        title="Edit Material"
        open={isEditModalOpen}
        onOk={handleEdit}
        onCancel={() => {
          setIsEditModalOpen(false);
          setSelectedMaterial(null);
          setCurrentUploadFile(null);
          form.resetFields();
        }}
        okText="Save"
        cancelText="Cancel"
        centered
        okButtonProps={{
          className: "!bg-[#38C16C] hover:bg-green-600 text-white font-medium",
        }}
        cancelButtonProps={{
          className: "font-medium",
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter the title" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Class"
            name="class"
            rules={[{ required: true, message: "Please select a class" }]}
          >
            <Select placeholder="Select class">
              {classOptions.map((c) => (
                <Option value={c} key={c}>
                  {c}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Replace File (optional)">
            <Upload
              beforeUpload={beforeUpload}
              onRemove={handleRemove}
              fileList={
                currentUploadFile?.file
                  ? [
                      {
                        uid: "-1",
                        name: currentUploadFile.file.name,
                        status: "done",
                        size: currentUploadFile.file.size,
                      },
                    ]
                  : currentUploadFile?.previewUrl
                  ? [
                      {
                        uid: "-1",
                        name:
                          currentUploadFile.previewUrl.split("/").pop() ||
                          "file",
                        status: "done",
                      },
                    ]
                  : []
              }
              maxCount={1}
              className="!w-full"
            >
              <Button className="!w-full">Choose File</Button>
            </Upload>

            {currentUploadFile?.previewUrl && (
              <div className="mt-2 text-sm text-gray-600">
                Attached:{" "}
                <span className="font-medium">
                  {currentUploadFile.file?.name ||
                    selectedMaterial?.fileName ||
                    "file"}
                </span>
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>

      {/* ========== DELETE Confirmation ========== */}
      <Modal
        title="Delete Material"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setSelectedMaterial(null);
        }}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        <p>
          Are you sure you want to delete{" "}
          <span className="font-semibold">{selectedMaterial?.title}</span>?
        </p>
      </Modal>
    </div>
  );
}
