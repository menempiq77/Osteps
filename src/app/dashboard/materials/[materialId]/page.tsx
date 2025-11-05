"use client";

import React, { useEffect, useState } from "react";
import { Card, Table, Spin, message, Breadcrumb, Input } from "antd";
import { Eye } from "lucide-react";
import { fetchStudentSubmiitedMaterials } from "@/services/materialApi";
import { IMG_BASE_URL } from "@/lib/config";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Page() {
  const { materialId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [material, setMaterial] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);

      const data = await fetchStudentSubmiitedMaterials(materialId);

      setMaterial(data.material);
      setSubmissions(
        data.student_submissions?.map((s: any) => ({
          ...s,
          file_url: `${IMG_BASE_URL}/storage/${s.file_path}`,
        })) || []
      );
    } catch (err: any) {
      message.error(err.message || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter((item) =>
    item.student_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Student Name",
      dataIndex: "student_name",
      key: "student_name",
    },
    {
      title: "Text",
      dataIndex: "text",
      key: "text",
      width: 550,
      render: (text: string) => (
        <span className="text-gray-700">{text || "No Notes"}</span>
      ),
    },
    {
      title: "Submitted On",
      dataIndex: "submitted_at",
      key: "submitted_at",
      render: (date: string) => (
        <span className="text-gray-500">{new Date(date).toLocaleString()}</span>
      ),
    },
    {
      title: "View File",
      key: "file",
      render: (_: any, record: any) =>
        record.file_url ? (
          <a
            href={record.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 flex items-center gap-1"
          >
            <Eye size={16} /> View
          </a>
        ) : (
          <span className="text-gray-400">No File</span>
        ),
    },
  ];

  return (
    <div className="p-3 md:p-6">
      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Breadcrumb
            items={[
              { title: <Link href="/dashboard">Dashboard</Link> },
              { title: <Link href="/dashboard/materials">Materials</Link> },
              { title: <span>Submissions</span> },
            ]}
            className="!mb-6"
          />

          {/* Material Info Card */}
          <Card className="!mb-6 shadow-md">
            <div className="flex justify-between">
              <h2 className="text-xl font-bold mb-2">{material?.title}</h2>
              <p className="text-gray-600 mb-2">
                <strong>Class: </strong>
                {material?.class_name}
              </p>
            </div>
            {/* <a
              href={`${IMG_BASE_URL}/storage/${material?.file_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <Eye size={16} /> View Original Material
            </a> */}
          </Card>

          {/* Students Submissions List */}
          <Card className="shadow-md">
            <div className="flex justify-between">
              <h3 className="text-lg font-semibold mb-4">
                🎓 Student Submissions
              </h3>

              <Input
                placeholder="Search by student name..."
                className="!mb-4 max-w-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Table
              columns={columns}
              dataSource={filteredSubmissions}
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          </Card>
        </>
      )}
    </div>
  );
}
