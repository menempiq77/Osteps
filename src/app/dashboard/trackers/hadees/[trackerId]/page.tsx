"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BrainCircuit, ScrollText } from "lucide-react";

const books = [
  { id: 1, name: "Sahih al-Bukhari", author: "Imam Bukhari" },
  { id: 2, name: "Sahih Muslim", author: "Imam Muslim" },
  { id: 3, name: "Sunan Abu Dawood", author: "Abu Dawood" },
  { id: 4, name: "Jami` at-Tirmidhi", author: "At-Tirmidhi" },
  { id: 5, name: "Sunan an-Nasa'i", author: "An-Nasa'i" },
  { id: 6, name: "Sunan Ibn Majah", author: "Ibn Majah" },
  { id: 7, name: "Riyad as-Salihin", author: "Imam Nawawi" },
  // Add more books as needed
];

export default function HadeesTrackerPage() {
  const { trackerId } = useParams();
  const router = useRouter();
  const [progress, setProgress] = useState<
    Record<number, { memorized: boolean; studied: boolean }>
  >({});
  const [visibleBooks, setVisibleBooks] = useState(5);

  const handleCheckboxChange = (bookId: number, type: "memorized" | "studied") => {
    setProgress((prev) => ({
      ...prev,
      [bookId]: {
        ...prev[bookId],
        [type]: !prev[bookId]?.[type],
      },
    }));
  };

  const loadMoreBooks = () => {
    setVisibleBooks((prev) => Math.min(prev + 5, books.length));
  };

  const totalBooks = books.length;
  const memorizedCount = Object.values(progress).filter((p) => p?.memorized).length;
  const studiedCount = Object.values(progress).filter((p) => p?.studied).length;

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
            <BrainCircuit size={16} className="text-blue-500" />
            <span className="text-sm font-medium">
              {memorizedCount}/{totalBooks}
            </span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
            <ScrollText size={16} className="text-blue-500" />
            <span className="text-sm font-medium">
              {studiedCount}/{totalBooks}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">
            Hadith Progress Tracker
          </h1>
          <p className="text-gray-500 mt-1">
            Track your memorization and study progress of Hadith collections
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left border text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="p-4 text-center border text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-1">
                    <BrainCircuit size={16} className="text-blue-500" />
                    <span>Memorized</span>
                  </div>
                </th>
                <th className="p-4 text-center border text-sm font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center justify-center gap-1">
                    <ScrollText size={16} className="text-blue-500" />
                    <span>Studied</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {books.slice(0, visibleBooks).map((book) => (
                <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {book.name}
                    </div>
                  </td>
                  <td className="p-4 border whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={progress[book.id]?.memorized || false}
                      onChange={() => handleCheckboxChange(book.id, "memorized")}
                      className="h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500 transition"
                    />
                  </td>
                  <td className="p-4 border whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={progress[book.id]?.studied || false}
                      onChange={() => handleCheckboxChange(book.id, "studied")}
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
              Showing {Math.min(visibleBooks, books.length)} of {books.length}{" "}
              Books
            </div>
            {visibleBooks < books.length && (
              <Button variant="outline" size="sm" onClick={loadMoreBooks}>
                Load More (5)
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}