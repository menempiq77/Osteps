"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Card, Input, Select, Badge, Button, Modal, Spin } from "antd";
import {
  addAnnouncement,
  deleteAnnouncement,
  fetchAnnouncements,
} from "@/services/api";

const { TextArea } = Input;
const { Option } = Select;

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
  const [announcementToDelete, setAnnouncementToDelete] = useState<
    string | null
  >(null);

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    description: "",
    type: "general" as "prayer" | "event" | "reminder" | "general",
    role: "all" as "all" | "teachers" | "students" | "staff",
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
        name: newAnnouncement.title,
        title: newAnnouncement.title,
        description: newAnnouncement.description,
        role: currentUser?.role || "SCHOOL_ADMIN",
        type: newAnnouncement.type,
      };

      const response = await addAnnouncement(announcementData);
      const createdAnnouncement = response.data;

      setAnnouncements([createdAnnouncement, ...announcements]);
      setNewAnnouncement({
        title: "",
        description: "",
        type: "general",
        role: "all",
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
      setAnnouncements(
        announcements.filter(
          (announcement) => announcement.id !== announcementToDelete
        )
      );
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
  const canCreateAnnouncement =
    currentUser?.role === "SUPER_ADMIN" ||
    currentUser?.role === "SCHOOL_ADMIN" ||
    currentUser?.role === "TEACHER";

  const canDeleteAnnouncement = (announcement: Announcement) => {
    return (
      currentUser?.role === "SUPER_ADMIN" ||
      currentUser?.role === "SCHOOL_ADMIN" ||
      announcement.authorId === currentUser?.id
    );
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    if (currentUser?.role === "SUPER_ADMIN") return true;

    if (currentUser?.role === "SCHOOL_ADMIN") return true;

    if (currentUser?.role === "TEACHER") {
      return true;
    }

    if (currentUser?.role === "STUDENT") {
      return true;
    }

    if (currentUser?.role === "STAFF") {
      return true;
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

  return (
    <div className="container mx-auto p-3 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Announcements</h1>
        {canCreateAnnouncement && (
          <Button
            onClick={() => setIsCreating(!isCreating)}
            className="!bg-primary !text-white hover:!bg-primary/90 hover:!border-primary transition-colors"
          >
            {isCreating ? "Cancel" : "New Announcement"}
          </Button>
        )}
      </div>

      {isCreating && (
        <Card
          title="Announcement"
          className="!mb-6"
          extra={
            <span className="text-gray-500">
              Share important updates with the community
            </span>
          }
        >
          <div className="space-y-4">
            <Input
              placeholder="Title (e.g., 'Ramadan Schedule')"
              value={newAnnouncement.title}
              onChange={(e) =>
                setNewAnnouncement({
                  ...newAnnouncement,
                  title: e.target.value,
                })
              }
              className="!mb-2 hover:!border-primary focus:!border-primary focus:ring-1 focus:!ring-primary transition-colors"
            />

            <TextArea
              placeholder="Content (e.g., 'The Taraweeh prayers will begin at 8:30 PM...')"
              value={newAnnouncement.description}
              onChange={(e) =>
                setNewAnnouncement({
                  ...newAnnouncement,
                  description: e.target.value,
                })
              }
              rows={4}
              className="!mb-2 hover:!border-primary focus:!border-primary focus:ring-1 focus:!ring-primary transition-colors"
            />

            <div className="flex gap-4 flex-wrap">
              <Select
                value={newAnnouncement.type}
                onChange={(value) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    type: value as any,
                  })
                }
                className="flex-1 min-w-[150px] hover:!border-primary focus:!border-primary focus:ring-1 focus:!ring-primary transition-colors"
              >
                <Option value="event">Islamic Studies</Option>
                <Option value="reminder">General</Option>
              </Select>

              <Select
                value={newAnnouncement.target}
                onChange={(value) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    target: value as any,
                  })
                }
                className="flex-1 min-w-[150px] hover:!border-primary focus:!border-primary focus:ring-1 focus:!ring-primary transition-colors"
              >
                <Option value="all">Everyone</Option>
                <Option value="teachers">Teachers Only</Option>
                <Option value="students">Students Only</Option>
              </Select>
            </div>

            <Button
              type="primary"
              onClick={handleCreateAnnouncement}
              loading={isSubmitting}
              className="!bg-primary !text-white hover:!bg-primary/90 hover:!border-primary transition-colors"
            >
              {isSubmitting ? "Publishing..." : "Publish Announcement"}
            </Button>
          </div>
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
                <div>
                  <div className="flex justify-between items-start gap-2 flex-wrap">
                    <h3 className="font-medium mb-1">{announcement.title}</h3>
                  </div>
                  <div className="flex flex-wrap text-xs text-gray-500 gap-2 items-center mb-4">
                    <span>{formatDate(announcement.created_at)}</span>
                    <span>•</span>
                    <span>Posted by {announcement.role}</span>
                  </div>
                </div>
                <div>
                  <p className="whitespace-pre-line text-gray-700">
                    {announcement.description}
                  </p>
                </div>
              </Card>
            </Badge.Ribbon>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Confirm Deletion"
        open={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onOk={handleDeleteAnnouncement}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        <p>Are you sure you want to delete.</p>
      </Modal>
    </div>
  );
}
