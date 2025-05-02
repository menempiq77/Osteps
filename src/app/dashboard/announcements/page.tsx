"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Alert, Badge, Spin } from "antd";
import { addAnnouncement, deleteAnnouncement, fetchAnnouncements } from "@/services/api";
import { Cross2Icon } from "@radix-ui/react-icons";

type Announcement = {
  id: string;
  title: string;
  description: string;
  role: string;
  authorId?: string;
  created_at: string;
  type: "prayer" | "event" | "reminder" | "general";
  target: "all" | "teachers" | "students" | "staff";
};

export default function AnnouncementsPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    description: "",
    type: "general" as "prayer" | "event" | "reminder" | "general",
    target: "all" as "all" | "teachers" | "students" | "staff",
  });
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadGrades = async () => {
      try {
        const data = await fetchAnnouncements();
        setAnnouncements(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load grades");
        setLoading(false);
        console.error(err);
      }
    };
    loadGrades();
  }, []);

  const handleCreateAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.description) {
      setError("Title and description are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const announcementData = {
        name: newAnnouncement.title, // Assuming 'name' corresponds to the title
        title: newAnnouncement.title,
        description: newAnnouncement.description,
        role: currentUser?.role || "SCHOOL_ADMIN", // Default role if not available
        type: newAnnouncement.type,
        target: newAnnouncement.target,
        // Add other required fields if needed
      };

      const response = await addAnnouncement(announcementData);
      
      // Assuming the API returns the created announcement
      const createdAnnouncement = response.data;
      
      setAnnouncements([createdAnnouncement, ...announcements]);
      setNewAnnouncement({
        title: "",
        description: "",
        type: "general",
        target: "all",
      });
      setIsCreating(false);
      setError(null);
    } catch (err) {
      setError("Failed to create announcement");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (!announcementToDelete) return;
  
    try {
      await deleteAnnouncement(announcementToDelete);
      setAnnouncements(announcements.filter((announcement) => announcement.id !== announcementToDelete));
      setDeleteOpen(false);
      setAnnouncementToDelete(null);
    } catch (err) {
      setError("Failed to delete Announcement");
      console.error(err);
    }
  };
  
  const confirmDelete = (id: string) => {
    setAnnouncementToDelete(id);
    setDeleteOpen(true);
  };
  // Determine who can create announcements
  const canCreateAnnouncement =
    currentUser?.role === "SUPER_ADMIN" ||
    currentUser?.role === "SCHOOL_ADMIN" ||
    currentUser?.role === "TEACHER";

  // Check if user can delete a specific announcement
  const canDeleteAnnouncement = (announcement: Announcement) => {
    return (
      currentUser?.role === "SUPER_ADMIN" ||
      currentUser?.role === "SCHOOL_ADMIN" ||
      announcement.authorId === currentUser?.id
    );
  };

  // Filter announcements based on user role and target
  const filteredAnnouncements = announcements.filter((announcement) => {
    // Super admins can see everything
    if (currentUser?.role === "SUPER_ADMIN") return true;

    // School admins can see all except super-admin specific announcements
    if (currentUser?.role === "SCHOOL_ADMIN") {
      return true; // School admins can see all announcements
    }

    // Teachers can see all, teachers-only, and general announcements
    if (currentUser?.role === "TEACHER") {
      return (
        announcement.target === "all" ||
        announcement.target === "teachers" ||
        announcement.target === "staff"
      );
    }

    // Students can see all and students-only announcements
    if (currentUser?.role === "STUDENT") {
      return (
        announcement.target === "all" || announcement.target === "students"
      );
    }

    // Staff can see all and staff-only announcements
    if (currentUser?.role === "STAFF") {
      return announcement.target === "all" || announcement.target === "staff";
    }

    return false;
  });

  const badgeRibbonColors = {
    prayer: "green",
    event: "blue",
    reminder: "gold",
    general: "gray",
  };

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

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
    <div className="container mx-auto p-3 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Announcements</h1>
        {canCreateAnnouncement && (
          <Button
            onClick={() => setIsCreating(!isCreating)}
            className="cursor-pointer"
          >
            {isCreating ? "Cancel" : "New Announcement"}
          </Button>
        )}
      </div>

      {isCreating && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Announcement</CardTitle>
            <CardDescription>
              Share important updates with the community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Title (e.g., 'Ramadan Schedule')"
              value={newAnnouncement.title}
              onChange={(e) =>
                setNewAnnouncement({
                  ...newAnnouncement,
                  title: e.target.value,
                })
              }
            />
            <textarea
              className="w-full p-2 border rounded-md min-h-[100px]"
              placeholder="Content (e.g., 'The Taraweeh prayers will begin at 8:30 PM...')"
              value={newAnnouncement.description}
              onChange={(e) =>
                setNewAnnouncement({
                  ...newAnnouncement,
                  description: e.target.value,
                })
              }
              rows={4}
            />
            <div className="flex gap-4 flex-wrap">
              <select
                className="border rounded-md p-2 flex-1"
                value={newAnnouncement.type}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    type: e.target.value as any,
                  })
                }
              >
                <option value="event">Islamic Sudies</option>
                <option value="reminder">General</option>
              </select>
              <select
                className="border rounded-md p-2 flex-1"
                value={newAnnouncement.target}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    target: e.target.value as any,
                  })
                }
              >
                <option value="all">Everyone</option>
                <option value="teachers">Teachers Only</option>
                <option value="students">Students Only</option>
                <option value="staff">Staff Only</option>
              </select>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleCreateAnnouncement}
              className="cursor-pointer"
            >
               {isSubmitting ? "Publishing..." : "Publish Announcement"}
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No announcements yet. Check back later for updates.
          </p>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <Badge.Ribbon
              key={announcement.id}
              text={
                announcement.type.charAt(0).toUpperCase() +
                announcement.type.slice(1)
              }
              color={badgeRibbonColors[announcement.type]}
            >
              <Card className="hover:shadow-lg transition-shadow rounded-lg border border-gray-200 relative">
                {canDeleteAnnouncement(announcement) && (
                  <span
                    onClick={() => confirmDelete(announcement.id)}
                    className="absolute bottom-4 right-4 text-red-500 font-medium hover:text-red-700 transition-colors cursor-pointer"
                    aria-label="Delete announcement"
                  >
                    Delete
                  </span>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start gap-2 flex-wrap">
                    <CardTitle>{announcement.title}</CardTitle>
                  </div>
                  <CardDescription className="flex flex-wrap gap-2 items-center">
                    <span>{formatDate(announcement.created_at)}</span>
                    <span>•</span>
                    <span>Posted by {announcement.role}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line text-gray-700">
                    {announcement.description}
                  </p>
                </CardContent>
              </Card>
            </Badge.Ribbon>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog.Root open={deleteOpen} onOpenChange={setDeleteOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/50 data-[state=open]:animate-overlayShow fixed inset-0" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <Dialog.Title className="text-lg font-bold mb-4">
              Confirm Deletion
            </Dialog.Title>
            <p className="mb-6">
              Are you sure you want to delete this announcement? This action
              cannot be undone.
            </p>

            <div className="flex justify-end gap-4">
              <Dialog.Close asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.Close>
              <Button variant="destructive" onClick={handleDeleteAnnouncement}>
                Delete
              </Button>
            </div>

            <Dialog.Close asChild>
              <button
                className="text-gray-500 hover:text-gray-700 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
