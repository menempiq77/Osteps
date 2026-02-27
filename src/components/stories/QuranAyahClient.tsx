"use client";

import { useEffect, useMemo, useState } from "react";

type AyahData = {
  ref: string;
  arabic: string;
};

type Props = {
  refs: string[];
};

export default function QuranAyahClient({ refs }: Props) {
  const uniqueRefs = useMemo(() => Array.from(new Set(refs)).filter(Boolean), [refs]);
  const [items, setItems] = useState<AyahData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setError(null);
      setItems(null);

      try {
        const results: AyahData[] = [];
        for (const ref of uniqueRefs) {
          // Arabic Qur'an text (Uthmani script)
          const url = `https://api.alquran.cloud/v1/ayah/${encodeURIComponent(ref)}/quran-uthmani`;
          const res = await fetch(url);
          if (!res.ok) throw new Error(`Failed to fetch ayah ${ref}`);
          const json = (await res.json()) as { data?: { text?: string } };
          const arabic = (json?.data?.text ?? "").trim();
          results.push({ ref, arabic });
        }
        if (cancelled) return;
        setItems(results);
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : "Failed to load verse text");
      }
    }

    if (uniqueRefs.length) {
      void run();
    } else {
      setItems([]);
    }

    return () => {
      cancelled = true;
    };
  }, [uniqueRefs]);

  if (!uniqueRefs.length) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="mb-2 text-sm font-black text-gray-900">Qur’an (Arabic)</div>

      {error ? <div className="text-sm font-bold text-rose-700">{error}</div> : null}

      {items === null && !error ? (
        <div className="text-sm font-bold text-gray-600">Loading verses…</div>
      ) : null}

      {items && items.length ? (
        <div className="grid gap-3">
          {items.map((it) => (
            <div key={it.ref} className="grid gap-1">
              <div className="text-right text-lg leading-relaxed text-gray-900">{it.arabic || "—"}</div>
              <div className="text-xs font-bold text-gray-600">({it.ref})</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
