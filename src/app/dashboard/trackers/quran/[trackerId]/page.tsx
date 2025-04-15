"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, BrainCircuit, Languages } from "lucide-react";

const chapters = [
  { number: 1, name: "Al-Fatihah (the Opening)" },
  { number: 2, name: "Al-Baqarah (the Cow)" },
  { number: 3, name: "Aali Imran (the Family of Imran)" },
  { number: 4, name: "An-Nisa (the Women)" },
  { number: 5, name: "Al-Ma'idah (the Table)" },
  { number: 6, name: "Al-An'am (the Cattle)" },
  { number: 7, name: "Al-A'raf (the Heights)" },
  { number: 8, name: "Al-Anfal (the Spoils of War)" },
  { number: 9, name: "At-Taubah (the Repentance)" },
  { number: 10, name: "Yunus (Yunus)" },
  { number: 11, name: "Hud (Hud)" },
  { number: 12, name: "Yusuf (Yusuf)" },
  { number: 13, name: "Ar-Ra'd (the Thunder)" },
  { number: 14, name: "Ibrahim (Ibrahim)" },
  { number: 15, name: "Al-Hijr (the Rocky Tract)" },
  { number: 16, name: "An-Nahl (the Bees)" },
  { number: 17, name: "Al-Isra' (the Night Journey)" },
  { number: 18, name: "Al-Kahf (the Cave)" },
  { number: 19, name: "Maryam (Maryam)" },
  { number: 20, name: "Ta-Ha (Ta-Ha)" },
  { number: 21, name: "Al-Anbiya' (the Prophets)" },
  { number: 22, name: "Al-Hajj (the Pilgrimage)" },
  { number: 23, name: "Al-Mu'minun (the Believers)" },
  // Add more chapters as needed up to 114
];

export default function QuranTrackerPage() {
  const { trackerId } = useParams();
  const router = useRouter();
  const [progress, setProgress] = useState<Record<number, { r: boolean; m: boolean; t: boolean }>>({});
  const [visibleChapters, setVisibleChapters] = useState(10);

  const handleCheckboxChange = (chapterNumber: number, type: 'r' | 'm' | 't') => {
    setProgress(prev => ({
      ...prev,
      [chapterNumber]: {
        ...prev[chapterNumber],
        [type]: !prev[chapterNumber]?.[type]
      }
    }));
  };

  const loadMoreChapters = () => {
    setVisibleChapters(prev => Math.min(prev + 10, chapters.length));
  };

  // Calculate progress statistics based on all chapters, not just visible ones
  const totalChapters = chapters.length;
  const readCount = Object.values(progress).filter(p => p?.r).length;
  const memorizedCount = Object.values(progress).filter(p => p?.m).length;
  const tafsirCount = Object.values(progress).filter(p => p?.t).length;

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
            <span className="text-sm font-medium">{readCount}/{totalChapters}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
            <BrainCircuit size={16} className="text-blue-500" />
            <span className="text-sm font-medium">{memorizedCount}/{totalChapters}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
            <Languages size={16} className="text-purple-500" />
            <span className="text-sm font-medium">{tafsirCount}/{totalChapters}</span>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Quran Progress Tracker</h1>
          <p className="text-gray-500 mt-1">Track your reading, memorization, and study progress</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 ">
              <tr>
                <th className="p-4 text-left border text-sm font-medium text-gray-500 uppercase tracking-wider">Surah</th>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {chapters.slice(0, visibleChapters).map((chapter) => (
                <tr key={chapter.number} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 w-[70%] border whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 font-medium">
                        {chapter.number}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{chapter.name.split(' (')[0]}</div>
                        <div className="text-sm text-gray-500">{chapter.name.match(/\((.*)\)/)?.[1]}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 w-[10%] border whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={progress[chapter.number]?.r || false}
                      onChange={() => handleCheckboxChange(chapter.number, 'r')}
                      className="h-5 w-5 text-green-500 rounded border-gray-300 focus:ring-green-500 transition"
                    />
                  </td>
                  <td className="p-4 w-[10%] border whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={progress[chapter.number]?.m || false}
                      onChange={() => handleCheckboxChange(chapter.number, 'm')}
                      className="h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500 transition"
                    />
                  </td>
                  <td className="p-4 w-[10%] border whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={progress[chapter.number]?.t || false}
                      onChange={() => handleCheckboxChange(chapter.number, 't')}
                      className="h-5 w-5 text-purple-500 rounded border-gray-300 focus:ring-purple-500 transition"
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
              Showing {Math.min(visibleChapters, chapters.length)} of {chapters.length} Surahs
            </div>
            {visibleChapters < chapters.length && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={loadMoreChapters}
              >
                Load More (10)
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}