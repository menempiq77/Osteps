"use client";
import React, { useEffect, useState } from "react";
import { PlusCircle, FileText, Eye, Download } from "lucide-react";
import {
  Modal,
  Input,
  Form,
  message,
  Upload,
  Select,
  Button,
  Breadcrumb,
  Spin,
} from "antd";
import { RcFile } from "antd/lib/upload";
import dayjs from "dayjs";
import Link from "next/link";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  addMaterial,
  updateMaterial,
  deleteMaterial,
  fetchMaterials,
} from "@/services/materialApi";
import { fetchAssignYears } from "@/services/yearsApi";
import { IMG_BASE_URL } from "@/lib/config";
const { Option } = Select;

type Material = {
  id: number;
  title: string;
  class_id: number;
  class_name?: string;
  file_path?: string;
  created_at?: string;
};

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  // modal & form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [form] = Form.useForm();

  const [currentUploadFile, setCurrentUploadFile] = useState<{
    file?: RcFile;
  } | null>(null);

  // Fetch Materials
  const loadMaterials = async () => {
    try {
      setLoading(true);
      const data = await fetchMaterials();
      const formatted = data?.map((m: any) => ({
        id: m?.id,
        title: m?.title,
        class_id: m?.class_id,
        class_name: m?.class?.class_name || "",
        file_path: `${IMG_BASE_URL || ""}/storage/${m?.file_path}`,
        created_at: m?.created_at,
      }));
      setMaterials(formatted);
    } catch (err: any) {
      message.error(err.message || "Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Classes
  const loadClasses = async () => {
    try {
      const res = await fetchAssignYears();
      let classesData = res
        .map((item: any) => item.classes)
        .filter((cls: any) => cls);
      classesData = Array.from(
        new Map(classesData.map((cls: any) => [cls.id, cls])).values()
      );
      setClasses(classesData);
    } catch {
      message.error("Failed to load classes");
    }
  };

  useEffect(() => {
    loadMaterials();
    loadClasses();
  }, []);

  // ---------- Add ----------
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("class_id", values.class_id);
      if (currentUploadFile?.file) {
        formData.append("file_path", currentUploadFile.file);
      }

      await addMaterial(formData);
      messageApi.success("Material added successfully!");
      setIsAddModalOpen(false);
      form.resetFields();
      setCurrentUploadFile(null);
      await loadMaterials();
    } catch (err: any) {
      messageApi.error(err.message || "Failed to add material");
    }
  };

  // ---------- Edit ----------
  const openEditModal = (material: Material) => {
    setSelectedMaterial(material);
    form.setFieldsValue({
      title: material.title,
      class_id: material.class_id,
    });

    if (material.file_path) {
      setCurrentUploadFile({
        file: {
          uid: "-1",
          name: material.file_path.split("/").pop() || "existing_file",
          status: "done",
          url: material.file_path,
        } as any,
      });
    } else {
      setCurrentUploadFile(null);
    }
    setIsEditModalOpen(true);
  };

  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedMaterial) return;

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("class_id", values.class_id);
      if (currentUploadFile?.file) {
        formData.append("file_path", currentUploadFile.file);
      }

      await updateMaterial(selectedMaterial.id, formData);
      messageApi.success("Material updated successfully!");
      setIsEditModalOpen(false);
      form.resetFields();
      setCurrentUploadFile(null);
      await loadMaterials();
    } catch (err: any) {
      messageApi.error(err.message || "Failed to update material");
    }
  };

  // ---------- Delete ----------
  const openDeleteModal = (material: Material) => {
    setSelectedMaterial(material);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedMaterial) return;
    try {
      await deleteMaterial(selectedMaterial.id);
      messageApi.success("Material deleted successfully!");
      setIsDeleteModalOpen(false);
      await loadMaterials();
    } catch (err: any) {
      messageApi.error(err.message || "Failed to delete material");
    }
  };

  // ---------- Upload Handlers ----------
  const beforeUpload = (file: RcFile) => {
    setCurrentUploadFile({ file });
    return false;
  };

  const handleRemove = () => {
    setCurrentUploadFile(null);
    return true;
  };

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
    <div className="p-3 md:p-6">
      {contextHolder}
      <Breadcrumb
        items={[
          { title: <Link href="/dashboard">Dashboard</Link> },
          { title: <span>My Materials</span> },
        ]}
        className="!mb-6"
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          📚 My Materials
        </h1>
        <button
          onClick={() => {
            form.resetFields();
            setCurrentUploadFile(null);
            setIsAddModalOpen(true);
          }}
          className="mt-3 sm:mt-0 flex items-center gap-2 cursor-pointer bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded"
        >
          <PlusCircle size={18} />
          <span>Upload New</span>
        </button>
      </div>

      <div className="bg-white shadow-md rounded p-4 md:p-6">
        {loading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : materials.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No materials uploaded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs uppercase bg-green-50 text-green-700">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Class</th>
                  <th className="px-6 py-3">Attached Material</th>
                  <th className="px-6 py-3">Uploaded On</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-800 hover:text-green-600 hover:underline flex items-center gap-2" title="View Submitted materails">
                      <FileText className="text-green-500" size={18} />
                      <Link href={`/dashboard/materials/${item.id}`}>
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{item.class_name}</td>
                    <td className="px-6 py-4">
                      {item.file_path ? (
                        <a
                          href={item.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 font-medium"
                        >
                          <Eye size={16} className="inline mr-1" />
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No file attached
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {dayjs(item.created_at).format("MMM D, YYYY")}
                    </td>
                    <td className="px-6 py-4 flex items-center justify-end gap-1">
                      {renderDownloadAnchor(item)}

                      <Button
                        type="text"
                        onClick={() => openEditModal(item)}
                        icon={<EditOutlined />}
                        className="!text-green-500 !hover:text-green-700"
                      />
                      <Button
                        type="text"
                        onClick={() => openDeleteModal(item)}
                        icon={<DeleteOutlined />}
                        className="!text-red-500 !hover:text-red-700"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD Modal */}
      <Modal
        title="Upload New Material"
        open={isAddModalOpen}
        onOk={handleAdd}
        onCancel={() => setIsAddModalOpen(false)}
        okText="Add"
        cancelText="Cancel"
        centered
        okButtonProps={{ className: "!bg-[#38C16C] text-white" }}
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
            name="class_id"
            rules={[{ required: true, message: "Please select a class" }]}
          >
            <Select placeholder="Select class">
              {classes.map((cls) => (
                <Option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Attach File">
            <Upload
              beforeUpload={beforeUpload}
              onRemove={handleRemove}
              fileList={currentUploadFile?.file ? [currentUploadFile.file] : []} // <-- Add this
              maxCount={1}
              className="!w-full !block [&>div]:!w-full"
            >
              <Button className="!w-full">Choose File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* EDIT Modal */}
      <Modal
        title="Edit Material"
        open={isEditModalOpen}
        onOk={handleEdit}
        onCancel={() => setIsEditModalOpen(false)}
        okText="Save"
        cancelText="Cancel"
        centered
        okButtonProps={{ className: "!bg-[#38C16C] text-white" }}
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
            name="class_id"
            rules={[{ required: true, message: "Please select a class" }]}
          >
            <Select placeholder="Select class">
              {classes.map((cls) => (
                <Option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Replace File">
            <Upload
              beforeUpload={beforeUpload}
              onRemove={handleRemove}
              fileList={currentUploadFile?.file ? [currentUploadFile.file] : []} // <-- same here
              maxCount={1}
              className="!w-full !block [&>div]:!w-full"
            >
              <Button className="!w-full">Choose File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* DELETE Modal */}
      <Modal
        title="Delete Material"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        <p>Are you sure you want to delete</p>
      </Modal>
    </div>
  );
}
