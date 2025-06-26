"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Card, Input, Select, Badge, Button, Modal, Spin, message } from "antd";
import { addAnnouncement, deleteAnnouncement, fetchAnnouncements, updateAnnouncement } from "@/services/announcementApi";

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
  target?: "School Admins" | "teachers" | "students";
};

export default function AnnouncementsPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);

  const [announcementForm, setAnnouncementForm] = useState({
    id: null as string | null,
    title: "",
    description: "",
    type: "",
    target: "",
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const data = await fetchAnnouncements();
        setAnnouncements(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load announcements");
        setLoading(false);
        console.error(err);
      }
    };
    loadAnnouncements();
  }, []);

  const handleSubmitAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.description) {
      setError("Title and description are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const announcementData = {
        title: announcementForm.title,
        description: announcementForm.description,
        type: announcementForm.type,
        role: announcementForm.target,
      };

      let response;
      if (announcementForm.id) {
        response = await updateAnnouncement(announcementForm.id, announcementData);
        setAnnouncements(announcements.map(ann => 
          ann.id === announcementForm.id ? response.data : ann
        ));
        message.success("Announcement updated successfully");
      } else {
        response = await addAnnouncement({
          ...announcementData,
          authorId: currentUser?.id,
        });
        setAnnouncements([response.data, ...announcements]);
        message.success("Announcement created successfully");
      }

      resetForm();
    } catch (err) {
      setError(announcementForm.id 
        ? "Failed to update announcement" 
        : "Failed to create announcement");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setAnnouncementForm({
      id: null,
      title: "",
      description: "",
      type: "general",
      target: "",
    });
    setIsFormOpen(false);
    setError(null);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setAnnouncementForm({
      id: announcement.id,
      title: announcement.title,
      description: announcement.description,
      type: announcement.type,
      target: announcement.role,
    });
    setIsFormOpen(true);
  };

  const handleNewAnnouncement = () => {
    resetForm();
    setIsFormOpen(true);
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
      message.success("Announcement deleted successfully");
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

  const canEditAnnouncement = (announcement: Announcement) => {
    return (
      currentUser?.role === "SUPER_ADMIN" ||
      currentUser?.role === "SCHOOL_ADMIN" ||
      announcement.authorId === currentUser?.id
    );
  };

 const filteredAnnouncements = announcements.filter((announcement) => {
  if (currentUser?.role === "SUPER_ADMIN") return true;
  if (currentUser?.role === "SCHOOL_ADMIN") {
    return true;
  }
  if (currentUser?.role === "TEACHER") {
    return announcement.role === "TEACHER" || !announcement.role;
  }
  if (currentUser?.role === "STUDENT") {
    return announcement.role === "STUDENT" || !announcement.role;
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
            onClick={handleNewAnnouncement}
            className="!bg-primary !text-white hover:!bg-primary/90 hover:!border-primary transition-colors"
          >
            New Announcement
          </Button>
        )}
      </div>

      {isFormOpen && (
        <Card
          title={announcementForm.id ? "Edit Announcement" : "New Announcement"}
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
              value={announcementForm.title}
              onChange={(e) =>
                setAnnouncementForm({
                  ...announcementForm,
                  title: e.target.value,
                })
              }
              className="!mb-2 hover:!border-primary focus:!border-primary focus:ring-1 focus:!ring-primary transition-colors"
            />

            <TextArea
              placeholder="Content (e.g., 'The Taraweeh prayers will begin at 8:30 PM...')"
              value={announcementForm.description}
              onChange={(e) =>
                setAnnouncementForm({
                  ...announcementForm,
                  description: e.target.value,
                })
              }
              rows={4}
              className="!mb-2 hover:!border-primary focus:!border-primary focus:ring-1 focus:!ring-primary transition-colors"
            />

            <div className="flex gap-4 flex-wrap">
              <Select
                value={announcementForm.type}
                onChange={(value) =>
                  setAnnouncementForm({
                    ...announcementForm,
                    type: value as any,
                  })
                }
                className="flex-1 min-w-[150px] hover:!border-primary focus:!border-primary focus:ring-1 focus:!ring-primary transition-colors"
              >
                <Option value="event">Event</Option>
                <Option value="reminder">Reminder</Option>
                <Option value="general">General</Option>
              </Select>

              <Select
                value={announcementForm.role}
                onChange={(value) =>
                  setAnnouncementForm({
                    ...announcementForm,
                    target: value as any,
                  })
                }
                placeholder="Target Audience"
                className="flex-1 min-w-[150px] hover:!border-primary focus:!border-primary focus:ring-1 focus:!ring-primary transition-colors"
              >
                <Option value="SCHOOL_ADMIN">School Admins</Option>
                <Option value="TEACHER">Teachers</Option>
                <Option value="STUDENT">Students</Option>
              </Select>
            </div>

            {error && <div className="text-red-500">{error}</div>}

            <div className="flex gap-3">
              <Button
                type="primary"
                onClick={handleSubmitAnnouncement}
                loading={isSubmitting}
                className="!bg-primary !text-white hover:!bg-primary/90 hover:!border-primary transition-colors"
              >
                {isSubmitting 
                  ? announcementForm.id 
                    ? "Updating..." 
                    : "Publishing..."
                  : announcementForm.id 
                    ? "Update Announcement" 
                    : "Publish Announcement"}
              </Button>
              <Button
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
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
                <div className="absolute bottom-4 right-4 flex gap-3">
                  {canEditAnnouncement(announcement) && (
                    <span
                      onClick={() => handleEditAnnouncement(announcement)}
                      className="text-primary font-medium hover:text-primary/70 transition-colors cursor-pointer"
                      aria-label="Edit announcement"
                    >
                      Edit
                    </span>
                  )}
                  {canDeleteAnnouncement(announcement) && (
                    <span
                      onClick={() => confirmDelete(announcement.id)}
                      className="text-red-500 font-medium hover:text-red-700 transition-colors cursor-pointer"
                      aria-label="Delete announcement"
                    >
                      Delete
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex justify-between items-start gap-2 flex-wrap">
                    <h3 className="font-medium mb-1">{announcement.title}</h3>
                  </div>
                  <div className="flex flex-wrap text-xs text-gray-500 gap-2 items-center mb-4">
                    <span>{formatDate(announcement.created_at)}</span>
                    <span>•</span>
                    <span>Posted For {announcement.role}</span>
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
        <p>Are you sure you want to delete this announcement?</p>
      </Modal>
    </div>
  );
}