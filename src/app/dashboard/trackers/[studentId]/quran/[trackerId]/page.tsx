"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  Languages,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Chapter {
  number: number;
  name: string;
  status: {
    read: boolean;
    memorized: boolean;
    tafsir: boolean;
  };
}

export default function QuranTrackerAdminPage() {
  const { trackerId } = useParams();
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [visibleChapters, setVisibleChapters] = useState(10);
  const [editingChapter, setEditingChapter] = useState<number | null>(null);
  const [newChapterName, setNewChapterName] = useState("");
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "TEACHER";

  // Initialize with sample data
  useEffect(() => {
    const initialChapters = [
      {
        number: 1,
        name: "Al-Fatihah (the Opening)",
        status: { read: false, memorized: false, tafsir: false },
      },
      {
        number: 2,
        name: "Al-Baqarah (the Cow)",
        status: { read: false, memorized: false, tafsir: false },
      },
      // Add more chapters as needed...
    ].slice(0, 20); // Start with 20 chapters
    setChapters(initialChapters);
  }, []);

  const handleStatusChange = (
    chapterNumber: number,
    type: "read" | "memorized" | "tafsir"
  ) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.number === chapterNumber
          ? {
              ...chapter,
              status: { ...chapter.status, [type]: !chapter.status[type] },
            }
          : chapter
      )
    );
  };

  const loadMoreChapters = () => {
    setVisibleChapters((prev) => prev + 10);
  };

  const startEditing = (chapterNumber: number) => {
    const chapter = chapters.find((c) => c.number === chapterNumber);
    if (chapter) {
      setEditingChapter(chapterNumber);
      setNewChapterName(chapter.name);
    }
  };

  const saveEdit = () => {
    if (editingChapter && newChapterName.trim()) {
      setChapters((prev) =>
        prev.map((chapter) =>
          chapter.number === editingChapter
            ? { ...chapter, name: newChapterName.trim() }
            : chapter
        )
      );
      setEditingChapter(null);
    }
  };

  const cancelEdit = () => {
    setEditingChapter(null);
  };

  const addNewChapter = () => {
    if (newChapterName.trim()) {
      const newChapterNumber =
        chapters.length > 0
          ? Math.max(...chapters.map((c) => c.number)) + 1
          : 1;

      setChapters((prev) => [
        ...prev,
        {
          number: newChapterNumber,
          name: newChapterName.trim(),
          status: { read: false, memorized: false, tafsir: false },
        },
      ]);
      setNewChapterName("");
      setIsAddingChapter(false);
    }
  };

  const deleteChapter = (chapterNumber: number) => {
    setChapters((prev) =>
      prev.filter((chapter) => chapter.number !== chapterNumber)
    );
  };

  // Calculate progress statistics
  const totalChapters = chapters.length;
  const readCount = chapters.filter((c) => c.status.read).length;
  const memorizedCount = chapters.filter((c) => c.status.memorized).length;
  const tafsirCount = chapters.filter((c) => c.status.tafsir).length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Button>

        <div className="flex gap-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
            <BookOpen size={16} className="text-green-500" />
            <span className="text-sm font-medium">
              {readCount}/{totalChapters}
            </span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
            <BrainCircuit size={16} className="text-blue-500" />
            <span className="text-sm font-medium">
              {memorizedCount}/{totalChapters}
            </span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
            <Languages size={16} className="text-purple-500" />
            <span className="text-sm font-medium">
              {tafsirCount}/{totalChapters}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quran Progress Management
            </h1>
            <p className="text-gray-500 mt-1">
              Admin panel for managing Quran tracking
            </p>
          </div>
          {canUpload && (
            <Button
              onClick={() => setIsAddingChapter(true)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              Add Surah
            </Button>
          )}
        </div>

        {isAddingChapter && (
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center gap-4">
            <input
              type="text"
              value={newChapterName}
              onChange={(e) => setNewChapterName(e.target.value)}
              placeholder="Enter surah name (e.g., Al-Fatihah (the Opening))"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <div className="flex gap-2">
              <Button
                onClick={addNewChapter}
                variant="default"
                className="flex items-center gap-1"
              >
                <Save size={16} />
                Save
              </Button>
              <Button
                onClick={() => {
                  setIsAddingChapter(false);
                  setNewChapterName("");
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
                  Surah
                </th>
                <th className="p-4 text-center border text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-1">
                    <BookOpen size={16} className="text-green-500" />
                    <span>Read</span>
                  </div>
                </th>
                <th className="p-4 text-center border text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-1">
                    <BrainCircuit size={16} className="text-blue-500" />
                    <span>Memorized</span>
                  </div>
                </th>
                <th className="p-4 text-center border text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-1">
                    <Languages size={16} className="text-purple-500" />
                    <span>Tafsir</span>
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
              {chapters.slice(0, visibleChapters).map((chapter) => (
                <tr
                  key={chapter.number}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 border whitespace-nowrap">
                    {editingChapter === chapter.number ? (
                      <input
                        type="text"
                        value={newChapterName}
                        onChange={(e) => setNewChapterName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-medium">
                          {chapter.number}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {chapter.name.split(" (")[0]}
                          </div>
                          <div className="text-sm text-gray-500">
                            {chapter.name.match(/\((.*)\)/)?.[1]}
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-4 border whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={chapter.status.read}
                      onChange={() =>
                        handleStatusChange(chapter.number, "read")
                      }
                      className="h-5 w-5 text-green-500 rounded border-gray-300 focus:ring-green-500 transition"
                    />
                  </td>
                  <td className="p-4 border whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={chapter.status.memorized}
                      onChange={() =>
                        handleStatusChange(chapter.number, "memorized")
                      }
                      className="h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500 transition"
                    />
                  </td>
                  <td className="p-4 border whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={chapter.status.tafsir}
                      onChange={() =>
                        handleStatusChange(chapter.number, "tafsir")
                      }
                      className="h-5 w-5 text-purple-500 rounded border-gray-300 focus:ring-purple-500 transition"
                    />
                  </td>
                  {canUpload && (
                    <td className="p-4 border whitespace-nowrap text-center">
                      {editingChapter === chapter.number ? (
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
                            onClick={() => startEditing(chapter.number)}
                            size="sm"
                            variant="outline"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            onClick={() => deleteChapter(chapter.number)}
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
              Showing {Math.min(visibleChapters, chapters.length)} of{" "}
              {chapters.length} Surahs
            </div>
            {visibleChapters < chapters.length && (
              <Button variant="outline" size="sm" onClick={loadMoreChapters}>
                Load More (10)
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
