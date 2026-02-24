"use client";
import { useState } from "react";
import { AddTrackerModal } from "../modals/trackerModals/AddTrackerModal";
import { EditTrackerModal } from "../modals/trackerModals/EditTrackerModal";
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
  const schoolId = currentUser?.school;
  const isTeacher = currentUser?.role === "TEACHER";

  const [editTracker, setEditTracker] = useState<Tracker | null>(null);
  const [deleteTracker, setDeleteTracker] = useState<Tracker | null>(null);
  const [isAddTrackerModalOpen, setIsAddTrackerModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const queryClient = useQueryClient();

  const {
    data: trackers = [],
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
      }),
    onSuccess: async () => {
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
      }),
    onSuccess: async () => {
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
    onSuccess: async () => {
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
    router.push(`/dashboard/all_trackers/${trackerId}`);
  };

  const handleAssignTracker = (trackerId: string) => {
    router.push(`/dashboard/all_trackers/${trackerId}/assign`);
  };

  if (isLoading)
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
        <h1 className="text-2xl font-bold">All Trackers</h1>
        {currentUser?.role !== "STUDENT" && (
          <>
            <Button
              type="primary"
              className="premium-pill-btn cursor-pointer !bg-[#38C16C] !border-[#38C16C] !text-white hover:!bg-[#32ad5f] hover:!border-[#32ad5f]"
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
                        className="text-base md:text-lg font-bold text-green-600 hover:text-green-800 cursor-pointer transition-colors mb-2 group-hover:underline"
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
                          <Tooltip title="Assign to Classes">
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
    </div>
  );
}
