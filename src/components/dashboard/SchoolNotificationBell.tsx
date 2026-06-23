"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Badge, Popover } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { RootState } from "@/store/store";
import {
  fetchSchoolNotifications,
  fetchSchoolUnreadCount,
  markAllSchoolNotificationsRead,
  markSchoolNotificationRead,
  type SchoolNotificationItem,
} from "@/services/schoolNotificationsApi";

const iconFor = (type: string) => {
  switch (type) {
    case "enrollment_request":
      return "🧑‍🎓";
    default:
      return "🔔";
  }
};

export default function SchoolNotificationBell() {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const role = String(currentUser?.role || "").toUpperCase();
  const enabled = role === "SCHOOL_ADMIN" || role === "HOD" || role === "TEACHER";

  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState<SchoolNotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshCount = useCallback(async () => {
    try {
      setUnread(await fetchSchoolUnreadCount());
    } catch {
      /* ignore */
    }
  }, []);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchSchoolNotifications();
      setItems(res.notifications || []);
      setUnread(res.unread_count || 0);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    void refreshCount();
    pollRef.current = setInterval(() => void refreshCount(), 60000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [enabled, refreshCount]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) void loadList();
  };

  const handleMarkAll = async () => {
    try {
      await markAllSchoolNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnread(0);
    } catch {
      /* ignore */
    }
  };

  const handleClick = async (n: SchoolNotificationItem) => {
    if (!n.is_read) {
      try {
        await markSchoolNotificationRead(n.id);
        setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, is_read: true } : x)));
        setUnread((u) => Math.max(0, u - 1));
      } catch {
        /* ignore */
      }
    }
    if (n.url) {
      setOpen(false);
      router.push(n.url);
    }
  };

  if (!enabled) return null;

  const content = (
    <div className="w-[340px] max-w-[90vw]">
      <div className="flex items-center justify-between border-b border-slate-100 px-1 pb-2">
        <span className="text-sm font-bold text-slate-800">Notifications</span>
        {unread > 0 && (
          <button
            onClick={handleMarkAll}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            Mark all read
          </button>
        )}
      </div>
      <div className="max-h-[60vh] overflow-auto py-1">
        {loading ? (
          <div className="py-10 text-center text-sm text-slate-400">Loading…</div>
        ) : items.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">
            You&apos;re all caught up.
          </div>
        ) : (
          items.map((n) => (
            <button
              key={n.id}
              onClick={() => void handleClick(n)}
              className={`flex w-full items-start gap-3 rounded-xl px-2.5 py-2.5 text-left transition hover:bg-slate-50 ${
                n.is_read ? "" : "bg-[color-mix(in_srgb,var(--primary)_8%,white)]"
              }`}
            >
              <span className="mt-0.5 text-lg leading-none">{iconFor(n.type)}</span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-slate-800">
                    {n.title}
                  </span>
                  {!n.is_read && (
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: "var(--primary)" }}
                    />
                  )}
                </span>
                {n.message && (
                  <span className="mt-0.5 block text-[13px] leading-snug text-slate-500">
                    {n.message}
                  </span>
                )}
                {n.time_ago && (
                  <span className="mt-0.5 block text-[11px] text-slate-400">{n.time_ago}</span>
                )}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <Popover
      open={open}
      onOpenChange={handleOpenChange}
      trigger="click"
      placement="bottomRight"
      content={content}
      overlayInnerStyle={{ padding: 12, borderRadius: 16 }}
    >
      <button
        type="button"
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/[0.08] text-white shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white/20 active:scale-95"
        aria-label="Notifications"
        title="Notifications"
      >
        <Badge count={unread} size="small" offset={[2, -2]}>
          <BellOutlined style={{ fontSize: 16, color: "#FBBF24" }} />
        </Badge>
      </button>
    </Popover>
  );
}
