"use client";

import { useState } from "react";
import { Button, Input, Segmented, message } from "antd";
import {
  CloseOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { updateStudentSupport } from "@/services/studentsApi";

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

  if (editing) {
    return (
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
    );
  }

  return (
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
  );
}
