"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

type Tracker = {
  id: string;
  name: string;
  type: string; // Changed from specific types to string
  progress: number;
  lastUpdated: string;
  status: string; // Changed from specific statuses to string
};

type EditTrackerModalProps = {
  tracker: Tracker;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tracker: Tracker) => void;
};

export function EditTrackerModal({
  tracker: initialTracker,
  isOpen,
  onOpenChange,
  onSave,
}: EditTrackerModalProps) {
  const [tracker, setTracker] = useState<Tracker>(initialTracker);

  useEffect(() => {
    setTracker(initialTracker);
  }, [initialTracker]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTracker = {
      ...tracker,
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    onSave(updatedTracker);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Edit Tracker
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
                  Type (e.g., Quran, Hadees, Seerah)
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progress (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={tracker.progress}
                  onChange={(e) =>
                    setTracker({ ...tracker, progress: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status (e.g., Active, Paused, Completed)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={tracker.status}
                  onChange={(e) =>
                    setTracker({ ...tracker, status: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Updated
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={tracker.lastUpdated}
                  onChange={(e) =>
                    setTracker({ ...tracker, lastUpdated: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Dialog.Close asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.Close>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100"
              aria-label="Close"
            >
              <Cross2Icon className="h-4 w-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}