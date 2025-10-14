"use client";
import React, { useState } from "react";
import { Table, Card, Tag, Button, Space, Breadcrumb } from "antd";
import { FileText, Eye, Download } from "lucide-react";
import Link from "next/link";

export default function SharedMaterialsPage() {
  const [sharedMaterials] = useState([
    {
      id: 1,
      title: "Math Worksheet - Fractions",
      teacher: "Mr. Ahmed",
      class: "Class A",
      date: "Oct 10, 2025",
      file_path: "#",
    },
    {
      id: 2,
      title: "Science Notes - Human Body",
      teacher: "Ms. Sara",
      class: "Class B",
      date: "Oct 9, 2025",
      file_path: "#",
    },
    {
      id: 3,
      title: "English Worksheet - Grammar",
      teacher: "Mr. John",
      class: "Class C",
      date: "Oct 8, 2025",
      file_path: "#",
    }
  ]);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => (
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
      render: (text) => <span className="text-gray-700">{text}</span>,
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
      render: (text) => <Tag color="green">{text}</Tag>,
    },
    {
      title: "View Material",
      key: "file_path",
      render: (_, record) => (
        <a
          href={record.file_path}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#38C16C] hover:text-green-700 font-medium flex items-center gap-1"
        >
          <Eye size={16} />
          View
        </a>
      ),
    },
    {
      title: "Uploaded On",
      dataIndex: "date",
      key: "date",
      render: (text) => <span className="text-gray-500">{text}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<Download size={18} className="text-green-600" />}
            onClick={() => {
              // download logic
              window.open(record.file_path, "_blank");
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-3 md:p-6">
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <span>Shared Materials</span>,
          },
        ]}
        className="!mb-6"
      />
      <Card className="shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            📂 Shared Materials
          </h1>
        </div>

        <Table
          columns={columns}
          dataSource={sharedMaterials}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />

        {sharedMaterials.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            <p>No materials have been shared yet.</p>
          </div>
        )}
      </Card>
    </div>
  );
}
