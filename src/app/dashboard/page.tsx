"use client";
import { Card, Statistic, Row, Col, Button } from "antd";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
  LabelList,
} from "recharts";
import { RootState } from "@/store/store";
import {
  School,
  Users,
  Activity,
  BookOpen,
  UserCog,
  GraduationCap,
  ClipboardList,
  CheckCircle,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchSchools } from "@/services/schoolApi";
import { fetchAdmins } from "@/services/adminsApi";

// Custom theme colors
const THEME_COLOR = "#38C16C";
const THEME_COLOR_LIGHT = "#E8F5E9";
const THEME_COLOR_DARK = "#2E7D32";

export default function DashboardPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [schools, setSchools] = useState<any[]>([]);
  const [superAdmins, setSuperAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAdmins = async () => {
    try {
      const admins = await fetchAdmins();
      setSuperAdmins(admins);
    } catch (error) {
      console.error("Failed to fetch admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSchools = async () => {
    try {
      const data = await fetchSchools();
      setSchools(data);
    } catch (err) {
      setError("Failed to fetch schools");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadSchools();
    loadAdmins();
  }, []);

  // Role-based data
  const getDashboardData = () => {
    switch (currentUser?.role) {
      case "SUPER_ADMIN":
        return {
          stats: [
            { title: "Total Schools", value: schools?.length || 0 },
            { title: "Total Admins", value: superAdmins?.length || 0 },
          ],
          barChartData: [
            // { name: "School A", admins: 3 },
            // { name: "School B", admins: 2 },
            // { name: "School C", admins: 4 },
            // { name: "School D", admins: 1 },
            // { name: "School E", admins: 2 },
          ],
          pieChartData: [
            // { name: "Active Schools", value: 14 },
            // { name: "Inactive Schools", value: 1 },
          ],
          barChartKey: "admins",
          pieChartTitle: "School Status",
          barChartTitle: "Admins per School",
        };
      case "SCHOOL_ADMIN":
        return {
          stats: [
            { title: "Total Classes", value: 24 },
            { title: "Total Teachers", value: 45 },
          ],
          barChartData: [
            // { name: "Grade 1", students: 120 },
            // { name: "Grade 2", students: 115 },
            // { name: "Grade 3", students: 105 },
            // { name: "Grade 4", students: 95 },
            // { name: "Grade 5", students: 90 },
          ],
          pieChartData: [
            // { name: "Active Teachers", value: 42 },
            // { name: "Inactive Teachers", value: 3 },
          ],
          barChartKey: "students",
          pieChartTitle: "Teacher Status",
          barChartTitle: "Students per Grade",
        };
      case "TEACHER":
        return {
          stats: [
            { title: "My Classes", value: 4 },
            { title: "Total Students", value: 120 },
            // { title: "Pending Assignments", value: 15 },
          ],
          barChartData: [
            // { name: "Class A", students: 30 },
            // { name: "Class B", students: 28 },
            // { name: "Class C", students: 32 },
            // { name: "Class D", students: 30 },
          ],
          pieChartData: [
            // { name: "Submitted Assignments", value: 85 },
            // { name: "Pending Assignments", value: 15 },
          ],
          barChartKey: "students",
          pieChartTitle: "Assignment Status",
          barChartTitle: "Students per Class",
        };
      case "STUDENT":
        return {
          stats: [
            { title: "My Classes", value: 6 },
            // { title: "Active Assignments", value: 3 },
            // { title: "Completed Assignments", value: 24 },
          ],
          barChartData: [
            // { name: "Math", score: 85 },
            // { name: "Science", score: 78 },
            // { name: "English", score: 92 },
            // { name: "History", score: 88 },
          ],
          pieChartData: [
            // { name: "Completed Assignments", value: 24 },
            // { name: "Pending Assignments", value: 3 },
          ],
          barChartKey: "score",
          pieChartTitle: "Assignments Progress",
          barChartTitle: "Subject Scores",
        };
      default:
        return {
          stats: [],
          barChartData: [],
          pieChartData: [],
          barChartKey: "",
          pieChartTitle: "",
          barChartTitle: "",
        };
    }
  };

  const statIcons = {
    SUPER_ADMIN: {
      "Total Schools": (
        <School className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Total Admins": (
        <UserCog className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Active Schools": (
        <Activity className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
    },
    SCHOOL_ADMIN: {
      "Total Classes": (
        <LayoutDashboard className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Total Teachers": (
        <Users className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Total Students": (
        <GraduationCap className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
    },
    TEACHER: {
      "My Classes": (
        <BookOpen className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Total Students": (
        <GraduationCap className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Pending Assignments": (
        <ClipboardList className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
    },
    STUDENT: {
      "My Classes": (
        <BookOpen className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Active Assignments": (
        <ClipboardList className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
      "Completed Assignments": (
        <CheckCircle className="h-5 w-5" style={{ color: THEME_COLOR }} />
      ),
    },
  };

  const {
    stats,
    barChartData,
    pieChartData,
    barChartKey,
    pieChartTitle,
    barChartTitle,
  } = getDashboardData();

  const COLORS = [
    THEME_COLOR,
    "#81C784",
    "#4CAF50",
    "#388E3C",
    THEME_COLOR_DARK,
  ];

  return (
    <div className="p-3 md:p-6 space-y-6 min-h-screen !font-[Raleway]">
      <Card
        className="border-0 shadow-sm !mb-6"
        style={{
          background: `linear-gradient(to right, ${THEME_COLOR_LIGHT}, white)`,
        }}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-1">
                Welcome, {currentUser?.name.replace("_", " ")}!
              </h1>
              <p className="text-lg text-gray-600 mb-3">
                We're glad to have you back!
              </p>
              <p className="text-gray-500 mb-4">
                Let's get started. Explore your dashboard to manage your
                activities.
              </p>
            </div>
            <div
              className="hidden md:block p-3 rounded-lg"
              style={{ backgroundColor: THEME_COLOR_LIGHT }}
            >
              <svg
                className="w-16 h-16"
                style={{ color: THEME_COLOR }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>
        </div>
      </Card>

      {currentUser?.role === "STUDENT" ? (
        <div className="space-y-6">
          {/* Enhanced Breadcrumb */}
          <div className="flex items-center text-sm font-medium text-gray-600">
            <span className="font-semibold" style={{ color: THEME_COLOR }}>
              Year 7
            </span>
            <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
            <span className="text-gray-800">Class C</span>
          </div>

          {/* Cards Grid */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Link href="/dashboard/students/assignments">
                <Card
                  hoverable
                  className="border-0 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Islamic Studies
                      </h3>
                      <p className="text-sm text-gray-500">
                        Assessments Due: Tomorrow
                      </p>
                    </div>
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: THEME_COLOR_LIGHT }}
                    >
                      <BookOpen
                        className="h-6 w-6"
                        style={{ color: THEME_COLOR }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-end">
                    <div>
                      <p className="text-base font-medium text-gray-700">
                        Today's Lesson: Prayer
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Updated 2 hours ago
                      </p>
                    </div>
                    <Button
                      type="primary"
                      style={{
                        backgroundColor: THEME_COLOR,
                        borderColor: THEME_COLOR,
                      }}
                    >
                      View
                    </Button>
                  </div>
                </Card>
              </Link>
            </Col>
          </Row>

          {/* Progress Chart Section */}
          {/* <Card className="shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Assessments Progress
            </h2>
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Completed", value: 24 },
                      { name: "Pending", value: 3 },
                    ]}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    paddingAngle={5}
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell key="completed" fill={THEME_COLOR} />
                    <Cell key="pending" fill="#f59e0b" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-around mt-4 text-sm text-gray-600 w-full">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: THEME_COLOR }}
                  />
                  Completed
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  Pending
                </div>
              </div>
            </div>
          </Card> */}
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <Row gutter={[16, 16]}>
            {stats.map((stat, index) => {
              const icon = currentUser?.role
                ? (statIcons[currentUser.role] as Record<string, JSX.Element>)[
                    stat.title
                  ]
                : null;

              return (
                <Col key={index} xs={24} md={12}>
                  <Card className="border-0 shadow-sm hover:shadow-md transition-all">
                    <Statistic
                      title={
                        <span className="text-[#000000] font-medium !font-['Raleway']">
                          {stat.title}
                        </span>
                      }
                      value={stat.value}
                      prefix={icon}
                      valueStyle={{ color: THEME_COLOR_DARK }}
                    />
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* Charts Section */}
          {barChartData.length > 0 && pieChartData.length > 0 && (
            <Row gutter={[16, 16]}>
              {/* Bar Chart */}
              <Col xs={24} lg={12}>
                <Card className="border-0 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {barChartTitle}
                  </h2>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={barChartData}
                        margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="opacity-30"
                        />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "#6b7280" }}
                          axisLine={{ stroke: "#d1d5db" }}
                        />
                        <YAxis
                          tick={{ fill: "#6b7280" }}
                          axisLine={{ stroke: "#d1d5db" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            borderRadius: "0.5rem",
                            borderColor: "#e5e7eb",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey={barChartKey}
                          name={barChartTitle.split(" per ")[0]}
                          fill={THEME_COLOR}
                          radius={[4, 4, 0, 0]}
                        >
                          <LabelList
                            dataKey={barChartKey}
                            position="top"
                            className="text-xs fill-gray-600"
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>

              {/* Pie Chart */}
              <Col xs={24} lg={12}>
                <Card className="border-0 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    {pieChartTitle}
                  </h2>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={60}
                          paddingAngle={5}
                          label={({ percent }) =>
                            `${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              stroke="#fff"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name, props) => [value, name]}
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            borderRadius: "0.5rem",
                            borderColor: "#e5e7eb",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Legend
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                          wrapperStyle={{ paddingTop: "20px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </Col>
            </Row>
          )}
        </>
      )}
    </div>
  );
}
