"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Descriptions,
  Tag,
  Table,
  Collapse,
  Spin,
  Alert,
  Row,
  Col,
  Statistic,
  Progress,
  Timeline,
  Avatar,
  Divider,
} from "antd";
import {
  UserOutlined,
  BankOutlined,
  BookOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  SmileOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  TrophyOutlined,
  BarChartOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { fetchStudentProfileData } from "@/services/studentsApi";

export default function StudentProfilePage() {
  const { studentId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["student-profile", studentId],
    queryFn: () => fetchStudentProfileData(studentId),
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-80">
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <div className="p-4">
        <Alert message="Failed to load student profile" type="error" />
      </div>
    );

  const student = data;

  // Calculate some stats for the dashboard
  const completedTasks =
    student?.class?.term
      ?.flatMap((term: any) =>
        term.assign_assessments?.flatMap((assignment: any) =>
          assignment.assessment.tasks?.filter(
            (task: any) =>
              task.student_assessment_tasks?.[0]?.status === "completed"
          )
        )
      )
      .flat().length || 0;

  const totalTasks =
    student?.class?.term
      ?.flatMap((term: any) =>
        term.assign_assessments?.flatMap(
          (assignment: any) => assignment.assessment.tasks
        )
      )
      .flat().length || 0;

  const totalPoints =
    student?.behaviour?.reduce(
      (sum: number, record: any) => sum + (record.behaviour?.points || 0),
      0
    ) || 0;

  const positiveBehaviours =
    student?.behaviour?.filter((record: any) => record.behaviour?.points > 0)
      .length || 0;

  return (
    <div className="p-3 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Section */}
      <Card className="rounded-2xl p-6 !mb-4">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8}>
            <div className="flex items-center !space-x-4">
              <Avatar
                size={80}
                icon={<UserOutlined />}
                className="bg-white text-blue-600 border-4 border-white/20"
              />
              <div>
                <h1 className="text-2xl font-bold">{student?.student_name}</h1>
                <p className="text-blue-400">{student?.email}</p>
                <Tag
                  color={student?.status === "active" ? "green" : "red"}
                  className="mt-2 border-white/30"
                >
                  {student?.status?.toUpperCase()}
                </Tag>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={16}>
            <Row gutter={[16, 16]}>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Tasks Completed"
                  value={completedTasks}
                  suffix={`/ ${totalTasks}`}
                  valueStyle={{ color: "#000", fontSize: "16px" }}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Total Points"
                  value={totalPoints}
                  valueStyle={{ color: "#000", fontSize: "16px" }}
                  prefix={<TrophyOutlined />}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Positive Behaviours"
                  value={positiveBehaviours}
                  valueStyle={{ color: "#000", fontSize: "16px" }}
                  prefix={<SmileOutlined />}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="Class"
                  value={student?.class?.class_name}
                  valueStyle={{ color: "#000", fontSize: "16px" }}
                  prefix={<TeamOutlined />}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>

      {/* Progress Section */}
      {totalTasks > 0 && (
        <Card className="shadow-lg border-0 rounded-2xl !mb-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <BarChartOutlined className="mr-2 text-blue-500" />
              Overall Progress
            </h3>
          </div>
          <Progress
            percent={Math.round((completedTasks / totalTasks) * 100)}
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
            format={(percent) =>
              `${completedTasks}/${totalTasks} tasks (${percent}%)`
            }
          />
        </Card>
      )}

      <Row gutter={[16, 16]}>
        {/* School & Class Information */}
        <Col xs={24} lg={12}>
          <Card
            className="shadow-lg border-0 rounded-2xl h-full"
            title={
              <div className="flex items-center">
                <BankOutlined className="text-blue-500 mr-2" />
                School & Class Information
              </div>
            }
          >
            <div className="space-y-4">
              {/* School Info */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  School Details
                </h4>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Name">
                    {student?.school?.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Admin">
                    {student?.school?.school_admin}
                  </Descriptions.Item>
                  <Descriptions.Item label="Contact">
                    {student?.school?.contact}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {student?.school?.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Year Structure">
                    {student?.school?.year_structure}
                  </Descriptions.Item>
                </Descriptions>
              </div>

              {/* Class Info */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">
                  Class Information
                </h4>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="Class Name">
                    {student?.class?.class_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Number of Terms">
                    {student?.class?.number_of_terms}
                  </Descriptions.Item>
                  <Descriptions.Item label="Username">
                    {student?.user_name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Class ID">
                    {student?.class_id}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </Card>
        </Col>

        {/* Recent Activity Timeline */}
        <Col xs={24} lg={12}>
          <Card
            className="shadow-lg border-0 rounded-2xl h-full"
            title={
              <div className="flex items-center">
                <CalendarOutlined className="text-green-500 mr-2" />
                Recent Activity
              </div>
            }
          >
            <Timeline>
              {student?.behaviour
                ?.slice(0, 5)
                .map((record: any, index: number) => (
                  <Timeline.Item
                    key={record.id}
                    color={record.behaviour?.points > 0 ? "green" : "red"}
                    dot={<SmileOutlined style={{ fontSize: "16px" }} />}
                  >
                    <div className="flex justify-between">
                      <span>{record.description}</span>
                      <Tag color={record.behaviour?.color}>
                        {record.behaviour?.name}
                      </Tag>
                    </div>
                    <div className="text-gray-500 text-sm">{record.date}</div>
                    <div className="text-gray-600 text-sm">
                      Points: {record.behaviour?.points}
                    </div>
                  </Timeline.Item>
                ))}
            </Timeline>
          </Card>
        </Col>
      </Row>

      {/* Academic Work */}
      <Card
        className="shadow-lg border-0 rounded-2xl !mb-4"
        title={
          <div className="flex items-center">
            <BookOutlined className="text-purple-500 mr-2" />
            Academic Work & Assessments
          </div>
        }
      >
        <Collapse
          accordion
          className="bg-transparent"
          expandIconPosition="end"
          items={student?.class?.term?.map((term: any) => ({
            key: term.id,
            label: (
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">{term.name}</span>
                <Tag color="blue">
                  {term.assign_assessments?.length || 0} Assessments
                </Tag>
              </div>
            ),
            children: (
              <div className="space-y-4">
                {term.assign_assessments?.map((assignment: any) => (
                  <Card
                    key={assignment.id}
                    className="border-l-4 border-l-blue-500 shadow-md !mb-2"
                    title={
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-lg">
                          {assignment.assessment.name}
                        </span>
                        <Tag
                          color={
                            assignment.status === "completed"
                              ? "green"
                              : assignment.status === "in progress"
                              ? "blue"
                              : "orange"
                          }
                        >
                          {assignment.status}
                        </Tag>
                      </div>
                    }
                  >
                    <Table
                      rowKey="id"
                      pagination={false}
                      scroll={{ x: 800 }}
                      columns={[
                        {
                          title: "Task Name",
                          dataIndex: "task_name",
                          render: (text) => (
                            <span className="font-medium">{text}</span>
                          ),
                        },
                        {
                          title: "Type",
                          dataIndex: "task_type",
                          render: (type) => <Tag>{type}</Tag>,
                        },
                        {
                          title: "Due Date",
                          dataIndex: "due_date",
                          render: (date) => (
                            <div className="flex items-center">
                              <CalendarOutlined className="mr-1 text-gray-400" />
                              {date}
                            </div>
                          ),
                        },
                        {
                          title: "Allocated Marks",
                          dataIndex: "allocated_marks",
                          align: "center" as const,
                        },
                        {
                          title: "Submission Status",
                          width: 200,
                          render: (_, record: any) => {
                            const submission =
                              record.student_assessment_tasks?.[0];
                            return submission ? (
                              <div className="text-center">
                                <Tag
                                  color={
                                    submission.status === "completed"
                                      ? "green"
                                      : "orange"
                                  }
                                  className="mb-2"
                                >
                                  {submission.status}
                                </Tag>
                                <div className="text-sm text-gray-600">
                                  <div>
                                    Score:{" "}
                                    {submission.teacher_assessment_score ||
                                      "N/A"}
                                  </div>
                                  {submission.teacher_feedback && (
                                    <div className="mt-1 p-2 bg-gray-50 rounded text-xs">
                                      Feedback: {submission.teacher_feedback}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <Tag color="red" className="mx-auto">
                                Not Submitted
                              </Tag>
                            );
                          },
                        },
                      ]}
                      dataSource={assignment.assessment.tasks}
                    />
                  </Card>
                ))}
              </div>
            ),
          }))}
        />
      </Card>

      <Row gutter={[16, 16]}>
        {/* Trackers */}
        <Col xs={24} lg={24}>
          <Card
            className="shadow-lg border-0 rounded-2xl h-full"
            title={
              <div className="flex items-center">
                <CheckCircleOutlined className="text-orange-500 mr-2" />
                Assigned Trackers
              </div>
            }
          >
            <Table
              rowKey="id"
              pagination={false}
              expandable={{
                expandedRowRender: (record) => {
                  const topics = record.tracker?.topics || [];

                  return (
                    <Table
                      rowKey="id"
                      pagination={false}
                      columns={[
                        {
                          title: "Topic Title",
                          dataIndex: "title",
                          render: (text, topic) => (
                            <span className="font-medium">{text || "—"}</span>
                          ),
                        },
                        {
                          title: "Type",
                          dataIndex: "type",
                          render: (type) => (
                            <Tag color={type === "topic" ? "blue" : "purple"}>
                              {type.toUpperCase()}
                            </Tag>
                          ),
                        },
                        {
                          title: "Marks",
                          dataIndex: "marks",
                          render: (m) => m || "—",
                          align: "center",
                        },
                        {
                          title: "Progress",
                          render: (_, topic) => {
                            const statuses = topic.status_progress || [];

                            return (
                              <div>
                                {statuses.map((sp) => (
                                  <Tag
                                    key={sp.id}
                                    color={sp.is_completed ? "green" : "red"}
                                    className="mr-1"
                                  >
                                    {sp.status?.name} (
                                    {sp.is_completed ? "Done" : "Pending"})
                                  </Tag>
                                ))}

                                {statuses.length === 0 && (
                                  <Tag color="default">No Progress</Tag>
                                )}
                              </div>
                            );
                          },
                        },
                      ]}
                      dataSource={topics}
                    />
                  );
                },
              }}
              columns={[
                {
                  title: "Tracker Name",
                  dataIndex: ["tracker", "name"],
                  render: (name) => <span className="font-medium">{name}</span>,
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  render: (status) => (
                    <Tag
                      color={status === "assigned" ? "green" : "volcano"}
                      className="font-medium"
                    >
                      {status.toUpperCase()}
                    </Tag>
                  ),
                },
                {
                  title: "Total Topics",
                  render: (_, record) => (
                    <Tag color="blue">
                      {record.tracker?.topics?.length || 0}
                    </Tag>
                  ),
                },
              ]}
              dataSource={student?.class?.assign_trackers}
            />
          </Card>
        </Col>

        {/* Behaviour Records */}
        <Col xs={24} lg={24}>
          <Card
            className="shadow-lg border-0 rounded-2xl h-full"
            title={
              <div className="flex items-center">
                <SmileOutlined className="text-pink-500 mr-2" />
                Behaviour Records
              </div>
            }
          >
            <Table
              rowKey="id"
              pagination={{ pageSize: 5 }}
              scroll={{ x: 600 }}
              columns={[
                {
                  title: "Date",
                  dataIndex: "date",
                  render: (date) => (
                    <div className="flex items-center">
                      <CalendarOutlined className="mr-1 text-gray-400" />
                      {date}
                    </div>
                  ),
                },
                {
                  title: "Description",
                  dataIndex: "description",
                  width: 200,
                  render: (desc) => (
                    <div className="max-w-xs truncate" title={desc}>
                      {desc}
                    </div>
                  ),
                },
                {
                  title: "Behaviour",
                  render: (_, record) => (
                    <Tag color={record.behaviour.color} className="font-medium">
                      {record.behaviour.name}
                    </Tag>
                  ),
                },
                {
                  title: "Points",
                  dataIndex: ["behaviour", "points"],
                  align: "center" as const,
                  render: (points) => (
                    <span
                      className={`font-bold ${
                        points > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {points > 0 ? `+${points}` : points}
                    </span>
                  ),
                },
              ]}
              dataSource={student?.behaviour}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
