"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BrainCircuit, ScrollText, Plus, Trash2, Edit, Save, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface Book {
  id: number;
  name: string;
  author: string;
  status: {
    memorized: boolean;
    studied: boolean;
  };
}

export default function HadeesTrackerPage() {
  const { trackerId } = useParams();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [visibleBooks, setVisibleBooks] = useState(5);
  const [editingBook, setEditingBook] = useState<number | null>(null);
  const [newBookName, setNewBookName] = useState("");
  const [newBookAuthor, setNewBookAuthor] = useState("");
  const [isAddingBook, setIsAddingBook] = useState(false);
  const { currentUser } = useSelector((state: RootState) => state.auth);

  const canUpload = currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "TEACHER";

  // Initialize with sample data
  useEffect(() => {
    const initialBooks = [
      { id: 1, name: "Sahih al-Bukhari", author: "Imam Bukhari", status: { memorized: false, studied: false } },
      { id: 2, name: "Sahih Muslim", author: "Imam Muslim", status: { memorized: false, studied: false } },
      { id: 3, name: "Sunan Abu Dawood", author: "Abu Dawood", status: { memorized: false, studied: false } },
      { id: 4, name: "Jami` at-Tirmidhi", author: "At-Tirmidhi", status: { memorized: false, studied: false } },
      { id: 5, name: "Sunan an-Nasa'i", author: "An-Nasa'i", status: { memorized: false, studied: false } },
      { id: 6, name: "Sunan Ibn Majah", author: "Ibn Majah", status: { memorized: false, studied: false } },
      { id: 7, name: "Riyad as-Salihin", author: "Imam Nawawi", status: { memorized: false, studied: false } },
    ];
    setBooks(initialBooks);
  }, []);

  const handleStatusChange = (bookId: number, type: "memorized" | "studied") => {
    setBooks((prev) =>
      prev.map((book) =>
        book.id === bookId
          ? {
              ...book,
              status: { ...book.status, [type]: !book.status[type] },
            }
          : book
      )
    );
  };

  const loadMoreBooks = () => {
    setVisibleBooks((prev) => prev + 5);
  };

  const startEditing = (bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    if (book) {
      setEditingBook(bookId);
      setNewBookName(book.name);
      setNewBookAuthor(book.author);
    }
  };

  const saveEdit = () => {
    if (editingBook && newBookName.trim() && newBookAuthor.trim()) {
      setBooks((prev) =>
        prev.map((book) =>
          book.id === editingBook
            ? { 
                ...book, 
                name: newBookName.trim(),
                author: newBookAuthor.trim()
              }
            : book
        )
      );
      setEditingBook(null);
    }
  };

  const cancelEdit = () => {
    setEditingBook(null);
  };

  const addNewBook = () => {
    if (newBookName.trim() && newBookAuthor.trim()) {
      const newBookId = books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;

      setBooks((prev) => [
        ...prev,
        {
          id: newBookId,
          name: newBookName.trim(),
          author: newBookAuthor.trim(),
          status: { memorized: false, studied: false },
        },
      ]);
      setNewBookName("");
      setNewBookAuthor("");
      setIsAddingBook(false);
    }
  };

  const deleteBook = (bookId: number) => {
    setBooks((prev) => prev.filter((book) => book.id !== bookId));
  };

  // Calculate progress statistics
  const totalBooks = books.length;
  const memorizedCount = books.filter((b) => b.status.memorized).length;
  const studiedCount = books.filter((b) => b.status.studied).length;

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
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hadith Progress Management
            </h1>
            <p className="text-gray-500 mt-1">
              Admin panel for managing Hadith tracking
            </p>
          </div>
          {canUpload && (
            <Button
              onClick={() => setIsAddingBook(true)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              Add Book
            </Button>
          )}
        </div>

        {isAddingBook && (
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row gap-4">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={newBookName}
                onChange={(e) => setNewBookName(e.target.value)}
                placeholder="Enter book name (e.g., Sahih al-Bukhari)"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                value={newBookAuthor}
                onChange={(e) => setNewBookAuthor(e.target.value)}
                placeholder="Enter author name (e.g., Imam Bukhari)"
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={addNewBook}
                variant="default"
                className="flex items-center gap-1"
              >
                <Save size={16} />
                Save
              </Button>
              <Button
                onClick={() => {
                  setIsAddingBook(false);
                  setNewBookName("");
                  setNewBookAuthor("");
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
                {canUpload && (
                  <th className="p-4 text-center border text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {books.slice(0, visibleBooks).map((book) => (
                <tr
                  key={book.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 border whitespace-nowrap">
                    {editingBook === book.id ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={newBookName}
                          onChange={(e) => setNewBookName(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md"
                        />
                        <input
                          type="text"
                          value={newBookAuthor}
                          onChange={(e) => setNewBookAuthor(e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {book.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {book.author}
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="p-4 border whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={book.status.memorized}
                      onChange={() =>
                        handleStatusChange(book.id, "memorized")
                      }
                      className="h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500 transition"
                    />
                  </td>
                  <td className="p-4 border whitespace-nowrap text-center">
                    <input
                      type="checkbox"
                      checked={book.status.studied}
                      onChange={() =>
                        handleStatusChange(book.id, "studied")
                      }
                      className="h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500 transition"
                    />
                  </td>
                  {canUpload && (
                    <td className="p-4 border whitespace-nowrap text-center">
                      {editingBook === book.id ? (
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
                            onClick={() => startEditing(book.id)}
                            size="sm"
                            variant="outline"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            onClick={() => deleteBook(book.id)}
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
              Showing {Math.min(visibleBooks, books.length)} of{" "}
              {books.length} Books
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