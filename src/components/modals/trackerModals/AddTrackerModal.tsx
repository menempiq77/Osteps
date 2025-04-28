"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Select } from "antd";

type TrackerBasic = {
  name: string;
  type: string;
  status: string;
  options: string[];
};

type AddTrackerModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTracker: (tracker: TrackerBasic) => void;
};

const trackerOptions = [
  { value: "recitation", label: "Recitation" },
  { value: "memorization", label: "Memorization" },
  { value: "tafsir", label: "Tafsir" },
  { value: "studied", label: "Studied" },
  { value: "recall", label: "Recall" },
];

export function AddTrackerModal({
  isOpen,
  onOpenChange,
  onAddTracker,
}: AddTrackerModalProps) {
  const [tracker, setTracker] = useState<TrackerBasic>({
    name: "",
    type: "",
    status: "",
    options: [],
  });

  const statusOptions = [
    "Active",
    "Paused",
    "Completed",
    "Not Started",
    "Revision",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTracker(tracker);
    setTracker({
      name: "",
      type: "",
      status: "",
      options: [],
    });
  };

  const handleOptionsChange = (value: string[]) => {
    setTracker({
      ...tracker,
      options: value,
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
              {/* Name and Type inputs remain the same */}
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
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={tracker.type}
                  onChange={(e) =>
                    setTracker({ ...tracker, type: e.target.value })
                  }
                  required
                />
              </div>

              {/* Status select remains the same */}
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

              {/* Fixed Select component */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracker Options
                </label>
                <Select
                   mode="tags"  
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Select options"
                  value={tracker.options}
                  onChange={handleOptionsChange}
                  options={trackerOptions}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
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