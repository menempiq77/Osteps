"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Button } from "antd";

export default function DashboardPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);

  // Role-based data
  const getDashboardData = () => {
    switch (currentUser?.role) {
      case "SUPER_ADMIN":
        return {
          stats: [
            { title: "Total Schools", value: 15 },
            { title: "Total Admins", value: 32 },
            { title: "Active Schools", value: 14 },
          ],
          barChartData: [
            { name: "School A", admins: 3 },
            { name: "School B", admins: 2 },
            { name: "School C", admins: 4 },
            { name: "School D", admins: 1 },
            { name: "School E", admins: 2 },
          ],
          pieChartData: [
            { name: "Active Schools", value: 14 },
            { name: "Inactive Schools", value: 1 },
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
            { title: "Total Students", value: 800 },
          ],
          barChartData: [
            { name: "Grade 1", students: 120 },
            { name: "Grade 2", students: 115 },
            { name: "Grade 3", students: 105 },
            { name: "Grade 4", students: 95 },
            { name: "Grade 5", students: 90 },
          ],
          pieChartData: [
            { name: "Active Teachers", value: 42 },
            { name: "Inactive Teachers", value: 3 },
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
            { title: "Pending Assignments", value: 15 },
          ],
          barChartData: [
            { name: "Class A", students: 30 },
            { name: "Class B", students: 28 },
            { name: "Class C", students: 32 },
            { name: "Class D", students: 30 },
          ],
          pieChartData: [
            { name: "Submitted Assignments", value: 85 },
            { name: "Pending Assignments", value: 15 },
          ],
          barChartKey: "students",
          pieChartTitle: "Assignment Status",
          barChartTitle: "Students per Class",
        };
      case "STUDENT":
        return {
          stats: [
            { title: "My Classes", value: 6 },
            { title: "Active Assignments", value: 3 },
            { title: "Completed Assignments", value: 24 },
          ],
          barChartData: [
            { name: "Math", score: 85 },
            { name: "Science", score: 78 },
            { name: "English", score: 92 },
            { name: "History", score: 88 },
          ],
          pieChartData: [
            { name: "Completed Assignments", value: 24 },
            { name: "Pending Assignments", value: 3 },
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
      "Total Schools": <School className="h-6 w-6" />,
      "Total Admins": <UserCog className="h-6 w-6" />,
      "Active Schools": <Activity className="h-6 w-6" />,
    },
    SCHOOL_ADMIN: {
      "Total Classes": <LayoutDashboard className="h-6 w-6" />,
      "Total Teachers": <Users className="h-6 w-6" />,
      "Total Students": <GraduationCap className="h-6 w-6" />,
    },
    TEACHER: {
      "My Classes": <BookOpen className="h-6 w-6" />,
      "Total Students": <GraduationCap className="h-6 w-6" />,
      "Pending Assignments": <ClipboardList className="h-6 w-6" />,
    },
    STUDENT: {
      "My Classes": <BookOpen className="h-6 w-6" />,
      "Active Assignments": <ClipboardList className="h-6 w-6" />,
      "Completed Assignments": <CheckCircle className="h-6 w-6" />,
    },
  };

  const colorSchemes = [
    { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" },
    { bg: "bg-green-50", text: "text-green-600", border: "border-green-100" },
    {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-100",
    },
    { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
  ];

  const {
    stats,
    barChartData,
    pieChartData,
    barChartKey,
    pieChartTitle,
    barChartTitle,
  } = getDashboardData();

  const COLORS = ["#4f46e5", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 uppercase dark:text-white">
        {currentUser?.role.replace("_", " ")} Dashboard
      </h1>
      {currentUser?.role === "STUDENT" ? (
       <div className="space-y-6 p-4">
       {/* Enhanced Breadcrumb */}
       <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-300">
         <span className="text-blue-600 dark:text-blue-400 font-semibold">Year 7</span>
         <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
         <span className="text-gray-800 dark:text-white">Class C</span>
       </div>
     
       {/* Cards Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
         <Link href="/dashboard/students/assignments">
           <Card className="hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-100 dark:hover:border-blue-900 group overflow-hidden">
             <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
               <div>
                 <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                   Islamic Studies
                 </CardTitle>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                   Assignment Due: Tomorrow
                 </p>
               </div>
               <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                 <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
               </div>
             </CardHeader>
             <CardContent>
               <div className="flex justify-between items-end">
                 <div>
                   <p className="text-base font-medium text-gray-700 dark:text-gray-200">
                     Today's Lesson: Prayer
                   </p>
                   <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                     Updated 2 hours ago
                   </p>
                 </div>
                 <Button color="default" variant="outlined" className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30">
                   View
                 </Button>
               </div>
             </CardContent>
           </Card>
         </Link>
       </div>
     </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const color = colorSchemes[index % colorSchemes.length];
              const icon = currentUser?.role
                ? (statIcons[currentUser.role] as Record<string, JSX.Element>)[
                    stat.title
                  ]
                : null;

              return (
                <Card
                  key={index}
                  className={`${color.border} hover:shadow-lg transition-all duration-200`}
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className={`text-sm font-medium ${color.text}`}>
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${color.bg}`}>{icon}</div>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-3xl font-bold ${color.text}`}>
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {index % 2 === 0
                        ? "+12% from last month"
                        : "+5% from last month"}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts Section */}
          {barChartData.length > 0 && pieChartData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
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
                        fill="#4f46e5"
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

              {/* Pie Chart */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
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
            </div>
          )}
        </>
      )}
    </div>
  );
}
