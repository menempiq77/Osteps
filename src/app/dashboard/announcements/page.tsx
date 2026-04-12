"use client";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  Input,
  Select,
  Modal,
  Spin,
  message,
} from "antd";
import {
  addAnnouncement,
  deleteAnnouncement,
  fetchAnnouncements,
  fetchUnseenAnnouncementCount,
  markAnnouncementAsSeen,
  updateAnnouncement,
} from "@/services/announcementApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Megaphone } from "lucide-react";
import { fetchSchools } from "@/services/schoolApi";
import { useSubjectContext } from "@/contexts/SubjectContext";

const { TextArea } = Input;
const { Option } = Select;
const PRIMARY_ADMIN_EMAIL = "abdelmonem@gmail.com";

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
    { value: "ALL", label: "All" },
    { value: "SCHOOL_ADMIN", label: "School Admins" },
    { value: "HOD", label: "HODs" },
    { value: "TEACHER", label: "Teachers" },
    { value: "STUDENT", label: "Students" },
  ],
  SCHOOL_ADMIN: [
    { value: "ALL", label: "All" },
    { value: "HOD", label: "HODs" },
    { value: "TEACHER", label: "Teachers" },
    { value: "STUDENT", label: "Students" },
  ],
  HOD: [
    { value: "ALL", label: "All" },
    { value: "TEACHER", label: "Teachers" },
    { value: "STUDENT", label: "Students" },
  ],
  TEACHER: [{ value: "STUDENT", label: "Students" }],
};

export default function AnnouncementsPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const { activeSubjectId, activeSubject } = useSubjectContext();
  const scopedSubjectName = String(activeSubject?.name || "").replace(/islamiat/gi, "Islamic").trim();
  const isPrimaryPlatformAdmin =
    String(currentUser?.email ?? "").trim().toLowerCase() === PRIMARY_ADMIN_EMAIL;
  const effectiveRole =
    currentUser?.role === "SUPER_ADMIN" || isPrimaryPlatformAdmin
      ? "SUPER_ADMIN"
      : String(currentUser?.role ?? "").trim().toUpperCase();
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
  const isSuperAdmin = effectiveRole === "SUPER_ADMIN";
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
      queryKey: ["unseen-announcement-count", effectiveRole, activeSubjectId ?? "all"],
      queryFn: fetchUnseenAnnouncementCount,
      enabled: !!effectiveRole,
    });

  // Fetch announcements with React Query
  const {
    data: announcements = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Announcement[]>({
    queryKey: ["announcements", activeSubjectId ?? "all"],
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
    const options = roleOptions[effectiveRole] || [];
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
    effectiveRole === "SUPER_ADMIN" ||
    effectiveRole === "SCHOOL_ADMIN" ||
    effectiveRole === "HOD" ||
    effectiveRole === "TEACHER";

  const canDeleteAnnouncement = (announcement: Announcement) => {
    return (
      effectiveRole === "SUPER_ADMIN" ||
      effectiveRole === "SCHOOL_ADMIN" ||
      effectiveRole === "HOD" ||
      announcement.authorId === currentUser?.id
    );
  };

  const canEditAnnouncement = (announcement: Announcement) => {
    return (
      effectiveRole === "SUPER_ADMIN" ||
      effectiveRole === "SCHOOL_ADMIN" ||
      effectiveRole === "HOD" ||
      announcement.authorId === currentUser?.id
    );
  };

  const filteredAnnouncements = announcements.filter((announcement) => {
    const rolesArray = announcement.roles?.map((r: any) => r.role_name) || [];

    if (rolesArray.includes("ALL")) return true;
    if (effectiveRole === "SUPER_ADMIN") return true;

    if (effectiveRole === "SCHOOL_ADMIN") return true;

    if (effectiveRole === "HOD") {
      return rolesArray.some((r) => ["HOD", "TEACHER", "STUDENT"].includes(r));
    }

    if (effectiveRole === "TEACHER") {
      return rolesArray.some((r) => ["TEACHER", "STUDENT"].includes(r));
    }

    if (effectiveRole === "STUDENT") {
      return rolesArray.includes("STUDENT") || rolesArray.length === 0;
    }

    return false;
  });

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const typeIcon: Record<string, string> = { event: "📅", reminder: "🔔", general: "📢" };
  const typeColor: Record<string, { bg: string; text: string; border: string }> = {
    event:    { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200" },
    reminder: { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200" },
    general:  { bg: "bg-gray-50",   text: "text-gray-600",   border: "border-gray-200" },
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-3 py-6 md:px-0">
      {contextHolder}

      {/* ── Header ── */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-gradient-to-br from-[var(--theme-soft)] via-white to-[var(--theme-soft-2)] p-6 md:p-8 shadow-sm">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--primary)] opacity-[0.06]" />
        <div className="absolute -left-6 -bottom-6 h-28 w-28 rounded-full bg-[var(--primary)] opacity-[0.04]" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[var(--theme-dark)] opacity-70">
              <Megaphone size={14} />
              {scopedSubjectName || "School"}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Announcements
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {filteredAnnouncements.length === 0
                ? "No announcements posted yet"
                : `${filteredAnnouncements.length} announcement${filteredAnnouncements.length !== 1 ? "s" : ""}`}
              {unseenCount > 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-[var(--primary)] px-2 py-0.5 text-xs font-semibold text-white">
                  {unseenCount} new
                </span>
              )}
            </p>
          </div>

          {canCreateAnnouncement && (
            <button
              type="button"
              onClick={handleNewAnnouncement}
              className="inline-flex items-center gap-2 rounded-xl border-0 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110 active:scale-[0.97]"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <span className="text-lg leading-none">+</span>
              New Announcement
            </button>
          )}
        </div>
      </div>

      {/* ── Create / Edit Form ── */}
      {isFormOpen && (
        <div
          ref={formRef}
          className="mb-8 rounded-2xl border border-[var(--theme-border)] bg-white p-5 shadow-sm md:p-7"
        >
          <h2 className="mb-5 text-lg font-semibold text-gray-800">
            {announcementForm.id ? "Edit Announcement" : "New Announcement"}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
              <Input
                placeholder="e.g., Exam Schedule Update"
                value={announcementForm.title}
                onChange={(e) =>
                  setAnnouncementForm({ ...announcementForm, title: e.target.value })
                }
                className="!rounded-lg hover:!border-[var(--primary)] focus:!border-[var(--primary)] focus:!ring-1 focus:!ring-[var(--primary)]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
              <TextArea
                placeholder="Write your announcement details here..."
                value={announcementForm.description}
                onChange={(e) =>
                  setAnnouncementForm({ ...announcementForm, description: e.target.value })
                }
                rows={4}
                className="!rounded-lg hover:!border-[var(--primary)] focus:!border-[var(--primary)] focus:!ring-1 focus:!ring-[var(--primary)]"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
                <Select
                  value={announcementForm.type}
                  onChange={(value) =>
                    setAnnouncementForm({ ...announcementForm, type: value as any })
                  }
                  className="w-full"
                >
                  <Option value="event">📅 Event</Option>
                  <Option value="reminder">🔔 Reminder</Option>
                  <Option value="general">📢 General</Option>
                </Select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Target Roles</label>
                <Select
                  mode="multiple"
                  value={announcementForm.role}
                  onChange={(value) => {
                    const options = roleOptions[effectiveRole] || [];
                    if (value.includes("ALL")) {
                      setAnnouncementForm((prev) => ({
                        ...prev,
                        role: options.map((o) => o.value).filter((v) => v !== "ALL"),
                      }));
                    } else {
                      setAnnouncementForm((prev) => ({ ...prev, role: value }));
                    }
                  }}
                  placeholder="Select roles"
                  className="w-full"
                >
                  {(roleOptions[effectiveRole] || []).map((opt) => (
                    <Option key={opt.value} value={opt.value}>{opt.label}</Option>
                  ))}
                </Select>
              </div>
            </div>

            {isSuperAdmin && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Target Schools</label>
                <Select
                  mode="multiple"
                  value={announcementForm.school_ids}
                  onChange={(value) =>
                    setAnnouncementForm((prev) => ({ ...prev, school_ids: value }))
                  }
                  placeholder="Select schools"
                  className="w-full"
                  loading={schoolsLoading}
                >
                  {schools.map((school) => (
                    <Option key={school.id} value={school.id}>{school.name}</Option>
                  ))}
                </Select>
              </div>
            )}

            {error && <div className="text-sm text-red-500">{String(error)}</div>}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitAnnouncement}
                disabled={announcementForm.id ? updateMutation.isPending : addMutation.isPending}
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white shadow transition hover:shadow-md hover:brightness-110 disabled:opacity-60"
                style={{ backgroundColor: "var(--primary)" }}
              >
                {announcementForm.id
                  ? updateMutation.isPending ? "Updating..." : "Update"
                  : addMutation.isPending ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Announcements List ── */}
      {filteredAnnouncements.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--theme-border)] bg-white py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--theme-soft)]">
            <Megaphone size={28} className="text-[var(--theme-dark)] opacity-60" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">No announcements yet</h3>
          <p className="mt-1 max-w-xs text-sm text-gray-400">
            When announcements are posted, they will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement, index) => {
            const rolesArray = announcement.roles?.map((r: any) => r.role_name) || [];
            const currentUserRecord = announcement.users?.find(
              (u: any) => Number(u.id) === Number(currentUser?.id)
            );
            const isSeen = (() => {
              if (currentUserRecord) return currentUserRecord.pivot?.is_seen === 1;
              if (!announcement.users?.length) return true;
              return true;
            })();
            const tc = typeColor[announcement.type] || typeColor.general;

            return (
              <div
                key={announcement.id || `announcement-${index}`}
                onClick={() => {
                  if (!isSeen && announcement.id && markingId === null) {
                    markSeenMutation.mutate(Number(announcement.id));
                  }
                }}
                className={`group relative rounded-2xl border bg-white p-5 transition-all hover:shadow-md ${
                  isSeen ? "border-gray-100" : "border-blue-300 bg-blue-50/40 ring-1 ring-blue-200"
                }`}
              >
                {/* Unseen dot */}
                {!isSeen && (
                  <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-blue-500 shadow" />
                )}

                {/* Type tag */}
                <div className="mb-3 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${tc.bg} ${tc.text} ${tc.border}`}>
                    {typeIcon[announcement.type] || "📢"}{" "}
                    {announcement.type?.charAt(0)?.toUpperCase() + announcement.type?.slice(1)}
                  </span>
                  <span className="text-xs text-gray-400">{formatDate(announcement.created_at)}</span>
                </div>

                {/* Title */}
                <h3 className="mb-1 text-base font-semibold text-gray-900">
                  {announcement.title}
                </h3>

                {/* Description */}
                <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
                  {announcement.description}
                </p>

                {/* Footer */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {rolesArray.length > 0
                      ? rolesArray.map((role: string) => (
                          <span
                            key={role}
                            className="rounded-md bg-[var(--theme-soft)] px-2 py-0.5 text-[11px] font-medium text-[var(--theme-dark)]"
                          >
                            {role}
                          </span>
                        ))
                      : <span className="text-xs text-gray-400">No specific audience</span>}
                  </div>

                  <div className="flex items-center gap-3">
                    {markingId === Number(announcement.id) && <Spin size="small" />}
                    {canEditAnnouncement(announcement) && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleEditAnnouncement(announcement); }}
                        className="text-xs font-medium text-[var(--theme-dark)] opacity-0 transition group-hover:opacity-100 hover:underline"
                      >
                        Edit
                      </button>
                    )}
                    {canDeleteAnnouncement(announcement) && (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); confirmDelete(announcement.id); }}
                        className="text-xs font-medium text-red-500 opacity-0 transition group-hover:opacity-100 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        title={
          <span className="flex items-center gap-2 text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            Delete Announcement
          </span>
        }
        open={deleteOpen}
        onCancel={() => setDeleteOpen(false)}
        onOk={handleDeleteAnnouncement}
        okText="Delete"
        okButtonProps={{ danger: true }}
        cancelText="Cancel"
        centered
      >
        <p className="text-gray-600">This action cannot be undone. Are you sure you want to delete this announcement?</p>
      </Modal>
    </div>
  );
}
