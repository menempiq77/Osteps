"use client";

import { useState } from "react";
import { Button, Empty, Input, Select, Tag, message } from "antd";
import {
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  StudentNarrativeReport,
  StudentNarrativeReportInput,
  createStudentNarrativeReport,
  updateStudentNarrativeReport,
} from "@/services/studentNarrativeReportApi";

const RATING_OPTIONS = [
  "Outstanding",
  "Good",
  "Satisfactory",
  "Needs improvement",
];

type FormState = {
  effort: string;
  conduct: string;
  attainment: string;
  strengths: string;
  targets: string;
  comment: string;
};

const EMPTY: FormState = {
  effort: "",
  conduct: "",
  attainment: "",
  strengths: "",
  targets: "",
  comment: "",
};

const formatDate = (value?: string | null) => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString();
};

function ReportForm({
  initial,
  saving,
  onCancel,
  onSave,
}: {
  initial: FormState;
  saving: boolean;
  onCancel?: () => void;
  onSave: (values: FormState) => void;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const set = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {(["effort", "conduct", "attainment"] as const).map((key) => (
          <div key={key}>
            <label className="mb-1 block text-xs font-semibold capitalize text-slate-500">
              {key}
            </label>
            <Select
              className="w-full"
              allowClear
              placeholder="Select"
              value={form[key] || undefined}
              onChange={(v) => set(key, v ?? "")}
              options={RATING_OPTIONS.map((o) => ({ value: o, label: o }))}
            />
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Strengths
          </label>
          <Input.TextArea
            rows={2}
            value={form.strengths}
            onChange={(e) => set("strengths", e.target.value)}
            placeholder="What this student does well…"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Targets / areas for improvement
          </label>
          <Input.TextArea
            rows={2}
            value={form.targets}
            onChange={(e) => set("targets", e.target.value)}
            placeholder="What to work on next…"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-500">
            Report / comment
          </label>
          <Input.TextArea
            rows={4}
            value={form.comment}
            onChange={(e) => set("comment", e.target.value)}
            placeholder="Full written report for this student…"
          />
        </div>
      </div>
      <div className="mt-3 flex justify-end gap-2">
        {onCancel ? (
          <Button icon={<CloseOutlined />} onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        ) : null}
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={saving}
          onClick={() => onSave(form)}
          style={{
            background: "var(--primary)",
            borderColor: "var(--primary)",
          }}
        >
          Save report
        </Button>
      </div>
    </div>
  );
}

function ReportCard({
  report,
  onEdited,
  subjectId,
}: {
  report: StudentNarrativeReport;
  onEdited: () => void;
  subjectId: number | null;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const save = async (values: FormState) => {
    setSaving(true);
    try {
      await updateStudentNarrativeReport(report.id, values, subjectId);
      message.success("Report updated");
      setEditing(false);
      onEdited();
    } catch {
      message.error("Could not update report");
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <ReportForm
        initial={{
          effort: report.effort ?? "",
          conduct: report.conduct ?? "",
          attainment: report.attainment ?? "",
          strengths: report.strengths ?? "",
          targets: report.targets ?? "",
          comment: report.comment ?? "",
        }}
        saving={saving}
        onCancel={() => setEditing(false)}
        onSave={save}
      />
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {report.effort ? <Tag color="blue">Effort: {report.effort}</Tag> : null}
          {report.conduct ? <Tag color="green">Conduct: {report.conduct}</Tag> : null}
          {report.attainment ? (
            <Tag color="purple">Attainment: {report.attainment}</Tag>
          ) : null}
        </div>
        <Button
          size="small"
          icon={<EditOutlined />}
          onClick={() => setEditing(true)}
          className="no-print"
        >
          Edit
        </Button>
      </div>
      {report.strengths ? (
        <p className="m-0 mb-2 text-sm text-slate-700">
          <span className="font-semibold text-slate-500">Strengths: </span>
          {report.strengths}
        </p>
      ) : null}
      {report.targets ? (
        <p className="m-0 mb-2 text-sm text-slate-700">
          <span className="font-semibold text-slate-500">Targets: </span>
          {report.targets}
        </p>
      ) : null}
      {report.comment ? (
        <p className="m-0 whitespace-pre-wrap text-sm text-slate-700">{report.comment}</p>
      ) : null}
      <p className="m-0 mt-3 text-[11px] text-slate-400">
        {report.author_name ? `By ${report.author_name}` : "—"}
        {report.updated_at ? ` · ${formatDate(report.updated_at)}` : ""}
      </p>
    </div>
  );
}

export default function TeacherReportEditor({
  studentId,
  subjectId,
  reports,
  onChanged,
}: {
  studentId: number;
  subjectId: number | null;
  reports: StudentNarrativeReport[];
  onChanged: () => void;
}) {
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const create = async (values: FormState) => {
    if (
      !values.comment.trim() &&
      !values.strengths.trim() &&
      !values.targets.trim()
    ) {
      message.warning("Please write a report, strengths or targets before saving.");
      return;
    }
    setSaving(true);
    try {
      const payload: StudentNarrativeReportInput = {
        student_id: studentId,
        subject_id: subjectId,
        ...values,
      };
      await createStudentNarrativeReport(payload, subjectId);
      message.success("Report saved");
      setAdding(false);
      onChanged();
    } catch {
      message.error("Could not save report");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      {!adding ? (
        <div className="no-print flex justify-end">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAdding(true)}
            style={{ background: "var(--primary)", borderColor: "var(--primary)" }}
          >
            Write report
          </Button>
        </div>
      ) : (
        <div className="no-print">
          <ReportForm
            initial={EMPTY}
            saving={saving}
            onCancel={() => setAdding(false)}
            onSave={create}
          />
        </div>
      )}

      {reports.length === 0 && !adding ? (
        <Empty
          description="No teacher reports yet."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <ReportCard
              key={r.id}
              report={r}
              subjectId={subjectId}
              onEdited={onChanged}
            />
          ))}
        </div>
      )}
    </div>
  );
}
