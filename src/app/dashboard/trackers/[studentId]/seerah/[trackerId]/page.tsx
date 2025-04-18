"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Clock, Plus, Trash2, Edit, Save, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Period {
  id: number;
  name: string;
  description: string;
  status: {
    studied: boolean;
    recall: boolean;
  };
}

export default function SeerahTrackerPage() {
  const { trackerId } = useParams();
  const router = useRouter();
  const [periods, setPeriods] = useState<Period[]>([]);
  const [visiblePeriods, setVisiblePeriods] = useState(5);
  const [editingPeriod, setEditingPeriod] = useState<number | null>(null);
  const [newPeriodName, setNewPeriodName] = useState("");
  const [newPeriodDescription, setNewPeriodDescription] = useState("");
  const [isAddingPeriod, setIsAddingPeriod] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const canUpload = currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "TEACHER";

  // Initialize with sample data
  useEffect(() => {
    const initialPeriods = [
      { id: 1, name: "Pre-Islamic Arabia", description: "The state of Arabia before Islam", status: { studied: false, recall: false } },
      { id: 2, name: "Birth & Early Life", description: "The Prophet's birth and childhood", status: { studied: false, recall: false } },
      { id: 3, name: "Prophethood in Mecca", description: "First 13 years of revelation", status: { studied: false, recall: false } },
      { id: 4, name: "Migration to Medina", description: "Hijra and establishment of Muslim community", status: { studied: false, recall: false } },
      { id: 5, name: "Medina Period", description: "Building the Muslim state and community", status: { studied: false, recall: false } },
      { id: 6, name: "Conquest of Mecca", description: "Return to Mecca and its peaceful conquest", status: { studied: false, recall: false } },
      { id: 7, name: "Final Years", description: "The Prophet's last years and passing", status: { studied: false, recall: false } },
    ];
    setPeriods(initialPeriods);
  }, []);

  const handleStatusChange = (periodId: number, type: "studied" | "recall") => {
    setPeriods((prev) =>
      prev.map((period) =>
        period.id === periodId
          ? {
              ...period,
              status: { ...period.status, [type]: !period.status[type] },
            }
          : period
      )
    );
  };

  const loadMorePeriods = () => {
    setVisiblePeriods((prev) => prev + 5);
  };

  const startEditing = (periodId: number) => {
    const period = periods.find((p) => p.id === periodId);
    if (period) {
      setEditingPeriod(periodId);
      setNewPeriodName(period.name);
      setNewPeriodDescription(period.description);
    }
  };

  const saveEdit = () => {
    if (editingPeriod && newPeriodName.trim() && newPeriodDescription.trim()) {
      setPeriods((prev) =>
        prev.map((period) =>
          period.id === editingPeriod
            ? { 
                ...period, 
                name: newPeriodName.trim(),
                description: newPeriodDescription.trim()
              }
            : period
        )
      );
      setEditingPeriod(null);
    }
  };

  const cancelEdit = () => {
    setEditingPeriod(null);
  };

  const addNewPeriod = () => {
    if (newPeriodName.trim() && newPeriodDescription.trim()) {
      const newPeriodId = periods.length > 0 ? Math.max(...periods.map((p) => p.id)) + 1 : 1;

      setPeriods((prev) => [
        ...prev,
        {
          id: newPeriodId,
          name: newPeriodName.trim(),
          description: newPeriodDescription.trim(),
          status: { studied: false, recall: false },
        },
      ]);
      setNewPeriodName("");
      setNewPeriodDescription("");
      setIsAddingPeriod(false);
    }
  };

  const deletePeriod = (periodId: number) => {
    setPeriods((prev) => prev.filter((period) => period.id !== periodId));
  };

  // Calculate progress statistics
  const totalPeriods = periods.length;
  const studiedCount = periods.filter((p) => p.status.studied).length;
  const recallCount = periods.filter((p) => p.status.recall).length;

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
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Seerah Progress Management
            </h1>
            <p className="text-gray-500 mt-1">
              Admin panel for managing Seerah tracking
            </p>
          </div>
          {canUpload && (
            <Button
              onClick={() => setIsAddingPeriod(true)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              Add Period
            </Button>
          )}
        </div>

        {isAddingPeriod && (
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={newPeriodName}
                onChange={(e) => setNewPeriodName(e.target.value)}
                placeholder="Enter period name (e.g., Prophethood in Mecca)"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                value={newPeriodDescription}
                onChange={(e) => setNewPeriodDescription(e.target.value)}
                placeholder="Enter description"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={addNewPeriod}
                variant="default"
                className="flex items-center gap-1"
              >
                <Save size={16} />
                Save
              </Button>
              <Button
                onClick={() => {
                  setIsAddingPeriod(false);
                  setNewPeriodName("");
                  setNewPeriodDescription("");
                }}
                variant="outline"
              >
                <X size={16} />
              </Button>
            </div>
          </div>
        )}

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
                {canUpload && (
                  <th className="p-4 text-center border text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {periods.slice(0, visiblePeriods).map((period) => (
                <tr
                  key={period.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 border whitespace-nowrap">
                    {editingPeriod === period.id ? (
                      <input
                        type="text"
                        value={newPeriodName}
                        onChange={(e) => setNewPeriodName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">
                        {period.name}
                      </div>
                    )}
                  </td>
                  <td className="p-4 border">
                    {editingPeriod === period.id ? (
                      <input
                        type="text"
                        value={newPeriodDescription}
                        onChange={(e) => setNewPeriodDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <div className="text-sm text-gray-500">
                        {period.description}
                      </div>
                    )}
                  </td>
                  <td className="p-4 border whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={period.status.studied}
                      onChange={() =>
                        handleStatusChange(period.id, "studied")
                      }
                      className="h-5 w-5 text-green-500 rounded border-gray-300 focus:ring-green-500 transition"
                    />
                  </td>
                  <td className="p-4 border whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={period.status.recall}
                      onChange={() =>
                        handleStatusChange(period.id, "recall")
                      }
                      className="h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500 transition"
                    />
                  </td>
                  {canUpload && (
                    <td className="p-4 border whitespace-nowrap text-center">
                      {editingPeriod === period.id ? (
                        <div className="flex justify-center gap-2">
                          <Button
                            onClick={saveEdit}
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-800"
                          >
                            <Save size={16} />
                          </Button>
                          <Button
                            onClick={cancelEdit}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <Button
                            onClick={() => startEditing(period.id)}
                            size="sm"
                            variant="outline"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            onClick={() => deletePeriod(period.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      )}
                    </td>
                  )}
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