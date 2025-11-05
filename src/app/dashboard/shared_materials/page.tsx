"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Breadcrumb,
  message,
  Spin,
  Form,
  Modal,
  Input,
  Upload,
} from "antd";
import { FileText, Eye, Download, UploadCloud } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import { fetchStudentMaterials, uploadMaterial } from "@/services/materialApi";
import { IMG_BASE_URL } from "@/lib/config";

export default function SharedMaterialsPage() {
  const [sharedMaterials, setSharedMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [messageApi, contextHolder] = message.useMessage();

  // Fetch shared materials
  const loadSharedMaterials = async () => {
    try {
      setLoading(true);
      const data = await fetchStudentMaterials();

      const formatted = data?.map((m: any) => ({
        id: m?.id,
        title: m?.title,
        teacher: m?.teacher?.teacher_name || "Unknown",
        class: m?.classes?.class_name || "N/A",
        date: dayjs(m?.created_at).format("MMM D, YYYY"),
        file_path: `${IMG_BASE_URL || ""}/storage/${m?.file_path}`,
      }));

      setSharedMaterials(formatted);
    } catch (err: any) {
      message.error(err.message || "Failed to load shared materials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSharedMaterials();
  }, []);

  const openUploadModal = (record: any) => {
    setSelectedMaterial(record);
    form.resetFields();
    setUploadModalOpen(true);
  };

 const handleUploadSubmit = async () => {
  try {
    const values = await form.validateFields();
    const fileObj = values.file?.[0]?.originFileObj;

    const formData = new FormData();
    formData.append("material_id", selectedMaterial.id);
    formData.append("text", values.notes || "");
    if (fileObj) formData.append("file_path", fileObj);

    await uploadMaterial(formData);

    messageApi.success("Material uploaded successfully!");
    setUploadModalOpen(false);
  } catch (err) {
    console.log(err);
  }
};


  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-green-500" />
          <span className="font-medium text-gray-800">{text}</span>
        </div>
      ),
    },
    {
      title: "Teacher",
      dataIndex: "teacher",
      key: "teacher",
      render: (text: string) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: "View Material",
      key: "file_path",
      render: (_: any, record: any) =>
        record.file_path ? (
          <a
            href={record.file_path}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#38C16C] hover:text-green-700 font-medium flex items-center gap-1"
          >
            <Eye size={16} />
            View
          </a>
        ) : (
          <span className="text-gray-400">No file</span>
        ),
    },
    {
      title: "Uploaded On",
      dataIndex: "date",
      key: "date",
      render: (text: string) => <span className="text-gray-500">{text}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          {record.file_path ? (
            <Button
              type="text"
              icon={<Download size={18} className="text-green-600" />}
              onClick={() => window.open(record.file_path, "_blank")}
            />
          ) : (
            <Button type="text" disabled>
              <Download size={18} />
            </Button>
          )}
          <Button
            type="text"
            icon={<UploadCloud size={18} className="text-blue-600" />}
            onClick={() => openUploadModal(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-3 md:p-6">
      {contextHolder}
      <Breadcrumb
        items={[
          { title: <Link href="/dashboard">Dashboard</Link> },
          { title: <span>Shared Materials</span> },
        ]}
        className="!mb-6"
      />
      <Card className="shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            📂 Shared Materials
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Spin size="large" />
          </div>
        ) : sharedMaterials.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No materials have been shared yet.</p>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={sharedMaterials}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        )}
      </Card>

      {/* Upload Modal */}
      <Modal
        title="Upload File"
        open={uploadModalOpen}
        onCancel={() => setUploadModalOpen(false)}
        centered
        footer={
          <div className="flex justify-end gap-3">
            <Button
              onClick={() => setUploadModalOpen(false)}
              className="!border-gray-400 !text-gray-600 hover:!border-gray-500 hover:!text-gray-700"
            >
              Cancel
            </Button>

            <Button
              type="primary"
              onClick={handleUploadSubmit}
              className="!bg-primary hover:!bg-primary/80 !text-white !px-5 !py-2 rounded-md shadow-md"
            >
              Submit
            </Button>
          </div>
        }
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="notes"
            label="Notes"
            rules={[{ required: false, message: "Please enter notes" }]}
          >
            <Input.TextArea rows={4} placeholder="Write notes here..." />
          </Form.Item>

          <Form.Item
            name="file"
            label="Upload File"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
            rules={[{ required: false, message: "Please upload a file" }]}
          >
            <Upload className="!block !w-full" beforeUpload={() => false} maxCount={1}>
              <Button className="!w-full">Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
