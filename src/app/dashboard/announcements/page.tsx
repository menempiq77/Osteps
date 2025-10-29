"use client";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Card,
  Input,
  Select,
  Badge,
  Button,
  Modal,
  Spin,
  message,
  Breadcrumb,
} from "antd";
import {
  addAnnouncement,
  deleteAnnouncement,
  fetchAnnouncements,
  fetchUnseenAnnouncementCount,
  markAnnouncementAsSeen,
  updateAnnouncement,
} from "@/services/announcementApi";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Megaphone } from "lucide-react";
import { fetchSchools } from "@/services/schoolApi";

const { TextArea } = Input;
const { Option } = Select;

type Announcement = {
  id: string;
  title: string;
  description: string;
  role: string;
  authorId?: string;
  created_at: string;
  type: "event" | "reminder" | "general";
  target?: "School Admins" | "teachers" | "students";
};
const roleOptions: Record<string, { value: string; label: string }[]> = {
  SUPER_ADMIN: [
    { value: "ALL", label: "ALL" },
    { value: "SCHOOL_ADMIN", label: "School Admins" },
    { value: "HOD", label: "HOD" },
    { value: "TEACHER", label: "Teachers" },
    { value: "STUDENT", label: "Students" },
  ],
  SCHOOL_ADMIN: [
    { value: "ALL", label: "ALL" },
    { value: "HOD", label: "HOD" },
    { value: "TEACHER", label: "Teachers" },
    { value: "STUDENT", label: "Students" },
  ],
  HOD: [
    { value: "ALL", label: "ALL" },
    { value: "TEACHER", label: "Teachers" },
    { value: "STUDENT", label: "Students" },
  ],
  TEACHER: [{ value: "STUDENT", label: "Students" }],
};

export default function AnnouncementsPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const queryClient = useQueryClient();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<
    string | null
  >(null);

  const [announcementForm, setAnnouncementForm] = useState({
    id: null as string | null,
    title: "",
    description: "",
    type: "",
    role: [] as string[],
    school_ids: [] as string[],
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const isSuperAdmin = currentUser?.role === "SUPER_ADMIN";
  const [schools, setSchools] = useState<any[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(true);
  const [markingId, setMarkingId] = useState<number | null>(null);

  const loadSchools = async () => {
    try {
      setSchoolsLoading(true);
      const data = await fetchSchools();
      setSchools(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSchoolsLoading(false);
    }
  };
  useEffect(() => {
    loadSchools();
  }, []);

  const { data: unseenCount = 0 } = useQuery({
      queryKey: ["unseen-announcement-count", currentUser?.role],
      queryFn: fetchUnseenAnnouncementCount,
      enabled: !!currentUser?.role,
    });

  // Fetch announcements with React Query
  const {
    data: announcements = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn: fetchAnnouncements,
  });

  // Mutations for CRUD operations
  const addMutation = useMutation({
    mutationFn: addAnnouncement,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["announcements"],
        (old: Announcement[] = []) => [data, ...old]
      );
      messageApi.success("Announcement created successfully");
      resetForm();
      refetch();
    },
    onError: () => {
      messageApi.error("Failed to create announcement");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateAnnouncement(id, data),
    onSuccess: (data) => {
      queryClient.setQueryData(["announcements"], (old: Announcement[] = []) =>
        old.map((ann) => (ann.id === data.id ? data : ann))
      );
      messageApi.success("Announcement updated successfully");
      resetForm();
      refetch();
    },
    onError: () => {
      messageApi.error("Failed to update announcement");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: (_, id) => {
      queryClient.setQueryData(["announcements"], (old: Announcement[] = []) =>
        old.filter((ann) => ann.id !== id)
      );
      messageApi.success("Announcement deleted successfully");
      setDeleteOpen(false);
      setAnnouncementToDelete(null);
    },
    onError: () => {
      messageApi.error("Failed to delete announcement");
    },
  });

  const markSeenMutation = useMutation({
    mutationFn: async (id: number) => {
      setMarkingId(id);
      const result = await markAnnouncementAsSeen(id);
      return result;
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(["announcements"], (old: any[] = []) =>
        old.map((ann) => {
          if (Number(ann.id) === Number(id)) {
            const updatedUsers = ann.users?.map((user: any) =>
              Number(user.id) === Number(currentUser?.id)
                ? { ...user, pivot: { ...user.pivot, is_seen: 1 } }
                : user
            );
            return { ...ann, users: updatedUsers };
          }
          return ann;
        })
      );
      queryClient.invalidateQueries({
      queryKey: ["unseen-announcement-count", currentUser?.role],
    });
    },
    onSettled: () => {
      setMarkingId(null);
    },
  });

  const handleSubmitAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.description) {
      messageApi.error("Title and description are required");
      return;
    }

    const announcementData = {
      title: announcementForm.title,
      description: announcementForm.description,
      type: announcementForm.type,
      role: announcementForm.role,
      school_ids: announcementForm.school_ids,
    };

    if (announcementForm.id) {
      updateMutation.mutate({
        id: announcementForm.id,
        data: announcementData,
      });
    } else {
      addMutation.mutate({
        ...announcementData,
        authorId: currentUser?.id,
      });
    }
  };

  const resetForm = () => {
    setAnnouncementForm({
      id: null,
      title: "",
      description: "",
      type: "general",
      role: [],
      school_ids: [],
    });
    setIsFormOpen(false);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setAnnouncementForm({
      id: announcement.id,
      title: announcement.title,
      description: announcement.description,
      type: announcement.type,
      role: announcement.role
        ? Array.isArray(announcement.role)
          ? announcement.role
          : [announcement.role]
        : [],
      school_ids: announcement.school_ids || [],
    });
    setIsFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const handleNewAnnouncement = () => {
    const options = roleOptions[currentUser?.role ?? ""] || [];
    setAnnouncementForm({
      id: null,
      title: "",
      description: "",
      type: "general",
      target: options[0]?.value || "",
    });
    setIsFormOpen(true);
  };

  const handleDeleteAnnouncement = async () => {
    if (!announcementToDelete) return;
    deleteMutation.mutate(announcementToDelete);
  };

  const confirmDelete = (id: string) => {
    setAnnouncementToDelete(id);
    setDeleteOpen(true);
  };

  const canCreateAnnouncement =
    currentUser?.role === "SUPER_ADMIN" ||
    currentUser?.role === "SCHOOL_ADMIN" ||
    currentUser?.role === "HOD" ||
    currentUser?.role === "TEACHER";

  const canDeleteAnnouncement = (announcement: Announcement) => {
    return (
      currentUser?.role === "SUPER_ADMIN" ||
      currentUser?.role === "SCHOOL_ADMIN" ||
      currentUser?.role === "HOD" ||
      announcement.authorId === currentUser?.id
    );
  };

  const canEditAnnouncement = (announcement: Announcement) => {
    return (
      currentUser?.role === "SUPER_ADMIN" ||
      currentUser?.role === "SCHOOL_ADMIN" ||
      currentUser?.role === "HOD" ||
      announcement.authorId === currentUser?.id
    );
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    const rolesArray = announcement.roles?.map((r: any) => r.role_name) || [];

    if (rolesArray.includes("ALL")) return true;
    if (currentUser?.role === "SUPER_ADMIN") return true;

    if (currentUser?.role === "SCHOOL_ADMIN") return true;

    if (currentUser?.role === "HOD") {
      return rolesArray.some((r) => ["HOD", "TEACHER", "STUDENT"].includes(r));
    }

    if (currentUser?.role === "TEACHER") {
      return rolesArray.some((r) => ["TEACHER", "STUDENT"].includes(r));
    }

    if (currentUser?.role === "STUDENT") {
      return rolesArray.includes("STUDENT") || rolesArray.length === 0;
    }

    return false;
  });

  const badgeRibbonColors = {
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

  if (isLoading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-3 md:p-6">
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <span>Announcements</span>,
          },
        ]}
        className="!mb-2"
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-medium flex items-center gap-3">
          <Megaphone />
          Announcements
        </h1>
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
          ref={formRef}
          title={announcementForm.id ? "Edit Announcement" : "New Announcement"}
          className="!mb-6"
          extra={
            <span className="text-gray-500">
              Share important updates with the community
            </span>
          }
        >
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Title
              </label>
              <Input
                placeholder="e.g., 'Exam Schedule'"
                value={announcementForm.title}
                onChange={(e) =>
                  setAnnouncementForm({
                    ...announcementForm,
                    title: e.target.value,
                  })
                }
                className="hover:!border-primary focus:!border-primary focus:ring-1 focus:!ring-primary transition-colors"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Description
              </label>
              <TextArea
                placeholder="e.g., 'The exam will begin at 8:30 PM...'"
                value={announcementForm.description}
                onChange={(e) =>
                  setAnnouncementForm({
                    ...announcementForm,
                    description: e.target.value,
                  })
                }
                rows={4}
                className="hover:!border-primary focus:!border-primary focus:ring-1 focus:!ring-primary transition-colors"
              />
            </div>

            {/* Announcement Type */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Announcement Type
              </label>
              <Select
                value={announcementForm.type}
                onChange={(value) =>
                  setAnnouncementForm({
                    ...announcementForm,
                    type: value as any,
                  })
                }
                className="w-full hover:!border-primary focus:!border-primary focus:ring-1 focus:!ring-primary transition-colors"
              >
                <Option value="event">Event</Option>
                <Option value="reminder">Reminder</Option>
                <Option value="general">General</Option>
              </Select>
            </div>

            {/* Target Roles */}
            <div>
              <label className="block mb-1 font-medium text-gray-700">
                Target Roles
              </label>
              <Select
                mode="multiple"
                value={announcementForm.role}
                onChange={(value) => {
                  const options = roleOptions[currentUser?.role ?? ""] || [];

                  if (value.includes("ALL")) {
                    const allExceptAll = options
                      .map((opt) => opt.value)
                      .filter((v) => v !== "ALL");

                    setAnnouncementForm((prev) => ({
                      ...prev,
                      role: allExceptAll,
                    }));
                  } else {
                    setAnnouncementForm((prev) => ({
                      ...prev,
                      role: value,
                    }));
                  }
                }}
                placeholder="Select roles"
                className="w-full hover:!border-primary focus:!border-primary focus:ring-1 focus:!ring-primary transition-colors"
              >
                {(roleOptions[currentUser?.role ?? ""] || []).map((opt) => (
                  <Option key={opt.value} value={opt.value}>
                    {opt.label}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Target Schools (only for super admin) */}
            {isSuperAdmin && (
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Target Schools
                </label>
                <Select
                  mode="multiple"
                  value={announcementForm.school_ids}
                  onChange={(value) =>
                    setAnnouncementForm((prev) => ({
                      ...prev,
                      school_ids: value,
                    }))
                  }
                  placeholder="Select schools"
                  className="w-full hover:!border-primary focus:!border-primary focus:ring-1 focus:!ring-primary transition-colors"
                  loading={schoolsLoading}
                >
                  {schools.map((school) => (
                    <Option key={school.id} value={school.id}>
                      {school.name}
                    </Option>
                  ))}
                </Select>
              </div>
            )}

            {error && <div className="text-red-500">{error}</div>}

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button onClick={resetForm}>Cancel</Button>
              <Button
                type="primary"
                onClick={handleSubmitAnnouncement}
                loading={
                  announcementForm.id
                    ? updateMutation.isPending
                    : addMutation.isPending
                }
                className="!bg-primary !text-white hover:!bg-primary/90 hover:!border-primary transition-colors"
              >
                {announcementForm.id
                  ? updateMutation.isPending
                    ? "Updating..."
                    : "Update Announcement"
                  : addMutation.isPending
                  ? "Publishing..."
                  : "Publish Announcement"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <Card className="text-gray-500 text-center py-8">
            No announcements yet. Check back later for updates.
          </Card>
        ) : (
          filteredAnnouncements.map((announcement, index) => {
            const rolesArray =
              announcement.roles?.map((r: any) => r.role_name) || [];

            const currentUserRecord = announcement.users?.find(
              (u: any) => Number(u.id) === Number(currentUser?.id)
            );

            const isSeen = (() => {
              if (currentUserRecord)
                return currentUserRecord.pivot?.is_seen === 1;
              if (!announcement.users?.length) return true;
              return true;
            })();

            return (
              <div
                key={announcement.id || `announcement-${index}`}
                className={`p-1 rounded-lg transition-all`}
              >
                <Badge.Ribbon
                  text={
                    announcement?.type?.charAt(0)?.toUpperCase() +
                    announcement?.type?.slice(1)
                  }
                  color={badgeRibbonColors[announcement.type]}
                >
                  <Card
                    onClick={() => {
                      if (!isSeen && announcement.id && markingId === null) {
                        markSeenMutation.mutate(Number(announcement.id));
                      }
                    }}
                    className={`hover:shadow-lg transition-shadow rounded-lg ${
                      isSeen
                        ? "!bg-white"
                        : "!bg-blue-50 border border-blue-300"
                    } relative`}
                  >
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
                      {markingId === Number(announcement.id) && (
                        <Spin size="small" className="" />
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between items-start gap-2 flex-wrap">
                        <h3 className="font-medium mb-1">
                          {announcement.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap text-xs text-gray-500 gap-2 items-center mb-4">
                        <span>{formatDate(announcement.created_at)}</span>
                        <span>•</span>
                        <span>
                          Posted For{" "}
                          {rolesArray.length > 0 ? rolesArray.join(", ") : "—"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="whitespace-pre-line text-gray-700">
                        {announcement.description}
                      </p>
                    </div>
                  </Card>
                </Badge.Ribbon>
              </div>
            );
          })
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
