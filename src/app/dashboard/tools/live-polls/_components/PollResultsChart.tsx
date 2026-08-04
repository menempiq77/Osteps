"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { QuestionResult } from "@/services/livePollApi";

const CHART_COLORS = [
  "#4262FF", "#FF6B8A", "#1DB954", "#FF9F43", "#A55EEA",
  "#2BCBBA", "#E74C3C", "#3498DB", "#9B59B6", "#F39C12",
];

type PollResultsChartProps = {
  question: QuestionResult;
  mode: "results" | "presenter";
};

export default function PollResultsChart({
  question,
  mode,
}: PollResultsChartProps) {
  if (mode === "results") {
    if (question.type === "multiple_choice") {
      const data = Object.entries(question.results as Record<string, number>).map(
        ([name, value], i) => ({
          name,
          value,
          fill: CHART_COLORS[i % CHART_COLORS.length],
        })
      );
      const total = data.reduce((s, d) => s + d.value, 0);
      return (
        <div>
          <ResponsiveContainer width="100%" height={Math.max(200, data.length * 50)}>
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" allowDecimals={false} tick={{ fill: "#6b7280" }} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fill: "#374151" }} />
              <Tooltip formatter={(v: number) => [`${v} (${total > 0 ? Math.round((v / total) * 100) : 0}%)`, "Votes"]} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-3">
            {data.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-sm">
                <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: d.fill }} />
                <span className="font-medium text-gray-700">{d.name}</span>
                <span className="text-gray-400">
                  {d.value} ({total > 0 ? Math.round((d.value / total) * 100) : 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (question.type === "word_cloud") {
      const words = Object.entries(question.results as Record<string, number>).sort(
        ([, a], [, b]) => b - a
      );
      const maxCount = words[0]?.[1] ?? 1;
      return (
        <div className="flex flex-wrap gap-2 py-4">
          {words.map(([word, count], i) => {
            const size = 14 + (count / maxCount) * 28;
            return (
              <span
                key={i}
                className="inline-block rounded-full px-3 py-1 font-semibold text-white"
                style={{
                  fontSize: size,
                  backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                }}
              >
                {word} ({count})
              </span>
            );
          })}
        </div>
      );
    }

    if (question.type === "rating") {
      const rating = question.results as {
        average: number;
        distribution: Record<string, number>;
      };
      const data = Array.from({ length: 5 }, (_, i) => ({
        name: `${i + 1}`,
        value: rating.distribution[String(i + 1)] ?? 0,
      }));
      return (
        <div>
          <div className="mb-3 text-center">
            <span className="text-4xl font-bold text-[#FF9F43]">{rating.average}</span>
            <span className="text-gray-400 text-lg"> / 5</span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: "#374151" }} />
              <YAxis allowDecimals={false} tick={{ fill: "#6b7280" }} />
              <Tooltip />
              <Bar dataKey="value" fill="#FF9F43" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    const answers = question.results as string[];
    return (
      <div className="max-h-60 overflow-y-auto space-y-2">
        {answers.length === 0 && <p className="text-gray-400 text-sm">No responses yet</p>}
        {answers.map((answer, i) => (
          <div key={i} className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
            {answer}
          </div>
        ))}
      </div>
    );
  }

  if (question.type === "multiple_choice") {
    const data = Object.entries(question.results as Record<string, number>).map(
      ([name, value], i) => ({
        name,
        value,
        fill: CHART_COLORS[i % CHART_COLORS.length],
      })
    );
    const total = data.reduce((s, d) => s + d.value, 0);

    if (total === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 text-6xl text-gray-300">&#128202;</div>
          <p className="text-xl text-gray-400">Waiting for responses...</p>
          <p className="mt-2 text-sm text-gray-300">Results will appear here in real-time</p>
        </div>
      );
    }

    return (
      <div className="w-full">
        <ResponsiveContainer width="100%" height={Math.max(300, data.length * 20 + 200)}>
          <BarChart data={data} margin={{ top: 30, right: 30, bottom: 10, left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: "#374151", fontSize: 14, fontWeight: 600 }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(v: number) => [`${v} vote${v !== 1 ? "s" : ""} (${total > 0 ? Math.round((v / total) * 100) : 0}%)`, ""]}
              contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={60} label={{ position: "top", fill: "#374151", fontSize: 18, fontWeight: 700 }}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (question.type === "word_cloud") {
    const words = Object.entries(question.results as Record<string, number>).sort(
      ([, a], [, b]) => b - a
    );
    const maxCount = words[0]?.[1] ?? 1;
    if (words.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 text-6xl text-gray-300">&#9729;</div>
          <p className="text-xl text-gray-400">Waiting for responses...</p>
        </div>
      );
    }
    return (
      <div className="flex flex-wrap justify-center gap-3 py-8">
        {words.map(([word, count], i) => {
          const size = 18 + (count / maxCount) * 40;
          return (
            <span
              key={i}
              className="inline-block rounded-2xl px-5 py-2 font-bold text-white"
              style={{
                fontSize: size,
                backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  }

  if (question.type === "rating") {
    const rating = question.results as {
      average: number;
      distribution: Record<string, number>;
    };
    const data = Array.from({ length: 5 }, (_, i) => ({
      name: `${i + 1}`,
      value: rating.distribution[String(i + 1)] ?? 0,
    }));
    const totalVotes = data.reduce((s, d) => s + d.value, 0);
    if (totalVotes === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 text-6xl text-gray-300">&#11088;</div>
          <p className="text-xl text-gray-400">Waiting for ratings...</p>
        </div>
      );
    }
    return (
      <div>
        <div className="mb-8 text-center">
          <span className="text-8xl font-bold text-[#FF9F43]">{rating.average.toFixed(1)}</span>
          <span className="text-3xl text-gray-300"> / 5</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#374151", fontSize: 18, fontWeight: 600 }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Bar dataKey="value" fill="#FF9F43" radius={[8, 8, 0, 0]} barSize={50} label={{ position: "top", fill: "#374151", fontSize: 16, fontWeight: 700 }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const answers = question.results as string[];
  if (answers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 text-6xl text-gray-300">&#128172;</div>
        <p className="text-xl text-gray-400">Waiting for responses...</p>
      </div>
    );
  }
  return (
    <div className="w-full columns-1 gap-4 md:columns-2 lg:columns-3">
      {answers.map((answer, i) => (
        <div
          key={i}
          className="mb-3 break-inside-avoid rounded-xl bg-gray-50 border border-gray-100 px-5 py-4 text-base text-gray-700"
        >
          &ldquo;{answer}&rdquo;
        </div>
      ))}
    </div>
  );
}
