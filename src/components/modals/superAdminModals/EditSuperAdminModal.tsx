"use client";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

type SuperAdminBasic = {
  id: string;
  name: string;
  email: string;
  password?: string;
};

export const EditSuperAdminModal = ({
  admin,
  isOpen,
  onOpenChange,
  onSave,
}: {
  admin: SuperAdminBasic | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (admin: SuperAdminBasic) => void;
}) => {
  const [name, setName] = useState(admin?.name || "");
  const [email, setEmail] = useState(admin?.email || "");
  const [password, setPassword] = useState(admin?.password || "");

  useEffect(() => {
    if (admin) {
      setName(admin.name);
      setEmail(admin.email);
      setPassword(admin.password);
    }
  }, [admin]);

  const handleSave = () => {
    if (!admin) return;

    onSave({
      ...admin,
      name,
      email,
      password,
    });
    onOpenChange(false);
  };

  if (!admin) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[90vw] max-w-[450px] max-h-[85vh] overflow-y-auto">
          <Dialog.Title className="text-lg font-bold mb-4">
            Edit Admin
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                className="w-full p-2 border rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                className="w-full p-2 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Password*
              </label>
              <input
                className="w-full p-2 border rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save changes</Button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4"
              aria-label="Close"
              onClick={() => onOpenChange(false)}
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
