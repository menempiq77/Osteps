"use client";

import { useEffect, useState } from "react";
import { Alert, Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  fetchAssessmentDocumentExamIncidents,
  type AssessmentDocumentExamIncident,
} from "@/services/documentAssessmentApi";

const contextLabel: Record<AssessmentDocumentExamIncident["context"], string> = {
  fullscreen: "Left fullscreen",
  screen: "Switched screen",
  leave: "Tried to leave page",
};

const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return value;
  return date.toLocaleString();
};

const columns: ColumnsType<AssessmentDocumentExamIncident> = [
  {
    title: "Date & Time",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 220,
    render: (value: string) => formatDateTime(value),
  },
  {
    title: "Assessment",
    dataIndex: "title",
    key: "title",
    width: 220,
    render: (value: string) => value || "PDF Assessment",
  },
  {
    title: "Type",
    dataIndex: "context",
    key: "context",
    width: 160,
    render: (value: AssessmentDocumentExamIncident["context"]) => (
      <Tag color={value === "leave" ? "volcano" : value === "screen" ? "gold" : "orange"}>
        {contextLabel[value]}
      </Tag>
    ),
  },
  {
    title: "Reason",
    dataIndex: "reason",
    key: "reason",
    render: (value: string) => value || "No reason provided",
  },
];

type ExamIncidentHistoryCardProps = {
  studentId: string | number;
  title?: string;
};

export default function ExamIncidentHistoryCard({
  studentId,
  title = "Exam Exit History",
}: ExamIncidentHistoryCardProps) {
  const [incidents, setIncidents] = useState<AssessmentDocumentExamIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadIncidents = async () => {
      if (!studentId) {
        setIncidents([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const nextIncidents = await fetchAssessmentDocumentExamIncidents({ studentId });
        if (!cancelled) {
          setIncidents(nextIncidents);
        }
      } catch (nextError) {
        if (!cancelled) {
          console.error("Failed to load exam incidents:", nextError);
          setError("Could not load saved exam exit records.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadIncidents();

    return () => {
      cancelled = true;
    };
  }, [studentId]);

  if (loading) {
    return (
      <Card title={title} className="rounded-2xl">
        <div className="text-sm text-gray-500">Loading exam exit records...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert
        type="warning"
        showIcon
        message="Exam exit history unavailable"
        description={error}
      />
    );
  }

  if (incidents.length === 0) {
    return null;
  }

  return (
    <Card title={title} className="rounded-2xl">
      <Table
        rowKey="id"
        dataSource={incidents}
        columns={columns}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 900 }}
      />
    </Card>
  );
}