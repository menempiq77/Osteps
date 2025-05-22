"use client";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { AddTrackerModal } from "../modals/trackerModals/AddTrackerModal";
import { EditTrackerModal } from "../modals/trackerModals/EditTrackerModal";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  fetchTrackers,
  addTracker as addTrackerAPI,
  updateTracker as updateTrackerAPI,
  deleteTracker as deleteTrackerAPI,
} from "@/services/api";
import { Alert, Spin } from "antd";

// Types
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

type TrackerListProps = {
  classId: string;
};

export default function TrackerList() {
  const { classId } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [trackers, setTrackers] = useState<Tracker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editTracker, setEditTracker] = useState<Tracker | null>(null);
  const [deleteTracker, setDeleteTracker] = useState<Tracker | null>(null);
  const [isAddTrackerModalOpen, setIsAddTrackerModalOpen] = useState(false);

  const loadTrackers = async () => {
    try {
      setLoading(true);
      const data = await fetchTrackers(Number(classId));
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
  }, [classId]);

  const handleSaveEdit = async (tracker: Tracker) => {
    try {
      await updateTrackerAPI(tracker.id, {
        name: tracker.name,
        type: tracker.type,
        status: tracker.status,
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
    } catch (err) {
      console.error("Failed to update tracker:", err);
    }
  };

  const handleDeleteTracker = async (trackerId: string) => {
    try {
      await deleteTrackerAPI(Number(trackerId));
      setTrackers(trackers.filter((tracker) => tracker.id !== trackerId));
      setDeleteTracker(null);
    } catch (err) {
      console.error("Failed to delete tracker:", err);
    }
  };

  const handleAddNewTracker = async (tracker: TrackerBasic) => {
    try {
      await addTrackerAPI({
        class_id: Number(classId),
        name: tracker.name,
        type: tracker.type,
        status: tracker.status,
        progress: tracker.progress,
      });

      setIsAddTrackerModalOpen(false);
      await loadTrackers();
    } catch (err) {
      console.error("Failed to add tracker:", err);
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

  const handleLeaderBoard = () => {
    router.push(`/dashboard/leaderboard`);
  };

  const handleTrackerClick = (trackerId: string, type: string) => {
    router.push(`/dashboard/trackers/${classId}/${trackerId}`);
  };

  if (loading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  if (error)
    return (
      <div className="p-3 md:p-6">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
        />
      </div>
    );

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Trackers</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => handleLeaderBoard()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            View Leaderboard
          </Button>
          {currentUser?.role !== "STUDENT" && (
            <Dialog.Root
              open={isAddTrackerModalOpen}
              onOpenChange={setIsAddTrackerModalOpen}
            >
              <Dialog.Trigger asChild>
                <Button className="cursor-pointer">Add New Tracker</Button>
              </Dialog.Trigger>
              <AddTrackerModal
                isOpen={isAddTrackerModalOpen}
                onOpenChange={setIsAddTrackerModalOpen}
                onAddTracker={handleAddNewTracker}
              />
            </Dialog.Root>
          )}
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <h3 className="text-lg font-semibold p-4 border-b">Current Trackers</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tracker Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {trackers.map((tracker) => (
                <tr key={tracker.id}>
                  <td
                    onClick={() => handleTrackerClick(tracker.id, tracker.type)}
                    className="px-6 py-4 whitespace-nowrap cursor-pointer hover:underline text-blue-600 hover:text-blue-800"
                  >
                    {tracker.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {tracker.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        tracker.status
                      )}`}
                    >
                      {tracker.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      {currentUser?.role !== "STUDENT" && (
                        <>
                          <Dialog.Root>
                            <Dialog.Trigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Edit"
                                onClick={() => setEditTracker(tracker)}
                                className="cursor-pointer"
                              >
                                <Pencil2Icon className="h-4 w-4" />
                              </Button>
                            </Dialog.Trigger>
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
                          </Dialog.Root>

                          <Dialog.Root>
                            <Dialog.Trigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Delete"
                                onClick={() => setDeleteTracker(tracker)}
                                className="cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </Dialog.Trigger>
                            {deleteTracker?.id === tracker.id && (
                              <Dialog.Portal>
                                <Dialog.Overlay className="fixed inset-0 bg-black/30" />
                                <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-md">
                                  <Dialog.Title className="text-lg font-semibold">
                                    Confirm Deletion
                                  </Dialog.Title>
                                  <p className="mt-2 text-gray-600">
                                    Are you sure you want to delete{" "}
                                    <strong>{deleteTracker.name}</strong>{" "}
                                    tracker?
                                  </p>
                                  <div className="mt-4 flex justify-end space-x-2">
                                    <Button
                                      variant="outline"
                                      onClick={() => setDeleteTracker(null)}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() =>
                                        handleDeleteTracker(deleteTracker.id)
                                      }
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </Dialog.Content>
                              </Dialog.Portal>
                            )}
                          </Dialog.Root>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
