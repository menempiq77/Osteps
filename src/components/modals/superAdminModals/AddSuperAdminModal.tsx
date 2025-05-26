"use client";
import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";

interface AddSuperAdminModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onAddSuperAdmin: (admin: {
    name: string;
    email: string;
    password: string;
  }) => void;
  onClose?: () => void;
}

export const AddSuperAdminModal = ({
  isOpen,
  onOpenChange,
  onAddSuperAdmin,
  onClose,
}: AddSuperAdminModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !password.trim()) return;
    
    onAddSuperAdmin({ 
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
    });
    resetForm();
    onClose?.();
    onOpenChange?.(false);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleClose = () => {
    onClose?.();
    onOpenChange?.(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/50 fixed inset-0" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg min-w-md max-w-md">
          <Dialog.Title className="text-lg font-bold mb-4">
            Add New Sub Admin
          </Dialog.Title>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Name*
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter admin name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email*</label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password*</label>
              <input
                type="password"
                className="w-full p-2 border rounded-md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close asChild>
              <Button variant="outline" onClick={handleClose} className="cursor-pointer">
                Cancel
              </Button>
            </Dialog.Close>
            <Button 
              onClick={handleSubmit} 
              disabled={!name.trim() || !email.trim() || !password.trim()} 
              className="cursor-pointer"
            >
              Add Admin
            </Button>
          </div>

          <Dialog.Close asChild>
            <button
              className="absolute top-2 right-2"
              aria-label="Close"
              onClick={handleClose}
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};