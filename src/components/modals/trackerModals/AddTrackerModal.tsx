"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select } from "antd";

const trackerOptions = [
  { value: "recitation", label: "Recitation" },
  { value: "memorization", label: "Memorization" },
  { value: "tafsir", label: "Tafsir" },
  { value: "studied", label: "Studied" },
  { value: "recall", label: "Recall" },
];

const typeOptions = [
  { value: "topic", label: "Topic" },
  { value: "chapter", label: "Chapter" },
  { value: "verse", label: "Verse" },
  { value: "hadith", label: "Hadith" },
];

export function AddTrackerModal({
  isOpen,
  onOpenChange,
  onAddTracker,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTracker: (tracker: {
    name: string;
    type: string;
    status: string;
    progress: string[];
  }) => void;
}) {
  const [tracker, setTracker] = useState({
    name: "",
    type: "",
    status: "",
    progress: [] as string[],
  });

  const statusOptions = [
    "Active",
    "Paused",
    "Completed",
    "Pending",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTracker(tracker);
    setTracker({
      name: "",
      type: "",
      status: "",
      progress: [],
    });
  };

  const handleOptionsChange = (value: string[]) => {
    setTracker({
      ...tracker,
      progress: value,
    });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-[1000]">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Add New Tracker
          </Dialog.Title>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracker Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={tracker.name}
                  onChange={(e) =>
                    setTracker({ ...tracker, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={tracker.type}
                  onChange={(e) =>
                    setTracker({ ...tracker, type: e.target.value })
                  }
                  required
                >
                  <option value="">Select Type</option>
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={tracker.status}
                  onChange={(e) =>
                    setTracker({ ...tracker, status: e.target.value })
                  }
                  required
                >
                  <option value="">Select Status</option>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progress Options
                </label>
                <Select
                  mode="tags"
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Select progress options"
                  value={tracker.progress}
                  onChange={handleOptionsChange}
                  options={trackerOptions}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Dialog.Close asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.Close>
              <Button type="submit">Add Tracker</Button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100">
              <Cross2Icon className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}