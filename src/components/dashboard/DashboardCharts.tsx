"use client";

import { Card, Col, Row } from "antd";
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

type ChartRow = Record<string, any>;

interface DashboardChartsProps {
  barChartData: ChartRow[];
  pieChartData: ChartRow[];
  barChartTitle: string;
  pieChartTitle: string;
  barChartKey: string;
  themeColor: string;
  colors: string[];
}

export default function DashboardCharts({
  barChartData,
  pieChartData,
  barChartTitle,
  pieChartTitle,
  barChartKey,
  themeColor,
  colors,
}: DashboardChartsProps) {
  if (barChartData.length === 0 || pieChartData.length === 0) {
    return null;
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={12}>
        <Card className="premium-card border-0">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{barChartTitle}</h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fill: "#6b7280" }} axisLine={{ stroke: "#d1d5db" }} />
                <YAxis tick={{ fill: "#6b7280" }} axisLine={{ stroke: "#d1d5db" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "0.5rem",
                    borderColor: "#e5e7eb",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar dataKey={barChartKey} name={barChartTitle.split(" per ")[0]} fill={themeColor} radius={[4, 4, 0, 0]}>
                  <LabelList dataKey={barChartKey} position="top" className="text-xs fill-gray-600" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>

      <Col xs={24} lg={12}>
        <Card className="premium-card border-0">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{pieChartTitle}</h2>
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
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="#fff" />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [value, name]}
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
  );
}