"use client";

import { useCallback, useEffect, useState } from "react";
import { Modal, message, Popconfirm } from "antd";
import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  fetchEnrollmentRequests,
  approveEnrollmentRequest,
  deleteEnrollmentRequest,
  updateEnrollmentRequest,
  type EnrollmentRequest,
} from "@/services/classEnrollmentApi";

interface Props {
  open: boolean;
  onClose: () => void;
  classId: string | number | null;
  className?: string;
  onChanged?: () => void;
}

type EditState = {
  first_name: string;
  last_name: string;
  gender: string;
  nationality: string;
  user_name: string;
  needs_support: boolean;
  support_details: string;
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-emerald-500";

export default function ClassEnrollmentReviewModal({
  open,
  onClose,
  classId,
  className,
  onChanged,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<EnrollmentRequest[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const load = useCallback(async () => {
    if (!classId) return;
    setLoading(true);
    try {
      const res = await fetchEnrollmentRequests({ status: "pending", class_id: classId });
      setItems(res);
    } catch {
      messageApi.error("Could not load signups.");
    } finally {
      setLoading(false);
    }
  }, [classId, messageApi]);

  useEffect(() => {
    if (open) {
      setEditingId(null);
      setEdit(null);
      void load();
    }
  }, [open, load]);

  const startEdit = (r: EnrollmentRequest) => {
    setEditingId(r.id);
    setEdit({
      first_name: r.first_name,
      last_name: r.last_name,
      gender: r.gender || "",
      nationality: r.nationality || "",
      user_name: r.user_name,
      needs_support: r.needs_support,
      support_details: r.support_details || "",
    });
  };

  const saveEdit = async (id: number) => {
    if (!edit) return;
    setBusyId(id);
    try {
      await updateEnrollmentRequest(id, {
        first_name: edit.first_name,
        last_name: edit.last_name,
        gender: edit.gender || null,
        nationality: edit.nationality || null,
        user_name: edit.user_name,
        needs_support: edit.needs_support,
        support_details: edit.needs_support ? edit.support_details : null,
      });
      messageApi.success("Saved.");
      setEditingId(null);
      setEdit(null);
      await load();
    } catch (e) {
      const err = e as { response?: { data?: { msg?: string } } };
      messageApi.error(err?.response?.data?.msg || "Could not save changes.");
    } finally {
      setBusyId(null);
    }
  };

  const confirm = async (r: EnrollmentRequest) => {
    setBusyId(r.id);
    try {
      const res = await approveEnrollmentRequest(r.id);
      messageApi.success(res?.msg || "Student confirmed.");
      setItems((prev) => prev.filter((x) => x.id !== r.id));
      onChanged?.();
    } catch (e) {
      const err = e as { response?: { data?: { msg?: string } } };
      messageApi.error(err?.response?.data?.msg || "Could not confirm student.");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (r: EnrollmentRequest) => {
    setBusyId(r.id);
    try {
      await deleteEnrollmentRequest(r.id);
      messageApi.success("Removed.");
      setItems((prev) => prev.filter((x) => x.id !== r.id));
      onChanged?.();
    } catch {
      messageApi.error("Could not remove this signup.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={680}
      title={
        <span>
          Pending signups
          {className ? <span className="text-slate-400"> · {className}</span> : null}
        </span>
      }
      destroyOnClose
    >
      {contextHolder}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-400">Loading…</div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center text-sm text-slate-500">
          No pending signups for this class.
        </div>
      ) : (
        <div className="mt-2 max-h-[60vh] space-y-3 overflow-auto pr-1">
          {items.map((r) => {
            const isEditing = editingId === r.id && edit;
            const isBusy = busyId === r.id;
            return (
              <div
                key={r.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className={inputClass}
                        value={edit!.first_name}
                        placeholder="First name"
                        onChange={(e) => setEdit({ ...edit!, first_name: e.target.value })}
                      />
                      <input
                        className={inputClass}
                        value={edit!.last_name}
                        placeholder="Last name"
                        onChange={(e) => setEdit({ ...edit!, last_name: e.target.value })}
                      />
                      <select
                        className={inputClass}
                        value={edit!.gender}
                        onChange={(e) => setEdit({ ...edit!, gender: e.target.value })}
                      >
                        <option value="">Gender…</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <input
                        className={inputClass}
                        value={edit!.nationality}
                        placeholder="Nationality"
                        onChange={(e) => setEdit({ ...edit!, nationality: e.target.value })}
                      />
                      <input
                        className={inputClass}
                        value={edit!.user_name}
                        placeholder="Username"
                        onChange={(e) => setEdit({ ...edit!, user_name: e.target.value })}
                      />
                      <label className="flex items-center gap-2 text-sm text-slate-600">
                        <input
                          type="checkbox"
                          checked={edit!.needs_support}
                          onChange={(e) =>
                            setEdit({ ...edit!, needs_support: e.target.checked })
                          }
                        />
                        Needs extra support
                      </label>
                    </div>
                    {edit!.needs_support && (
                      <textarea
                        className={`${inputClass} min-h-[60px]`}
                        value={edit!.support_details}
                        placeholder="Support details"
                        onChange={(e) =>
                          setEdit({ ...edit!, support_details: e.target.value })
                        }
                      />
                    )}
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEdit(null);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        <CloseOutlined /> Cancel
                      </button>
                      <button
                        disabled={isBusy}
                        onClick={() => saveEdit(r.id)}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                        style={{ background: "var(--primary)" }}
                      >
                        <SaveOutlined /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[15px] font-bold text-slate-800">
                          {r.student_name}
                        </span>
                        {r.needs_support && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                            Needs support
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-slate-500">
                        {r.gender && <span>{r.gender}</span>}
                        {r.nationality && <span>{r.nationality}</span>}
                        <span>
                          Username: <span className="font-medium text-slate-700">{r.user_name}</span>
                        </span>
                      </div>
                      {r.needs_support && r.support_details && (
                        <p className="mt-1.5 rounded-lg bg-amber-50 px-3 py-1.5 text-[13px] text-amber-800">
                          “{r.support_details}”
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={() => startEdit(r)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
                        title="Edit"
                      >
                        <EditOutlined />
                      </button>
                      <Popconfirm
                        title="Remove this signup?"
                        okText="Remove"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => remove(r)}
                      >
                        <button
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 px-2.5 py-1.5 text-sm text-rose-600 hover:bg-rose-50"
                          title="Delete"
                        >
                          <DeleteOutlined />
                        </button>
                      </Popconfirm>
                      <button
                        disabled={isBusy}
                        onClick={() => confirm(r)}
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-50"
                        style={{ background: "var(--primary)" }}
                      >
                        <CheckOutlined /> Confirm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}
