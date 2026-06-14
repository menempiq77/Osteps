"use client";

import { useState } from "react";
import { Button, Input, Popconfirm, Segmented, Tag, message } from "antd";
import { useQuery } from "@tanstack/react-query";
import {
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { updateStudentSupport } from "@/services/studentsApi";
import {
  StudentSupportComment,
  createStudentSupportComment,
  deleteStudentSupportComment,
  fetchStudentSupportComments,
  updateStudentSupportComment,
} from "@/services/studentSupportCommentApi";

const formatDate = (value?: string | null) => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
};

function CommentCard({
  comment,
  subjectId,
  canEdit,
  onChanged,
}: {
  comment: StudentSupportComment;
  subjectId: number | null;
  canEdit: boolean;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(comment.comment);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!text.trim()) {
      message.error("Comment cannot be empty");
      return;
    }
    setBusy(true);
    try {
      await updateStudentSupportComment(comment.id, text.trim(), subjectId);
      message.success("Comment updated");
      setEditing(false);
      onChanged();
    } catch {
      message.error("Could not update comment");
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await deleteStudentSupportComment(comment.id);
      message.success("Comment deleted");
      onChanged();
    } catch {
      message.error("Could not delete comment");
    } finally {
      setBusy(false);
    }
  };

  if (editing) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
        <Input.TextArea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button
            size="small"
            icon={<CloseOutlined />}
            onClick={() => {
              setText(comment.comment);
              setEditing(false);
            }}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<SaveOutlined />}
            loading={busy}
            onClick={save}
            style={{ background: "var(--primary)", borderColor: "var(--primary)" }}
          >
            Save
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="m-0 whitespace-pre-wrap text-slate-700">{comment.comment}</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-400">
          {comment.author_name ? <Tag color="default">{comment.author_name}</Tag> : null}
          {comment.created_at ? <span>{formatDate(comment.created_at)}</span> : null}
        </div>
        {canEdit ? (
          <div className="no-print flex gap-1">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={() => setEditing(true)}
            />
            <Popconfirm
              title="Delete this comment?"
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={remove}
            >
              <Button size="small" type="text" danger icon={<DeleteOutlined />} loading={busy} />
            </Popconfirm>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function SupportWellbeingEditor({
  studentId,
  subjectId,
  isSen,
  senDetails,
  canEdit,
  onChanged,
}: {
  studentId: number;
  subjectId: number | null;
  isSen: boolean;
  senDetails: string;
  canEdit: boolean;
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sen, setSen] = useState(isSen);
  const [details, setDetails] = useState(senDetails);

  const [adding, setAdding] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [addingBusy, setAddingBusy] = useState(false);

  const {
    data: comments = [],
    refetch: refetchComments,
  } = useQuery({
    queryKey: ["student-support-comments", studentId, subjectId],
    queryFn: () => fetchStudentSupportComments(studentId, subjectId),
    enabled: !!studentId,
    staleTime: 60 * 1000,
  });

  const startEdit = () => {
    setSen(isSen);
    setDetails(senDetails);
    setEditing(true);
  };

  const save = async () => {
    if (!studentId) {
      message.error("Missing student id");
      return;
    }
    setSaving(true);
    try {
      await updateStudentSupport(
        studentId,
        { is_sen: sen, sen_details: sen ? details.trim() : "" },
        subjectId
      );
      message.success("Support information saved");
      setEditing(false);
      onChanged();
    } catch (err) {
      message.error(
        err instanceof Error ? err.message : "Could not save support info"
      );
    } finally {
      setSaving(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) {
      message.error("Comment cannot be empty");
      return;
    }
    setAddingBusy(true);
    try {
      await createStudentSupportComment(
        { student_id: studentId, comment: newComment.trim() },
        subjectId
      );
      message.success("Comment added");
      setNewComment("");
      setAdding(false);
      refetchComments();
    } catch {
      message.error("Could not add comment");
    } finally {
      setAddingBusy(false);
    }
  };

  return (
    <div>
      {editing ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                Extra support
              </label>
              <Segmented
                value={sen ? "Yes" : "No"}
                onChange={(v) => setSen(v === "Yes")}
                options={["No", "Yes"]}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold uppercase text-slate-500">
                Support details
              </label>
              <Input.TextArea
                rows={4}
                value={details}
                disabled={!sen}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={
                  sen
                    ? "Describe the kind of support this student needs (SEN, EAL, medical, pastoral, accommodations, interventions…)"
                    : "Set Extra support to “Yes” to add details"
                }
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <Button
              icon={<CloseOutlined />}
              onClick={() => setEditing(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={save}
              style={{ background: "var(--primary)", borderColor: "var(--primary)" }}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="m-0 text-[11px] font-semibold uppercase text-slate-500">
                Extra support
              </p>
              <p className="m-0 mt-1 font-semibold text-slate-800">
                {isSen ? "Yes" : "No"}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 sm:col-span-2">
              <p className="m-0 text-[11px] font-semibold uppercase text-slate-500">
                Support details
              </p>
              <p className="m-0 mt-1 whitespace-pre-wrap text-slate-700">
                {senDetails || "No support details recorded."}
              </p>
            </div>
          </div>
          {canEdit ? (
            <div className="no-print mt-3 flex justify-end">
              <Button icon={<EditOutlined />} onClick={startEdit}>
                {senDetails || isSen ? "Edit support info" : "Add support info"}
              </Button>
            </div>
          ) : null}
        </div>
      )}

      {/* Support comments thread */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <p className="m-0 text-sm font-semibold text-slate-700">
              Support comments
            </p>
            <p className="m-0 text-xs text-slate-400">
              Ongoing notes about this student&apos;s support &amp; wellbeing
            </p>
          </div>
          {canEdit && !adding ? (
            <Button
              className="no-print"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setAdding(true)}
            >
              Add comment
            </Button>
          ) : null}
        </div>

        {canEdit && adding ? (
          <div className="no-print mb-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <Input.TextArea
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a new support comment…"
            />
            <div className="mt-2 flex justify-end gap-2">
              <Button
                size="small"
                icon={<CloseOutlined />}
                onClick={() => {
                  setNewComment("");
                  setAdding(false);
                }}
                disabled={addingBusy}
              >
                Cancel
              </Button>
              <Button
                size="small"
                type="primary"
                icon={<SaveOutlined />}
                loading={addingBusy}
                onClick={addComment}
                style={{ background: "var(--primary)", borderColor: "var(--primary)" }}
              >
                Add comment
              </Button>
            </div>
          </div>
        ) : null}

        {comments.length === 0 ? (
          <p className="m-0 text-sm text-slate-400">No support comments yet.</p>
        ) : (
          <div className="space-y-2">
            {comments.map((c) => (
              <CommentCard
                key={c.id}
                comment={c}
                subjectId={subjectId}
                canEdit={canEdit}
                onChanged={() => refetchComments()}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
