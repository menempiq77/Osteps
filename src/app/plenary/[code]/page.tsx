"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface PlenaryComment {
  id: string;
  name: string;
  comment: string;
  createdAt: number;
}

const API_BASE = typeof window !== "undefined" ? window.location.origin : "";

export default function PlenaryPage() {
  const params = useParams();
  const code = params.code as string;
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [comments, setComments] = useState<PlenaryComment[]>([]);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/plenary/${code}`);
      const data = await res.json();
      setComments(data.comments ?? []);
    } catch {
      // ignore
    }
  }, [code]);

  useEffect(() => {
    fetchComments();
    const interval = setInterval(fetchComments, 3000);
    return () => clearInterval(interval);
  }, [fetchComments]);

  const handleSubmit = async () => {
    if (!name.trim() || !comment.trim()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(`${API_BASE}/api/plenary/${code}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), comment: comment.trim() }),
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      setSubmitted(true);
      fetchComments();
    } catch {
      setSubmitError("Couldn't share your response. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="mx-auto max-w-lg px-4 py-8">
        <div className="mb-6 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal-600 text-2xl text-white mb-3">
            &#x1F4AC;
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Plenary — Share Your Learning</h1>
          <p className="mt-1 text-sm text-gray-500">Code: <span className="font-mono font-bold text-teal-600">{code}</span></p>
        </div>

        {!submitted ? (
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
            <input
              type="text"
              className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
            />
            <label className="block text-sm font-semibold text-gray-700 mb-1">What did you learn today?</label>
            <textarea
              className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
              placeholder="Share one thing you learned from this lesson..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <button
              type="button"
              className="w-full rounded-lg bg-teal-600 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
              onClick={handleSubmit}
              disabled={submitting || !name.trim() || !comment.trim()}
            >
              {submitting ? "Sending..." : "Share My Learning"}
            </button>
            {submitError && (
              <p className="mt-3 text-sm font-medium text-red-600">{submitError}</p>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 text-center shadow-sm">
            <div className="text-4xl mb-2">&#x2705;</div>
            <h2 className="text-lg font-bold text-green-800">Thank you, {name}!</h2>
            <p className="mt-1 text-sm text-green-600">Your response has been shared with the class.</p>
            <button
              type="button"
              className="mt-4 rounded-lg border border-green-300 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
              onClick={() => { setSubmitted(false); setComment(""); }}
            >
              Share Another Response
            </button>
          </div>
        )}

        {comments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-gray-600 mb-3">Class Responses ({comments.length})</h3>
            <div className="space-y-2">
              {[...comments].reverse().map((c) => (
                <div key={c.id} className="rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
                  <div className="text-xs font-bold text-teal-600">{c.name}</div>
                  <div className="mt-1 text-sm text-gray-700">{c.comment}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
