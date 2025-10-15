"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  Avatar,
  Tag,
  Card,
  Space,
  Typography,
  Spin,
  Button,
  Select,
  Breadcrumb,
} from "antd";
import { CrownOutlined, TrophyOutlined, StarOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { fetchLeaderBoardData } from "@/services/leaderboardApi";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchClasses } from "@/services/classesApi";
import { fetchAssignYears, fetchYearsBySchool } from "@/services/yearsApi";
import Link from "next/link";

const { Title, Text } = Typography;

interface CurrentUser {
  student?: string;
  avatar?: string;
  name?: string;
  class?: string;
  role?: string;
  school?: string;
}

const LeaderBoard = () => {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.auth) as {
    currentUser: CurrentUser;
  };
  const isTeacher = currentUser?.role === "TEACHER";
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const schoolId = currentUser?.school;

  /** Load years */
  const loadYears = async () => {
    try {
      setLoading(true);
      let yearsData: any[] = [];

      if (isTeacher) {
        const res = await fetchAssignYears();
        const years = res
          .map((item: any) => item?.classes?.year)
          .filter((year: any) => year);
        yearsData = Array.from(
          new Map(years?.map((year: any) => [year.id, year])).values()
        );
      } else {
        const res = await fetchYearsBySchool(schoolId);
        yearsData = res;
      }
      setYears(yearsData);
      if (yearsData.length > 0) {
        setSelectedYear(yearsData[0].id.toString());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadYears();
  }, []);

  /** Fetch classes for selected year */
  const { data: classes = [], isLoading: classesLoading } = useQuery({
    queryKey: ["classes", selectedYear, isTeacher],
    queryFn: async () => {
      if (!selectedYear) return [];
      if (isTeacher) {
        const res = await fetchAssignYears();
        let classesData = res
          .map((item: any) => item.classes)
          .filter((cls: any) => cls);
        classesData = Array.from(
          new Map(classesData.map((cls: any) => [cls.id, cls])).values()
        );
        return classesData.filter(
          (cls: any) => cls.year_id === Number(selectedYear)
        );
      } else {
        return await fetchClasses(Number(selectedYear));
      }
    },
    enabled: !!selectedYear,
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["leaderboard", selectedClass],
    queryFn: () => fetchLeaderBoardData(selectedClass as string),
    enabled: !!selectedClass,
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
     <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <span>Leaderboard</span>,
          },
        ]}
        className="!mb-6"
      />

      <Card className="p-4 !mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Year Select */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 mb-1">
                Year
              </label>
              <Select
                value={selectedYear || undefined}
                onChange={(value) => {
                  setSelectedYear(value);
                  setSelectedClass(null); // reset class when year changes
                }}
                className="w-full"
                placeholder="Select Year"
              >
                {years?.map((year) => (
                  <Select.Option key={year.id} value={year.id.toString()}>
                    {year.name}
                  </Select.Option>
                ))}
              </Select>
            </div>

            {/* Class Select */}
            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-500 mb-1">
                Class
              </label>
              <Select
                value={selectedClass || undefined}
                onChange={(value) => setSelectedClass(value)}
                className="w-full"
                placeholder="Select Class"
                loading={classesLoading}
                disabled={!selectedYear}
              >
                {classes?.map((cls) => (
                  <Select.Option key={cls.id} value={cls.id.toString()}>
                    {cls.class_name}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
      </Card>

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
