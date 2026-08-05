"use client";

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type BehaviourDatum = {
  name: string;
  value: number;
  color: string;
};

type AssessmentDatum = {
  key: string;
  name: string;
  percent: number;
};

type ReportChartProps =
  | { type: "donut"; percent: number; color: string; label: string }
  | { type: "behaviour"; data: BehaviourDatum[] }
  | { type: "academic"; assessments: AssessmentDatum[] };

export default function ReportChart(props: ReportChartProps) {
  if (props.type === "donut") {
    const data = [
      { name: "v", value: Math.max(0, Math.min(100, props.percent)) },
      { name: "r", value: Math.max(0, 100 - props.percent) },
    ];
    return (
      <div className="relative h-[140px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={48}
              outerRadius={62}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              <Cell fill={props.color} />
              <Cell fill="#eef2f7" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-slate-800">{props.percent}%</span>
          <span className="text-[11px] font-medium text-slate-500">{props.label}</span>
        </div>
      </div>
    );
  }

  if (props.type === "behaviour") {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={props.data}
            dataKey="value"
            nameKey="name"
            innerRadius={42}
            outerRadius={62}
            stroke="none"
          >
            {props.data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={props.assessments.map((a) => ({
          name: a.name.length > 16 ? `${a.name.slice(0, 16)}…` : a.name,
          percent: a.percent,
        }))}
        margin={{ top: 8, right: 8, bottom: 8, left: -16 }}
      >
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11 }}
          interval={0}
          angle={-12}
          textAnchor="end"
          height={48}
        />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
        <Tooltip formatter={(v) => [`${v}%`, "Score"]} />
        <Bar dataKey="percent" radius={[6, 6, 0, 0]}>
          {props.assessments.map((a) => (
            <Cell
              key={a.key}
              fill={a.percent >= 70 ? "#22c55e" : a.percent >= 50 ? "#f59e0b" : "#ef4444"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
