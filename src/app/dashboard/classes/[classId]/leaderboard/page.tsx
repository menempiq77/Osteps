"use client";
import React, { useState } from "react";
import {
  Table,
  Avatar,
  Tag,
  Card,
  Space,
  Typography,
  Spin,
  Button,
} from "antd";
import { CrownOutlined, TrophyOutlined, StarOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { fetchLeaderBoardData } from "@/services/leaderboardApi";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const { Title, Text } = Typography;

const LeaderBoard = () => {
  const { classId } = useParams();
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["leaderboard", classId],
    queryFn: () => fetchLeaderBoardData(classId as string),
    enabled: !!classId,
  });

  const [visibleCount, setVisibleCount] = useState(10);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
        <Text type="danger">Error: {error.message}</Text>
      </div>
    );
  }

  // Transform API data
  const studentData =
    data?.data?.map((student, index) => ({
      key: student.student_id.toString(),
      rank: index + 1,
      name: student.student_name,
      avatar: student.student_name?.charAt(0).toUpperCase() || "?",
      points: student.total_marks || 0,
      badge:
        index === 0
          ? "gold"
          : index === 1
          ? "silver"
          : index === 2
          ? "bronze"
          : null,
    })) || [];

  // Slice only visible students
  const visibleStudents = studentData.slice(0, visibleCount);

  const columns = [
    {
      title: "Rank",
      dataIndex: "rank",
      key: "rank",
      render: (rank: number) => {
        if (rank === 1)
          return <CrownOutlined style={{ color: "#FFD700", fontSize: 20 }} />;
        if (rank === 2)
          return <TrophyOutlined style={{ color: "#C0C0C0", fontSize: 20 }} />;
        if (rank === 3)
          return <StarOutlined style={{ color: "#CD7F32", fontSize: 20 }} />;
        return <Text>{rank}</Text>;
      },
      width: 80,
      align: "center" as const,
    },
    {
      title: "Student",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <Space>
          <Avatar
            style={{
              backgroundColor:
                record.badge === "gold"
                  ? "#FFD700"
                  : record.badge === "silver"
                  ? "#C0C0C0"
                  : record.badge === "bronze"
                  ? "#CD7F32"
                  : "#1890ff",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            {record.avatar}
          </Avatar>
          <Text strong>{text}</Text>
          {record.badge === "gold" && <Tag color="gold">Top</Tag>}
          {record.badge === "silver" && <Tag color="silver">Excellent</Tag>}
          {record.badge === "bronze" && <Tag color="#cd7f32">Great</Tag>}
        </Space>
      ),
      width: 250,
      ellipsis: true,
    },
    {
      title: "Points",
      dataIndex: "points",
      key: "points",
      render: (points: number) => (
        <Text strong style={{ color: "#1890ff" }}>
          {points}
        </Text>
      ),
      width: 120,
      align: "left" as const,
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 24 }}>
      <Button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft size={18} />
        Go Back
      </Button>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card>
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Title level={3} style={{ margin: 0 }}>
                Student Leaderboard
              </Title>
            </div>

            <Table
              columns={columns}
              dataSource={visibleStudents}
              pagination={false}
              rowClassName={(_, index) =>
                index % 2 === 0 ? "ant-table-row-striped" : ""
              }
              scroll={{ x: true }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text type="secondary">
                Showing {visibleStudents.length} of {studentData.length}{" "}
                students
              </Text>

              {visibleCount < studentData.length && (
                <Text
                  type="secondary"
                  style={{ cursor: "pointer", color: "#1890ff" }}
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                >
                  Load More
                </Text>
              )}
            </div>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default LeaderBoard;
