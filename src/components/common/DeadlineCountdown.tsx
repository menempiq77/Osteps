"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function useNow(tickMs: number) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), tickMs);
    return () => clearInterval(t);
  }, [tickMs]);

  return now;
}

export function DeadlineCountdown({
  deadline,
  className,
  showDate = true,
}: {
  deadline?: string | null;
  className?: string;
  showDate?: boolean;
}) {
  const now = useNow(30_000); // update every 30s (cheap, still feels "live")

  const parsed = useMemo(() => {
    if (!deadline) return null;
    const d = dayjs(deadline, "YYYY-MM-DD", true);
    if (!d.isValid()) return null;
    // Treat deadline as end-of-day in user's local timezone.
    return d.endOf("day");
  }, [deadline]);

  const content = useMemo(() => {
    if (!deadline || !parsed) {
      return <span className="text-gray-400">No deadline</span>;
    }

    const nowD = dayjs(now);
    const isOverdue = nowD.isAfter(parsed);
    const human = isOverdue ? parsed.from(nowD) : nowD.to(parsed);

    const badgeClass = isOverdue
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-amber-50 text-amber-800 border-amber-200";

    return (
      <span className="inline-flex items-center gap-2">
        {showDate && <span className="text-gray-700">{deadline}</span>}
        <span
          className={[
            "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
            badgeClass,
          ].join(" ")}
        >
          {isOverdue ? `Overdue ${human}` : `Due ${human}`}
        </span>
      </span>
    );
  }, [deadline, parsed, now, showDate]);

  return <span className={className}>{content}</span>;
}

