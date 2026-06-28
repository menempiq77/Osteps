"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlenaryLandingPage() {
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed) router.push(`/plenary/${trimmed}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center">
      <div className="mx-auto max-w-sm px-4 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal-600 text-3xl text-white mb-4">
          &#x1F4AC;
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Join Plenary</h1>
        <p className="text-sm text-gray-500 mb-6">Enter the code shown on your teacher&apos;s screen</p>
        <input
          type="text"
          className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-center font-mono text-2xl font-bold tracking-widest uppercase focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
          placeholder="CODE"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={20}
          onKeyDown={(e) => { if (e.key === "Enter") handleJoin(); }}
        />
        <button
          type="button"
          className="mt-4 w-full rounded-lg bg-teal-600 py-3 text-lg font-semibold text-white hover:bg-teal-700 disabled:opacity-50"
          onClick={handleJoin}
          disabled={!code.trim()}
        >
          Join
        </button>
      </div>
    </div>
  );
}
