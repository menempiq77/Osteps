"use client";
import { useState, useEffect } from "react";
import { AddTrackerModal } from "../modals/trackerModals/AddTrackerModal";
import { EditTrackerModal } from "../modals/trackerModals/EditTrackerModal";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Spin, Modal, Button, Breadcrumb, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, TeamOutlined } from "@ant-design/icons";
import Link from "next/link";
import {
  addTracker as addTrackerAPI,
  updateTracker as updateTrackerAPI,
  deleteTracker as deleteTrackerAPI,
  fetchAllTrackers,
} from "@/services/trackersApi";

type Tracker = {
  id: string;
  class_id: number;
  name: string;
  type: string;
  status: string;
  progress: string[];
  lastUpdated?: string;
};

type TrackerBasic = {
  name: string;
  type: string;
  status: string;
  progress: string[];
};

export default function AllTrackerList() {
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editTracker, setEditTracker] = useState<Tracker | null>(null);
  const [deleteTracker, setDeleteTracker] = useState<Tracker | null>(null);
  const [isAddTrackerModalOpen, setIsAddTrackerModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const schoolId = currentUser?.school;

  const loadTrackers = async () => {
    try {
      setLoading(true);
      const data = await fetchAllTrackers(Number(schoolId));
      setTrackers(
        data.map((tracker: any) => ({
          ...tracker,
          id: tracker.id.toString(),
          lastUpdated: new Date().toISOString().split("T")[0],
        }))
      );
    } catch (err) {
      setError("Failed to fetch trackers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrackers();
  }, []);

  const handleSaveEdit = async (tracker: Tracker) => {
    try {
      await updateTrackerAPI(tracker.id, {
        school_id: Number(schoolId),
        name: tracker.name,
        type: "topic",
        status: "Active",
        progress: tracker.progress,
      });

      setTrackers(
        trackers.map((t) =>
          t.id === tracker.id
            ? {
                ...tracker,
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : t
        )
      );
      await loadTrackers();
      setEditTracker(null);
      messageApi.success("Tracker updated successfully!");
    } catch (err) {
      console.error("Failed to update tracker:", err);
      messageApi.error("Failed to update tracker");
    }
  };

  const handleDeleteTracker = async () => {
    if (!deleteTracker) return;
    try {
      await deleteTrackerAPI(Number(deleteTracker.id));
      setTrackers(
        trackers.filter((tracker) => tracker.id !== deleteTracker.id)
      );
      setDeleteTracker(null);
      setIsDeleteModalOpen(false);

      messageApi.success("Tracker deleted successfully!");
    } catch (err) {
      console.error("Failed to delete tracker:", err);
      messageApi.error("Failed to delete tracker");
    }
  };

  const handleAddNewTracker = async (tracker: TrackerBasic) => {
    try {
      await addTrackerAPI({
        school_id: Number(schoolId),
        name: tracker.name,
        type: "topic",
        status: "Active",
        progress: tracker.progress,
      });

      setIsAddTrackerModalOpen(false);
      await loadTrackers();

      messageApi.success("Tracker added successfully!");
    } catch (err) {
      console.error("Failed to add tracker:", err);
      messageApi.error("Failed to add tracker");
    }
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

  if (loading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <>
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Trackers</h1>
          {currentUser?.role !== "STUDENT" && (
            <>
              <Button
                type="primary"
                className="cursor-pointer !bg-primary !text-white"
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

      <div className="relative overflow-auto">
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-300 mb-20">
            <thead>
              <tr className="bg-primary text-center text-xs md:text-sm font-thin text-white">
                <th className="p-2 md:p-4">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Tracker Name
                  </span>
                </th>
                <th className="p-2 md:p-4">
                  <span className="block py-2 px-3 border-r border-gray-300">
                    Last Updated
                  </span>
                </th>
                <th className="p-2 md:p-4">
                  <span
                    className={`block py-2 px-3 ${
                      currentUser?.role !== "STUDENT" ? "border-r" : ""
                    } border-gray-300`}
                  >
                    Status
                  </span>
                </th>
                {currentUser?.role !== "STUDENT" && (
                  <th className="p-2 md:p-4 text-xs md:text-sm">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {trackers?.length > 0 ? (
                trackers.map((tracker) => (
                  <tr
                    key={tracker.id}
                    className="border-b border-gray-300 text-xs md:text-sm text-center text-gray-800 hover:bg-[#E9FAF1] even:bg-[#E9FAF1] odd:bg-white"
                  >
                    <td
                      onClick={() =>
                        handleTrackerClick(tracker.id, tracker.type)
                      }
                      className="p-2 md:p-4 cursor-pointer hover:underline text-green-600 hover:text-green-800 font-medium"
                    >
                      {tracker.name}
                    </td>
                    <td className="p-2 md:p-4">{tracker.lastUpdated}</td>
                    <td className="p-2 md:p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          tracker.status
                        )}`}
                      >
                        {tracker.status}
                      </span>
                    </td>
                    {currentUser?.role !== "STUDENT" && (
                      <td className="relative p-2 md:p-4 flex justify-center space-x-3">
                        <>
                          <button
                            onClick={() =>
                                handleAssignTracker(tracker.id)
                            }
                            className="text-blue-500 hover:text-blue-700 cursor-pointer"
                            title="Assign to Classes"
                          >
                            <TeamOutlined />
                          </button>
                          <button
                            onClick={() => setEditTracker(tracker)}
                            className="text-green-500 hover:text-green-700 cursor-pointer"
                            title="Edit"
                          >
                            <EditOutlined />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTracker(tracker);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                            title="Delete"
                          >
                            <DeleteOutlined />
                          </button>
                          {editTracker?.id === tracker.id && (
                            <EditTrackerModal
                              tracker={editTracker}
                              isOpen={!!editTracker}
                              onOpenChange={(open) =>
                                !open && setEditTracker(null)
                              }
                              onSave={handleSaveEdit}
                            />
                          )}
                        </>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={currentUser?.role !== "STUDENT" ? 4 : 3}
                    className="p-4 text-center text-gray-500"
                  >
                    No trackers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
          Are you sure you want to delete the tracker{" "}
          <strong>{deleteTracker?.name}</strong>? This action cannot be undone.
        </p>
      </Modal>
    </>
  );
}
