"use client";

import { useEffect, useState } from "react";
import { Modal, message, Tooltip } from "antd";
import { CopyOutlined, ReloadOutlined, LinkOutlined } from "@ant-design/icons";
import { fetchJoinCode, regenerateJoinCode } from "@/services/classEnrollmentApi";

interface Props {
  open: boolean;
  onClose: () => void;
  classId: string | number | null;
  className?: string;
}

export default function ClassJoinLinkModal({ open, onClose, classId, className }: Props) {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState("");
  const [regenerating, setRegenerating] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const link = code ? `${origin}/join/${code}` : "";

  useEffect(() => {
    if (!open || !classId) return;
    let active = true;
    setLoading(true);
    setError("");
    setCode("");
    (async () => {
      try {
        const res = await fetchJoinCode(classId);
        if (active) setCode(res.join_code);
      } catch {
        if (active) setError("Could not load the join link. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [open, classId]);

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      messageApi.success(`${label} copied`);
    } catch {
      messageApi.error("Could not copy — please copy it manually.");
    }
  };

  const regenerate = async () => {
    if (!classId) return;
    setRegenerating(true);
    try {
      const res = await regenerateJoinCode(classId);
      setCode(res.join_code);
      messageApi.success("New link generated — the old one no longer works.");
    } catch {
      messageApi.error("Could not regenerate the link.");
    } finally {
      setRegenerating(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={
        <span className="flex items-center gap-2">
          <LinkOutlined style={{ color: "var(--primary)" }} />
          Share class join link
        </span>
      }
      destroyOnClose
    >
      {contextHolder}
      <p className="mt-1 text-sm text-slate-500">
        Share this link with students of{" "}
        <span className="font-semibold text-slate-700">{className}</span>. They fill in their
        details and you confirm them before they&apos;re added to the class.
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-slate-400">Loading…</div>
      ) : error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Join code
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-lg font-bold tracking-[0.2em] text-slate-800">
                {code}
              </code>
              <Tooltip title="Copy code">
                <button
                  onClick={() => copy(code, "Code")}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-slate-600 hover:bg-slate-50"
                >
                  <CopyOutlined />
                </button>
              </Tooltip>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Shareable link
            </label>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={link}
                className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
              />
              <button
                onClick={() => copy(link, "Link")}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white"
                style={{ background: "var(--primary)" }}
              >
                <CopyOutlined /> Copy
              </button>
            </div>
          </div>

          <button
            onClick={regenerate}
            disabled={regenerating}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 disabled:opacity-50"
          >
            <ReloadOutlined spin={regenerating} /> Generate a new link (invalidates the old one)
          </button>
        </div>
      )}
    </Modal>
  );
}
