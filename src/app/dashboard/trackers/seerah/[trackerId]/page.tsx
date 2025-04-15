"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, MapPin } from "lucide-react";

const periods = [
  {
    id: 1,
    name: "Pre-Islamic Arabia",
    description: "The state of Arabia before Islam",
  },
  {
    id: 2,
    name: "Birth & Early Life",
    description: "The Prophet's birth and childhood",
  },
  {
    id: 3,
    name: "Prophethood in Mecca",
    description: "First 13 years of revelation",
  },
  {
    id: 4,
    name: "Migration to Medina",
    description: "Hijra and establishment of Muslim community",
  },
  {
    id: 5,
    name: "Medina Period",
    description: "Building the Muslim state and community",
  },
  {
    id: 6,
    name: "Conquest of Mecca",
    description: "Return to Mecca and its peaceful conquest",
  },
  {
    id: 7,
    name: "Final Years",
    description: "The Prophet's last years and passing",
  },
  // Add more periods as needed
];

export default function SeerahTrackerPage() {
  const { trackerId } = useParams();
  const router = useRouter();
  const [progress, setProgress] = useState<
    Record<number, { studied: boolean; recall: boolean }>
  >({});
  const [visiblePeriods, setVisiblePeriods] = useState(5);

  const handleCheckboxChange = (
    periodId: number,
    type: "studied" | "recall"
  ) => {
    setProgress((prev) => ({
      ...prev,
      [periodId]: {
        ...prev[periodId],
        [type]: !prev[periodId]?.[type],
      },
    }));
  };

  const loadMorePeriods = () => {
    setVisiblePeriods((prev) => Math.min(prev + 5, periods.length));
  };

  const totalPeriods = periods.length;
  const studiedCount = Object.values(progress).filter((p) => p?.studied).length;
  const recallCount = Object.values(progress).filter((p) => p?.recall).length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Trackers
        </Button>

        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
            <BookOpen size={16} className="text-green-500" />
            <span className="text-sm font-medium">
              {studiedCount}/{totalPeriods}
            </span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
            <Clock size={16} className="text-blue-500" />
            <span className="text-sm font-medium">
              {recallCount}/{totalPeriods}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            Seerah Progress Tracker
          </h1>
          <p className="text-gray-500 mt-1">
            Track your study of the Prophet's life and times
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left border text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Period
                </th>
                <th className="p-4 text-left border text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="p-4 text-center border text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-1">
                    <BookOpen size={16} className="text-green-500" />
                    <span>Studied</span>
                  </div>
                </th>
                <th className="p-4 text-center border text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-1">
                    <Clock size={16} className="text-blue-500" />
                    <span>Recall</span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {periods.slice(0, visiblePeriods).map((period) => (
                <tr
                  key={period.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 border whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {period.name}
                    </div>
                  </td>
                  <td className="p-4 border">
                    <div className="text-sm text-gray-500">
                      {period.description}
                    </div>
                  </td>
                  <td className="p-4 border whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={progress[period.id]?.studied || false}
                      onChange={() =>
                        handleCheckboxChange(period.id, "studied")
                      }
                      className="h-5 w-5 text-green-500 rounded border-gray-300 focus:ring-green-500 transition"
                    />
                  </td>
                  <td className="p-4 border whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={progress[period.id]?.recall || false}
                      onChange={() => handleCheckboxChange(period.id, "recall")}
                      className="h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500 transition"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {Math.min(visiblePeriods, periods.length)} of{" "}
              {periods.length} Periods
            </div>
            {visiblePeriods < periods.length && (
              <Button variant="outline" size="sm" onClick={loadMorePeriods}>
                Load More (5)
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
