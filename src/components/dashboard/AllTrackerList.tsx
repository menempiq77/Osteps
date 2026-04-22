"use client";
import { useState, useEffect } from "react";
import { AddTrackerModal } from "../modals/trackerModals/AddTrackerModal";
import { EditTrackerModal } from "../modals/trackerModals/EditTrackerModal";
import TrackerAssignDrawer from "./TrackerAssignDrawer";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Spin, Modal, Button, Breadcrumb, message, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  TeamOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import {
  addTracker as addTrackerAPI,
  updateTracker as updateTrackerAPI,
  deleteTracker as deleteTrackerAPI,
  fetchAllTrackers,
} from "@/services/trackersApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeadlineCountdown } from "@/components/common/DeadlineCountdown";
import { useSubjectContext } from "@/contexts/SubjectContext";

// ─── Subject isolation helpers ───────────────────────────────────────────────
const TRACKER_SUBJECT_MAP_KEY = "osteps_tracker_subject_map";
const TRACKER_MAP_MIGRATION_KEY = "osteps_tracker_map_v";
const TRACKER_MAP_MIGRATION_VERSION = "4"; // bump to wipe stale auto-claim tags

function runTrackerMapWipeIfNeeded() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(TRACKER_MAP_MIGRATION_KEY) !== TRACKER_MAP_MIGRATION_VERSION) {
    localStorage.removeItem(TRACKER_SUBJECT_MAP_KEY);
    localStorage.setItem(TRACKER_MAP_MIGRATION_KEY, TRACKER_MAP_MIGRATION_VERSION);
  }
}

function readTrackerSubjectMap(): Record<string, number> {
  if (typeof window === "undefined") return {};
  runTrackerMapWipeIfNeeded();
  try { return JSON.parse(localStorage.getItem(TRACKER_SUBJECT_MAP_KEY) || "{}"); }
  catch { return {}; }
}

function tagTrackerWithSubject(trackerId: number | string, subjectId: number) {
  const map = readTrackerSubjectMap();
  map[String(trackerId)] = subjectId;
  if (typeof window !== "undefined") {
    localStorage.setItem(TRACKER_SUBJECT_MAP_KEY, JSON.stringify(map));
  }
}

function untagTracker(trackerId: number | string) {
  const map = readTrackerSubjectMap();
  delete map[String(trackerId)];
  if (typeof window !== "undefined") {
    localStorage.setItem(TRACKER_SUBJECT_MAP_KEY, JSON.stringify(map));
  }
}

// Priority: 1) backend subject_id  2) localStorage map  3) null (untagged/legacy)
function resolveTrackerSubjectId(tracker: any): number | null {
  const backendId = Number((tracker as any).subject_id || 0);
  if (backendId > 0) return backendId;
  const map = readTrackerSubjectMap();
  const localId = map[String(tracker.id)];
  return localId !== undefined ? localId : null;
}

// Show ONLY trackers that match the subject. Untagged (legacy) are hidden from
// subject workspaces — they appear in the claim banner instead.
function filterTrackersBySubject(trackers: Tracker[], subjectId: number): Tracker[] {
  return trackers.filter((t) => {
    const tid = resolveTrackerSubjectId(t);
    return tid === subjectId;
  });
}

function isTrackerUntagged(tracker: any): boolean {
  return resolveTrackerSubjectId(tracker) === null;
}
// ─────────────────────────────────────────────────────────────────────────────

type Tracker = {
  id: string;
  class_id: number;
  name: string;
  type: string;
  status: string;
  progress: string[];
  deadline?: string | null;
};

function normalizeDeadline(t: any): string | null {
  const raw =
    t?.deadline ??
    t?.deadline_at ??
    t?.deadline_date ??
    t?.last_updated ??
    t?.lastUpdated ??
    null;
  if (raw === null || raw === undefined || raw === "") return null;
  return String(raw).slice(0, 10);
}

export default function AllTrackerList() {
  const router = useRouter();
  
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { activeSubjectId, canUseSubjectContext, activeSubject, loading: subjectContextLoading } = useSubjectContext();
  const inSubjectContext = canUseSubjectContext && !!activeSubjectId;
  const schoolId = currentUser?.school;
  const isTeacher = currentUser?.role === "TEACHER";
  const canDeleteTrackers =
    currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "HOD";

  const [editTracker, setEditTracker] = useState<Tracker | null>(null);
  const [deleteTracker, setDeleteTracker] = useState<Tracker | null>(null);
  const [assignTracker, setAssignTracker] = useState<Tracker | null>(null);
  const [isAddTrackerModalOpen, setIsAddTrackerModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const queryClient = useQueryClient();

  const {
    data: rawTrackers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["trackers", schoolId],
    queryFn: async () => {
      const data = await fetchAllTrackers(Number(schoolId));
      return data.map((tracker: any) => ({
        ...tracker,
        id: tracker.id.toString(),
        deadline: normalizeDeadline(tracker),
      }));
    },
    enabled: !!schoolId,
    onError: (err) => {
      console.error(err);
      messageApi.error("Failed to fetch trackers");
    },
  });

  // Filter: show subject-matching trackers + untagged legacy trackers.
  const trackers = (subjectContextLoading || isLoading)
    ? []
    : inSubjectContext
      ? rawTrackers.filter((t: any) => {
          const tid = resolveTrackerSubjectId(t);
          return tid === Number(activeSubjectId) || tid === null;
        })
      : rawTrackers;

  const untaggedTrackers = inSubjectContext
    ? rawTrackers.filter((t: any) => isTrackerUntagged(t))
    : [];

  const handleClaimAllForSubject = async () => {
    if (!activeSubjectId || untaggedTrackers.length === 0) return;
    setIsClaiming(true);
    try {
      const results = await Promise.allSettled(
        untaggedTrackers.map(async (t: any) => {
          try {
            // Minimal payload — update endpoint only needs name + subject_id
            await updateTrackerAPI(t.id, {
              school_id: Number(schoolId),
              name: t.name,
              type: t.type || "topic",
              progress: Array.isArray(t.progress) ? t.progress : [],
              deadline: normalizeDeadline(t),
            }, Number(activeSubjectId));
          } catch (apiErr: any) {
            // If update fails, log and fall back to localStorage-only tagging.
            // This keeps trackers correctly separated on this device.
            console.warn(
              `[Claim] Backend update failed for tracker ${t.id} (${t.name}), using localStorage fallback:`,
              apiErr?.response?.data ?? apiErr?.message ?? apiErr
            );
          }
          // Always tag in localStorage regardless of API outcome
          tagTrackerWithSubject(t.id, Number(activeSubjectId));
        })
      );
      await queryClient.invalidateQueries({ queryKey: ["trackers", schoolId] });
    } catch (err: any) {
      console.error("[Claim] Unexpected error:", err);
      messageApi.error("Failed to assign trackers. Check browser console.");
    } finally {
      setIsClaiming(false);
    }
  };

  // 🔹 Add tracker mutation
  const addTrackerMutation = useMutation({
    mutationFn: (tracker: any) =>
      addTrackerAPI({
        school_id: Number(schoolId),
        name: tracker.name,
        type: "topic",
        progress: tracker.progress,
        claim_certificate: tracker.claim_certificate,
        deadline: tracker.deadline ?? null,
      }, activeSubjectId ?? undefined),
    onSuccess: async (result: any) => {
      const newId = result?.data?.id ?? result?.id;
      if (inSubjectContext && newId) {
        tagTrackerWithSubject(newId, Number(activeSubjectId));
      }
      await queryClient.invalidateQueries({ queryKey: ["trackers", schoolId] });
      messageApi.success(isTeacher ? "Tracker added successfully and sent for approval" : "Tracker added successfully!");
      setIsAddTrackerModalOpen(false);
    },
    onError: () => {
      messageApi.error("Failed to add tracker");
    },
  });

  // 🔹 Update tracker mutation
  const updateTrackerMutation = useMutation({
    mutationFn: (tracker: any) =>
      updateTrackerAPI(tracker.id, {
        school_id: Number(schoolId),
        name: tracker.name,
        type: "topic",
        progress: tracker.progress,
        deadline: tracker.deadline ?? null,
      }, activeSubjectId ?? undefined),
    onSuccess: async (_, tracker: any) => {
      if (inSubjectContext) {
        tagTrackerWithSubject(tracker.id, Number(activeSubjectId));
      }
      await queryClient.invalidateQueries({ queryKey: ["trackers", schoolId] });
      messageApi.success(isTeacher ? "Tracker updated successfully and sent for approval" : "Tracker updated successfully!");
      setEditTracker(null);
    },
    onError: () => {
      messageApi.error("Failed to update tracker");
    },
  });

  // 🔹 Delete tracker mutation
  const deleteTrackerMutation = useMutation({
    mutationFn: (id: number) => deleteTrackerAPI(id),
    onSuccess: async (_, id: number) => {
      untagTracker(id);
      await queryClient.invalidateQueries({ queryKey: ["trackers", schoolId] });
      messageApi.success("Tracker deleted successfully!");
      setDeleteTracker(null);
      setIsDeleteModalOpen(false);
    },
    onError: () => {
      messageApi.error("Failed to delete tracker");
    },
  });

  // 🔹 Handlers (now call mutations)
  const handleAddNewTracker = (tracker: any) => {
    addTrackerMutation.mutate(tracker);
  };

  const handleSaveEdit = (tracker: any) => {
    updateTrackerMutation.mutate(tracker);
  };

  const handleDeleteTracker = () => {
    if (!canDeleteTrackers) {
      messageApi.warning("Only HOD or School Admin can delete trackers.");
      return;
    }
    if (!deleteTracker) return;
    deleteTrackerMutation.mutate(Number(deleteTracker.id));
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleTrackerClick = (trackerId: string) => {
    const subjectParam =
      inSubjectContext && activeSubjectId
        ? `?subject_id=${activeSubjectId}`
        : "";
    router.push(`/dashboard/all_trackers/${trackerId}${subjectParam}`);
  };

  const handleAssignTracker = (trackerId: string) => {
    const tracker = trackers.find((item: Tracker) => item.id === trackerId) ?? null;
    setAssignTracker(tracker);
  };

  if (isLoading || subjectContextLoading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="premium-page rounded-2xl p-3 md:p-4">
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <span>All Trackers</span>,
          },
        ]}
        className="!mb-2"
      />
      <div className="premium-hero flex items-center justify-between mb-6 px-4 py-3 rounded-xl">
        <h1 className="text-2xl font-bold">
          {activeSubject?.name ? `${activeSubject.name} - ` : ""}All Trackers
        </h1>
        {currentUser?.role !== "STUDENT" && (
          <>
            <Button
              type="primary"
              className="premium-pill-btn cursor-pointer !bg-primary !text-white hover:!bg-primary/90 !border-0"
              icon={<PlusOutlined />}
              onClick={() => setIsAddTrackerModalOpen(true)}
            >
              Add Tracker
            </Button>
            <AddTrackerModal
              isOpen={isAddTrackerModalOpen}
              onOpenChange={setIsAddTrackerModalOpen}
              onAddTracker={handleAddNewTracker}
            />
          </>
        )}
      </div>

      <div className="premium-card relative overflow-auto rounded-xl p-1">

        {/* Claim banner — only admins/HODs see this, only in a subject workspace with untagged trackers */}
        {inSubjectContext && untaggedTrackers.length > 0 && canDeleteTrackers && (
          <div className="mx-3 mt-3 flex items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3">
            <p className="text-sm text-amber-800">
              <strong>{untaggedTrackers.length} tracker{untaggedTrackers.length > 1 ? "s are" : " is"} not assigned to any subject.</strong>
              {" "}Click to permanently assign {untaggedTrackers.length > 1 ? "them" : "it"} to <strong>{activeSubject?.name}</strong>.
            </p>
            <button
              type="button"
              onClick={handleClaimAllForSubject}
              disabled={isClaiming}
              className="shrink-0 rounded-lg px-4 h-8 font-medium text-sm text-white cursor-pointer border-none disabled:opacity-60"
              style={{ backgroundColor: "var(--primary)" }}
            >
              {isClaiming ? "Assigning..." : `Assign all to ${activeSubject?.name}`}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3 p-3">
          {trackers?.length > 0 ? (
            trackers?.map((tracker) => (
              <div
                key={tracker.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 overflow-hidden group"
              >
                <div className="p-3 md:p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    {/* Left Section: Tracker Info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        onClick={() => handleTrackerClick(tracker?.id, tracker?.type)}
                        className="mb-2 cursor-pointer text-base font-bold text-[var(--theme-dark)] transition-colors group-hover:underline hover:text-[var(--primary)] md:text-lg"
                      >
                        {tracker?.name}
                      </h3>

                      <div className="space-y-1">
                        {/* Deadline */}
                        <div className="flex items-center gap-2 text-gray-700">
                          <CalendarOutlined className="text-blue-500 text-sm flex-shrink-0" />
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                              Deadline
                            </p>
                            <p className="text-xs md:text-sm font-medium">
                              <DeadlineCountdown deadline={tracker?.deadline} />
                            </p>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center gap-2">
                          <CheckCircleOutlined className="text-green-500 text-sm flex-shrink-0" />
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                              Status
                            </p>
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold mt-0.5 ${getStatusColor(
                                tracker?.status
                              )}`}
                            >
                              {tracker?.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Action Buttons */}
                    {currentUser?.role !== "STUDENT" && (
                      <div className="flex flex-wrap md:flex-col items-center justify-end gap-1">
                        {tracker?.is_topic === 1 && (
                          <Tooltip title="Assign Tracker">
                            <Button
                              type="text"
                              icon={<TeamOutlined className="text-sm" />}
                              size="small"
                              className="!text-blue-600 hover:!text-blue-800 hover:!bg-blue-50"
                              onClick={() => handleAssignTracker(tracker.id)}
                            />
                          </Tooltip>
                        )}
                        <Tooltip title="Edit Tracker">
                          <Button
                            type="text"
                            icon={<EditOutlined className="text-sm" />}
                            size="small"
                            className="!text-green-600 hover:!text-green-800 hover:!bg-green-50"
                            onClick={() => setEditTracker(tracker)}
                          />
                        </Tooltip>
                        {canDeleteTrackers && (
                          <Tooltip title="Delete Tracker">
                            <Button
                              type="text"
                              icon={<DeleteOutlined className="text-sm" />}
                              size="small"
                              className="!text-red-600 hover:!text-red-800 hover:!bg-red-50"
                              onClick={() => {
                                setDeleteTracker(tracker);
                                setIsDeleteModalOpen(true);
                              }}
                            />
                          </Tooltip>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Accent Border */}
                <div className="h-0.5 bg-gradient-to-r from-blue-400 via-blue-500 to-transparent"></div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-sm">No trackers found.</p>
            </div>
          )}
        </div>

        {editTracker && (
          <EditTrackerModal
            tracker={editTracker}
            isOpen={!!editTracker}
            onOpenChange={(open) => !open && setEditTracker(null)}
            onSave={handleSaveEdit}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={isDeleteModalOpen}
        onOk={handleDeleteTracker}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        <p>
          Are you sure you want to delete this tracker? <br /> This action cannot be undone.
        </p>
      </Modal>

      <TrackerAssignDrawer
        tracker={assignTracker ? { id: assignTracker.id, name: assignTracker.name } : null}
        open={!!assignTracker}
        onClose={() => setAssignTracker(null)}
        subjectId={inSubjectContext ? Number(activeSubjectId) : undefined}
      />
    </div>
  );
}
