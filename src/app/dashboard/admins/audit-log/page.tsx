"use client";
import { useEffect, useState } from "react";
import { Alert, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

type Entry = { id: string; actorId: string; actorRole: string; action: string; targetId: string; description: string; timestamp: string };
export default function AuditLogPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [allowed] = useState(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null") as { role?: string } | null;
    return user?.role === "SUPER_ADMIN" || user?.role === "SCHOOL_ADMIN";
  });
  useEffect(() => {
    if (allowed) void fetch("/api/audit-log?limit=500").then((r) => r.json()).then((body: { data?: Entry[] }) => setEntries(body.data || [])).catch(() => {});
  }, [allowed]);
  if (!allowed) return <Alert type="error" message="You are not authorized to view the audit log." />;
  const columns: ColumnsType<Entry> = ["timestamp", "actorRole", "action", "targetId", "description"].map((key) => ({ title: key, dataIndex: key, key }));
  return <div className="p-6"><h1 className="mb-4 text-2xl font-semibold">Audit log</h1><Table rowKey="id" columns={columns} dataSource={entries} /></div>;
}
