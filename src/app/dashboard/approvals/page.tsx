"use client";
import React, { useEffect, useState } from "react";
import { Tabs, Table, Tag, Button, message, Spin, Breadcrumb, Modal } from "antd";
import Link from "next/link";
import {
  fetchLibraryRequests,
  approveLibraryRequest,
  rejectLibraryRequest,
} from "@/services/libraryApi";
import {
  approveQuizRequest,
  fetchQuizRequests,
  rejectQuizRequest,
} from "@/services/quizApi";
import {
  approveTrackerRequest,
  fetchTrackerRequests,
  rejectTrackerRequest,
} from "@/services/trackersApi";
import { IMG_BASE_URL } from "@/lib/config";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function ApprovalsPage() {
  const [loading, setLoading] = useState(false);
  const [libraryData, setLibraryData] = useState([]);
  const [quizData, setQuizData] = useState([]);
  const [trackerData, setTrackerData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewType, setPreviewType] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const hasAccess = currentUser?.role === "SCHOOL_ADMIN"

  // --- Load Library Requests ---
  const loadLibraryRequests = async () => {
    try {
      setLoading(true);
      const data = await fetchLibraryRequests();
      const formatted = data.map((item) => ({
        key: item.id,
        id: item.id,
        title: item.title,
        description: item.description,
        file_path: `${IMG_BASE_URL}/storage/${item.file_path}`,
        date: new Date(item.created_at).toLocaleDateString(),
        status: item.status,
      }));
      setLibraryData(formatted);
    } catch (error) {
      console.error("Error fetching library requests:", error);
      message.error("Failed to fetch library requests");
    } finally {
      setLoading(false);
    }
  };

  // --- Load Quiz Requests ---
  const loadQuizRequests = async () => {
    try {
      setLoading(true);
      const data = await fetchQuizRequests();
      const formatted = data.map((item) => ({
        key: item.id,
        id: item.id,
        title: item.name,
        date: new Date(item.created_at).toLocaleDateString(),
        status: item.status,
      }));
      setQuizData(formatted);
    } catch (error) {
      console.error("Error fetching quiz requests:", error);
      message.error("Failed to fetch quiz requests");
    } finally {
      setLoading(false);
    }
  };

  // --- Load Tracker Requests ---
  const loadTrackerRequests = async () => {
    try {
      setLoading(true);
      const data = await fetchTrackerRequests();
      const formatted = data.map((item) => ({
        key: item.id,
        id: item.id,
        title: item.name,
        date: new Date(item.created_at).toLocaleDateString(),
        status: item.status,
      }));
      setTrackerData(formatted);
    } catch (error) {
      console.error("Error fetching tracker requests:", error);
      message.error("Failed to fetch tracker requests");
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers for Library ---
  const handleLibraryApprove = async (id: number) => {
    try {
      await approveLibraryRequest(id);
      messageApi.success("Library request approved successfully!");
      loadLibraryRequests();
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to approve request");
    }
  };

  const handleLibraryReject = async (id: number) => {
    try {
      await rejectLibraryRequest(id);
      messageApi.success("Library request rejected successfully!");
      loadLibraryRequests();
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to reject request");
    }
  };

  // --- Handlers for Quiz ---
  const handleQuizApprove = async (id: number) => {
    try {
      await approveQuizRequest(id);
      messageApi.success("Quiz approved successfully!");
      loadQuizRequests();
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to approve quiz");
    }
  };

  const handleQuizReject = async (id: number) => {
    try {
      await rejectQuizRequest(id);
      messageApi.success("Quiz rejected successfully!");
      loadQuizRequests();
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to reject quiz");
    }
  };

  // --- Handlers for Tracker ---
  const handleTrackerApprove = async (id: number) => {
    try {
      await approveTrackerRequest(id);
      messageApi.success("Tracker approved successfully!");
      loadTrackerRequests();
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to approve tracker");
    }
  };

  const handleTrackerReject = async (id: number) => {
    try {
      await rejectTrackerRequest(id);
      messageApi.success("Tracker rejected successfully!");
      loadTrackerRequests();
    } catch (error) {
      console.error(error);
      messageApi.error("Failed to reject tracker");
    }
  };

  useEffect(() => {
    loadLibraryRequests();
    loadQuizRequests();
    loadTrackerRequests();
  }, []);

  // --- Shared Status Tag Renderer ---
  const renderStatusTag = (status: string) => {
    let color = "default";
    if (status === "approved") color = "green";
    else if (status === "pending") color = "gold";
    else if (status === "rejected") color = "red";
    return <Tag color={color}>{status.toUpperCase()}</Tag>;
  };

  // --- Shared Action Buttons ---
  const renderActions = (record, approveFn, rejectFn) => (
    <div className="flex gap-2">
      <Button
        type="primary"
        size="small"
        disabled={record.status === "approved"}
        onClick={() => approveFn(record.id)}
      >
        Approve
      </Button>
      <Button
        danger
        size="small"
        disabled={record.status === "rejected"}
        onClick={() => rejectFn(record.id)}
      >
        Reject
      </Button>
    </div>
  );

  const handleFilePreview = (filePath: string) => {
    if (!filePath) return;

    const lowerPath = filePath.toLowerCase();

    if (
      lowerPath.endsWith(".jpg") ||
      lowerPath.endsWith(".jpeg") ||
      lowerPath.endsWith(".png") ||
      lowerPath.endsWith(".gif")
    ) {
      setPreviewType("image");
      setPreviewUrl(filePath);
      setPreviewVisible(true);
    } else if (
      lowerPath.endsWith(".mp4") ||
      lowerPath.endsWith(".webm") ||
      lowerPath.endsWith(".mov")
    ) {
      setPreviewType("video");
      setPreviewUrl(filePath);
      setPreviewVisible(true);
    } else if (
      lowerPath.endsWith(".mp3") ||
      lowerPath.endsWith(".wav") ||
      lowerPath.endsWith(".ogg")
    ) {
      setPreviewType("audio");
      setPreviewUrl(filePath);
      setPreviewVisible(true);
    } else if (lowerPath.endsWith(".pdf")) {
      window.open(filePath, "_blank");
    } else {
      // For unknown file types, download directly
      const link = document.createElement("a");
      link.href = filePath;
      link.download = filePath.split("/").pop() || "file";
      link.click();
    }
  };

  // --- Table Columns ---
  const libraryColumns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "File",
      dataIndex: "file_path",
      key: "file_path",
      render: (file_path) =>
        file_path ? (
          <Button type="link" onClick={() => handleFilePreview(file_path)}>
            View File
          </Button>
        ) : (
          "-"
        ),
    },

    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: renderStatusTag,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        renderActions(record, handleLibraryApprove, handleLibraryReject),
    },
  ];

  const quizColumns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: renderStatusTag,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        renderActions(record, handleQuizApprove, handleQuizReject),
    },
  ];

  const trackerColumns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: renderStatusTag,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) =>
        renderActions(record, handleTrackerApprove, handleTrackerReject),
    },
  ];

  const items = [
    ...(hasAccess
    ? [
        {
          key: "1",
          label: "Library",
          children: (
            <Spin spinning={loading}>
              <Table
                columns={libraryColumns}
                dataSource={libraryData}
                pagination={false}
              />
            </Spin>
          ),
        },
      ]
    : []),
    {
      key: "2",
      label: "Quiz",
      children: (
        <Spin spinning={loading}>
          <Table
            columns={quizColumns}
            dataSource={quizData}
            pagination={false}
          />
        </Spin>
      ),
    },
    {
      key: "3",
      label: "Tracker",
      children: (
        <Spin spinning={loading}>
          <Table
            columns={trackerColumns}
            dataSource={trackerData}
            pagination={false}
          />
        </Spin>
      ),
    },
  ];

  return (
    <div className="p-3 md:p-6">
      {contextHolder}
      <Breadcrumb
        items={[
          { title: <Link href="/dashboard">Dashboard</Link> },
          { title: <span>Content Approvals</span> },
        ]}
        className="!mb-6"
      />
      <div className="p-6 bg-white rounded shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Content Approvals</h1>
        <Tabs defaultActiveKey="1" items={items} />
      </div>

      <Modal
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={700}
      >
        {previewType === "image" && (
          <img src={previewUrl} alt="Preview" className="w-full rounded" />
        )}
        {previewType === "video" && (
          <video controls className="w-full rounded">
            <source src={previewUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {previewType === "audio" && (
          <audio controls className="w-full my-4">
            <source src={previewUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </Modal>
      
    </div>
  );
}
