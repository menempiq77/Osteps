"use client";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { AddTrackerModal } from "../modals/trackerModals/AddTrackerModal";
import { EditTrackerModal } from "../modals/trackerModals/EditTrackerModal";
import { useRouter } from "next/navigation";

// Types
type Tracker = {
  id: string;
  name: string;
  type: "Quran" | "Hadees" | "Seerah";
  progress: number;
  lastUpdated: string;
  status: "Active" | "Paused" | "Completed";
};

type TrackerBasic = {
  name: string;
  type: "Quran" | "Hadees" | "Seerah";
  progress: number;
  status: "Active" | "Paused" | "Completed";
};

// Main Component
export default function TrackerList() {
  const router = useRouter();
  const [trackers, setTrackers] = useState<Tracker[]>([
    {
      id: "1",
      name: "Quran Memorization",
      type: "Quran",
      progress: 65,
      lastUpdated: "2023-05-15",
      status: "Active",
    },
    {
      id: "2",
      name: "Hadiths",
      type: "Hadees",
      progress: 22,
      lastUpdated: "2023-05-10",
      status: "Active",
    },
    {
      id: "3",
      name: "Seerah and stories",
      type: "Seerah",
      progress: 100,
      lastUpdated: "2023-05-01",
      status: "Completed",
    },
  ]);

  const [editTracker, setEditTracker] = useState<Tracker | null>(null);
  const [deleteTracker, setDeleteTracker] = useState<Tracker | null>(null);
  const [isAddTrackerModalOpen, setIsAddTrackerModalOpen] = useState(false);

  const handleSaveEdit = (tracker: Tracker) => {
    const updatedTracker = {
      ...tracker,
      lastUpdated: new Date().toISOString().split("T")[0], // Update lastUpdated date
    };
    setTrackers(
      trackers.map((t) => (t.id === tracker.id ? updatedTracker : t))
    );
    setEditTracker(null);
  };

  const handleDeleteTracker = (trackerId: string) => {
    setTrackers(trackers.filter((tracker) => tracker.id !== trackerId));
    setDeleteTracker(null);
  };

  const handleAddNewTracker = (tracker: TrackerBasic) => {
    const newTracker = {
      ...tracker,
      id: Math.random().toString(36).substring(2, 9),
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    setTrackers([...trackers, newTracker]);
    setIsAddTrackerModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Paused":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Quran":
        return "bg-purple-100 text-purple-800";
      case "Hadees":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleTrackerClick = (trackerId: string, type: "Quran" | "Hadees" | "Seerah") => {
    router.push(`/dashboard/trackers/${type.toLowerCase()}/${trackerId}`);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Trackers</h1>
        <Dialog.Root
          open={isAddTrackerModalOpen}
          onOpenChange={setIsAddTrackerModalOpen}
        >
          <Dialog.Trigger asChild>
            <Button>Add New Tracker</Button>
          </Dialog.Trigger>
          <AddTrackerModal
            isOpen={isAddTrackerModalOpen}
            onOpenChange={setIsAddTrackerModalOpen}
            onAddTracker={handleAddNewTracker}
          />
        </Dialog.Root>
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
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Progress
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
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                        tracker.type
                      )}`}
                    >
                      {tracker.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            tracker.progress < 30
                              ? "bg-red-500"
                              : tracker.progress < 70
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${tracker.progress}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {tracker.progress}%
                      </span>
                    </div>
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
                      <Dialog.Root>
                        <Dialog.Trigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit"
                            onClick={() => setEditTracker(tracker)}
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
                                <strong>{deleteTracker.name}</strong> tracker?
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
