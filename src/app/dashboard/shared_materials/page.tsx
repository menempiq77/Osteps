"use client";
import React, { useEffect, useState } from "react";
import { Table, Card, Tag, Button, Space, Breadcrumb, message, Spin } from "antd";
import { FileText, Eye, Download } from "lucide-react";
import Link from "next/link";
import dayjs from "dayjs";
import { fetchStudentMaterials } from "@/services/materialApi";
import { IMG_BASE_URL } from "@/lib/config";

export default function SharedMaterialsPage() {
  const [sharedMaterials, setSharedMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        </Space>
      ),
    },
  ];

  return (
    <div className="p-3 md:p-6">
      <Breadcrumb
        items={[
          { title: <Link href="/dashboard">Dashboard</Link> },
          { title: <span>Shared Materials</span> },
        ]}
        className="!mb-6"
      />
      <Card className="shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">📂 Shared Materials</h1>
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
    </div>
  );
}
