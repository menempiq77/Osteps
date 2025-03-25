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
} from "recharts";
import { RootState } from "@/store/store";

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

  const {
    stats,
    barChartData,
    pieChartData,
    barChartKey,
    pieChartTitle,
    barChartTitle,
  } = getDashboardData();

  const COLORS = ["#3b82f6", "#f97316"];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 uppercase">
        {currentUser?.role.replace("_", " ")} Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section - Only show if there's chart data */}
      {barChartData.length > 0 && pieChartData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-2">{barChartTitle}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey={barChartKey} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-2">{pieChartTitle}</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}