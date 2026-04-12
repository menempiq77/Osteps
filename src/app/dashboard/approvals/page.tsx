"use client";
import React, { useEffect, useState } from "react";
import { Tabs, Table, Tag, Button, message, Spin, Breadcrumb } from "antd";
import Link from "next/link";
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

export default function ApprovalsPage() {
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [trackerData, setTrackerData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

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
    loadQuizRequests();
    loadTrackerRequests();
  }, []);

  const renderStatusTag = (status: string) => {
    let color = "default";
    if (status === "approved") color = "green";
    else if (status === "pending") color = "gold";
    else if (status === "rejected") color = "red";
    return <Tag color={color}>{status.toUpperCase()}</Tag>;
  };

  const renderActions = (record: any, approveFn: (id: number) => void, rejectFn: (id: number) => void) => (
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

  const quizColumns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Status", dataIndex: "status", key: "status", render: renderStatusTag },
    { title: "Actions", key: "actions", render: (_: any, record: any) => renderActions(record, handleQuizApprove, handleQuizReject) },
  ];

  const trackerColumns = [
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Status", dataIndex: "status", key: "status", render: renderStatusTag },
    { title: "Actions", key: "actions", render: (_: any, record: any) => renderActions(record, handleTrackerApprove, handleTrackerReject) },
  ];

  const items = [
    {
      key: "1",
      label: "Quiz",
      children: (
        <Spin spinning={loading}>
          <Table columns={quizColumns} dataSource={quizData} pagination={false} />
        </Spin>
      ),
    },
    {
      key: "2",
      label: "Tracker",
      children: (
        <Spin spinning={loading}>
          <Table columns={trackerColumns} dataSource={trackerData} pagination={false} />
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
    </div>
  );
}
