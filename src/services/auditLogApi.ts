export type AuditEvent = {
  actorId: string | number;
  actorRole: string;
  action: string;
  targetId: string | number;
  description: string;
  timestamp?: string;
};

export const recordAuditEvent = (event: AuditEvent) => {
  if (typeof window === "undefined") return;
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null") as { id?: string | number; role?: string } | null;
  const payload = {
    ...event,
    actorId: String(event.actorId ?? currentUser?.id ?? "unknown"),
    actorRole: event.actorRole || currentUser?.role || "unknown",
    targetId: String(event.targetId),
    timestamp: event.timestamp || new Date().toISOString(),
  };
  void fetch("/api/audit-log", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), keepalive: true }).catch(() => {});
};
