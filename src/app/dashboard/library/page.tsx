"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  BellOutlined,
  CheckOutlined,
  CloseOutlined,
  DeleteOutlined,
  EditOutlined,
  FileOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Drawer,
  Form,
  Grid,
  Input,
  message,
  Modal,
  Space,
  Spin,
  Tabs,
  Tag,
  Typography,
} from "antd";
import useMediaQuery from "@/hooks/useMediaQuery";
import UploadResourceModal from "@/components/modals/UploadResourceModal";
import ViewResourceModal from "@/components/modals/ViewResourceModal";
import { Plus } from "lucide-react";
import Link from "next/link";
import { IMG_BASE_URL } from "@/lib/config";
import {
  addLibrary,
  approveLibraryRequest,
  deleteLibrary,
  fetchCategories,
  fetchLibrary,
  fetchLibraryRequests,
  fetchResources,
  rejectLibraryRequest,
  updateLibrary,
} from "@/services/libraryApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
const { useBreakpoint } = Grid;

type LibraryItem = {
  id: string;
  title: string;
  type: "book" | "video" | "pdf" | "audio";
  url: string;
  uploadedBy: string;
  uploadDate: string;
  size: string;
  category: "Quran" | "Hadees" | "Tafseer" | "Seerah" | "Fiqh" | "Dua";
  description?: string;
  tags?: string[] | string;
  library_resources_id?: number;
  library_categories_id?: number;
  file_path?: string;
  thumbnail_url?: string | null;
  updated_at?: string;
  uploaded_by?: string;
};

export default function LibraryPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [activeTypeTab, setActiveTypeTab] = React.useState<string>("all");
  const [activeCategoryTab, setActiveCategoryTab] =
    React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [currentItem, setCurrentItem] = React.useState<LibraryItem | null>(
    null
  );
  const [isEditing, setIsEditing] = React.useState(false);
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const [fileList, setFileList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [categories, setCategories] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [debugError, setDebugError] = useState<any>(null);
  const queryClient = useQueryClient();

  // ── Approvals bell (SCHOOL_ADMIN only) ──────────────────────────────────
  const isSchoolAdmin = currentUser?.role === "SCHOOL_ADMIN";
  const [approvalsOpen, setApprovalsOpen] = useState(false);
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [approvalsLoading, setApprovalsLoading] = useState(false);

  const loadPendingItems = async () => {
    if (!isSchoolAdmin) return;
    try {
      setApprovalsLoading(true);
      const data = await fetchLibraryRequests();
      setPendingItems(data.filter((item: any) => item.status === "pending"));
    } catch {
      // silently ignore
    } finally {
      setApprovalsLoading(false);
    }
  };

  useEffect(() => {
    loadPendingItems();
  }, [isSchoolAdmin]);

  const handleApprove = async (id: number) => {
    try {
      await approveLibraryRequest(id);
      messageApi.success("Request approved");
      await loadPendingItems();
      await queryClient.invalidateQueries({ queryKey: ["libraryItems"] });
    } catch {
      messageApi.error("Failed to approve");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectLibraryRequest(id);
      messageApi.success("Request rejected");
      await loadPendingItems();
    } catch {
      messageApi.error("Failed to reject");
    }
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const data = await fetchResources();
        setResources(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  const {
    data: libraryItems = [],
    isLoading,
  } = useQuery({
    queryKey: ["libraryItems"],
    queryFn: async () => {
      const data = await fetchLibrary();
      return data;
    },
    onError: (err: any) => {
      console.error(err);
      messageApi.error("Failed to fetch Library Items");
    },
  });

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" ||
    currentUser?.role === "HOD" ||
    currentUser?.role === "TEACHER";
  const isTeacher = currentUser?.role === "TEACHER";
  const schoolId = currentUser?.school;

  // Helper to clean file paths by removing /storage/ prefix from external URLs
  const cleanFilePath = (filePath?: string) => {
    if (!filePath) return "";
    let clean = String(filePath).trim();
    console.log('cleanFilePath - Input:', clean);
    
    // Remove /storage/ prefix from both absolute and relative URLs
    if (clean.includes('/storage/https://') || clean.includes('/storage/http://')) {
      console.log('cleanFilePath - Found /storage/http(s):// pattern');
      clean = clean.replace(/.*\/storage\//, '');
      console.log('cleanFilePath - After removing /storage/:', clean);
    }
    return clean;
  };

  const typeTabItems = [
    { label: <span className="font-medium">All Resources</span>, key: "all" },
    ...resources?.map((type) => ({
      label: <span className="font-medium">{type.name}</span>,
      key: type.name.toLowerCase(),
    })),
    ...(canUpload
      ? [
          {
            label: (
              <span className="font-medium flex items-center text-green-500">
                <PlusOutlined className="mr-1" /> Add More
              </span>
            ),
            key: "add",
          },
        ]
      : []),
  ];

  const handleUpload = async (values: any) => {
    setLoading(true);
    try {
      const tags = Array.isArray(values.tags)
        ? values.tags.map((tag: string) => tag.trim()).filter(Boolean)
        : typeof values.tags === "string"
        ? values.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("library_resources_id", values.type);
      formData.append("library_categories_id", values.category);
      formData.append("description", values.description || "");
      formData.append("school_id", schoolId?.toString() || "");
      if (tags.length > 0) {
        formData.append("tags", tags.join(","));
      }
      formData.append(
        "thumbnail_url",
        values.thumbnail_url ? String(values.thumbnail_url).trim() : ""
      );

      if (values.source === "link" && values.link) {
        formData.append("external_link", values.link);
        formData.append("link", values.link);
      } else if (fileList.length > 0) {
        const fileToUpload = fileList[0]?.originFileObj || fileList[0];
        const isNewUpload = Boolean(fileToUpload?.originFileObj || fileToUpload instanceof File);

        if (isNewUpload) {
          const normalizedFile = fileToUpload?.originFileObj || fileToUpload;
          formData.append("file_path", normalizedFile);
        }
      }

      if (isEditing && currentItem) {
        await updateLibrary(currentItem.id, formData);
        messageApi.success(isTeacher ? "Resource updated successfully and sent for approval" : "Resource updated successfully!");
      } else {
        await addLibrary(formData);
        messageApi.success(isTeacher ? "Resource added successfully and sent for approval" : "Resource added successfully!");
      }

      // Refresh the library items
      await queryClient.invalidateQueries({ queryKey: ["libraryItems"] });

      setIsUploadModalOpen(false);
      form.resetFields();
      setFileList([]);
      setCurrentItem(null);
      setIsEditing(false);
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message;
      setDebugError({
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message,
      });
      messageApi.error(
        apiMessage ||
          `Failed to ${
            isEditing ? "update" : "upload"
          } resource. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const item = libraryItems.find((i) => i.id === itemToDelete);
      await deleteLibrary(itemToDelete, item?.file_path);
      messageApi.success("Deleted successfully");
      await queryClient.invalidateQueries({ queryKey: ["libraryItems"] });

    } catch (error) {
      messageApi.error("Delete failed");
    } finally {
      setDeleteModalVisible(false);
      setItemToDelete(null);
    }
  };

  const handleEdit = (item: LibraryItem) => {
    // Use the cleanFilePath helper to handle both absolute and relative /storage/ patterns
    const cleanPath = cleanFilePath(item.file_path);
    console.log('handleEdit - Cleaned path:', cleanPath);

    const isLink = isExternalLink(cleanPath);
    setCurrentItem(item);
    setIsEditing(true);
    setIsUploadModalOpen(true);
    form.setFieldsValue({
      title: item.title,
      type: item.library_resources_id,
      category: item.library_categories_id,
      description: item.description,
      tags: parseTags(item.tags),
      thumbnail_url: item.thumbnail_url || undefined,
      source: isLink ? "link" : "upload",
      link: isLink ? cleanPath : undefined,
    });

    setFileList(
      !isLink && cleanPath
        ? [
            {
              uid: "-1",
              name: item.title,
              status: "done",
              url: cleanPath,
            },
          ]
        : []
    );
  };

  const openResourceDirectly = (item: any) => {
    if (!item?.file_path) return;
    const resourceType = getResourceName(item.library_resources_id).toLowerCase();

    // Use the cleanFilePath helper to handle both absolute and relative /storage/ patterns
    const cleanPath = cleanFilePath(item.file_path);
    console.log('openResourceDirectly - Cleaned path:', cleanPath);

    setCurrentItem({
      ...item,
      type: resourceType,
      url: cleanPath,
      uploadedBy: item.uploaded_by || "Unknown",
      uploadDate: item.updated_at
        ? new Date(item.updated_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A",
      size: item.size || "N/A",
      subject: getCategoryName(item.library_categories_id),
      tags: parseTags(item.tags),
      thumbnail_url: item.thumbnail_url || undefined,
    });
    setIsViewModalOpen(true);
  };

  const openUploadModal = () => {
    setIsEditing(false);
    setCurrentItem(null);
    form.resetFields();
    form.setFieldsValue({ source: "upload", link: undefined, tags: [] });
    setFileList([]);
    setIsUploadModalOpen(true);
  };

  const getEmojiForType = (type: string) => {
    const key = (type || "").toLowerCase();
    const emojiMap: Record<string, string> = {
      pdf: "\u{1F4C4}",
      book: "\u{1F4DA}",
      document: "\u{1F4DD}",
      video: "\u{1F3AC}",
      audio: "\u{1F3A7}",
      website: "\u{1F310}",
      link: "\u{1F517}",
    };
    return emojiMap[key] || "\u{1F4D8}";
  };

  const getEmojiStyleForType = (type: string) => {
    const key = (type || "").toLowerCase();
    const styleMap: Record<string, { bg: string; border: string; shadow: string }> = {
      pdf: { bg: "#EEF2FF", border: "#C7D2FE", shadow: "rgba(79,70,229,0.12)" },
      book: { bg: "#ECFDF3", border: "#A7F3D0", shadow: "rgba(16,185,129,0.14)" },
      document: { bg: "#FFF7ED", border: "#FED7AA", shadow: "rgba(234,88,12,0.12)" },
      video: { bg: "#FEF2F2", border: "#FECACA", shadow: "rgba(239,68,68,0.12)" },
      audio: { bg: "#F5F3FF", border: "#DDD6FE", shadow: "rgba(124,58,237,0.12)" },
      website: { bg: "#ECFEFF", border: "#A5F3FC", shadow: "rgba(8,145,178,0.12)" },
      link: { bg: "#F0FDF4", border: "#BBF7D0", shadow: "rgba(34,197,94,0.12)" },
    };
    return (
      styleMap[key] || {
        bg: "#F3F4F6",
        border: "#E5E7EB",
        shadow: "rgba(17,24,39,0.08)",
      }
    );
  };

  const getResourceName = (id: number | string) => {
    const resourceId = Number(id);
    const resource = resources.find((res) => Number(res.id) === resourceId);
    return resource?.name || "Unknown";
  };

  const parseTags = (tags: unknown): string[] => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags.map((tag) => String(tag).trim()).filter(Boolean);
    if (typeof tags === "string") {
      return tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    }
    return [];
  };

  const isExternalLink = (url?: string) => {
    if (!url) return false;
    const isHttp = /^https?:\/\//i.test(url);
    const hasVideoExtension = /\.(mp4|mov|avi|mkv|webm)(\?|#|$)/i.test(url);
    const isInternal = url.startsWith(IMG_BASE_URL);
    return isHttp && !isInternal && !hasVideoExtension;
  };

  const getVideoEmbedUrl = (url: string) => {
    const youTubeMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/i
    );
    if (youTubeMatch?.[1]) {
      return `https://www.youtube.com/embed/${youTubeMatch[1]}`;
    }

    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/i);
    if (vimeoMatch?.[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return url;
  };

  const getYouTubeId = (url: string) => {
    const youTubeMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/i
    );
    return youTubeMatch?.[1] || null;
  };

  const getVideoThumbnailUrl = (url: string) => {
    const youTubeId = getYouTubeId(url);
    if (youTubeId) {
      return `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`;
    }
    return "";
  };

  const getFileExtension = (url: string) => {
    const cleanUrl = url.split("?")[0].split("#")[0];
    const lastDot = cleanUrl.lastIndexOf(".");
    if (lastDot === -1) return "";
    return cleanUrl.slice(lastDot + 1).toLowerCase();
  };

  const isImageUrl = (url: string) => {
    const ext = getFileExtension(url);
    return ["jpg", "jpeg", "png", "webp", "gif"].includes(ext);
  };

  const getLinkDomain = (url: string) => {
    try {
      const { hostname } = new URL(url);
      return hostname.replace(/^www\./i, "");
    } catch {
      return url;
    }
  };

  const getCategoryName = (id: number | string) => {
    const categoryId = Number(id);
    const category = categories.find((cat) => Number(cat.id) === categoryId);
    return formatCategoryLabel(category?.name) || "Unknown";
  };

  const getCategoryColor = (id: number | string) => {
    const categoryId = Number(id);
    const category = categories.find((cat) => Number(cat.id) === categoryId);
    return category?.color || "default";
  };

  const formatCategoryLabel = (name?: string) => {
    if (!name) return "";
    const key = name.trim().toLowerCase();
    const labelMap: Record<string, string> = {
      dua: "Dua'",
      fiqa: "Fiqh",
      fiqh: "Fiqh",
      hadees: "Hadith",
      hadith: "Hadith",
      quran: "Qur'an",
      seerah: "Seerah",
      tafseer: "Tafsir",
    };
    return labelMap[key] || name;
  };

  const filteredItems = libraryItems?.filter((item) => {
    const typeMatch =
      activeTypeTab === "all" ||
      getResourceName(item.library_resources_id).toLowerCase() ===
        activeTypeTab;

    const categoryMatch =
      activeCategoryTab === "all" ||
      String(item.library_categories_id ?? "") === String(activeCategoryTab);

    const query = searchQuery.trim().toLowerCase();
    const searchMatch =
      !query ||
      [
        item.title,
        item.description,
        getCategoryName(item.library_categories_id),
        getResourceName(item.library_resources_id),
        parseTags(item.tags).join(" "),
      ]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(query));

    return typeMatch && categoryMatch && searchMatch;
  });

  const totalResourcesCount = libraryItems?.length || 0;
  const visibleResourcesCount = filteredItems?.length || 0;

  if (isLoading)
    return (
      <div className="p-3 md:p-6 flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );

  return (
    <div className="p-3 md:p-6">
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <span>Library</span>,
          },
        ]}
        className="!mb-3"
      />

      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div
          className="relative overflow-hidden rounded-3xl border shadow-sm"
          style={{
            borderColor: "var(--theme-border)",
            background:
              "radial-gradient(1100px 320px at 100% -45%, color-mix(in srgb, var(--primary) 24%, transparent), transparent 70%), linear-gradient(135deg, var(--theme-soft) 0%, #ffffff 58%)",
          }}
        >
          <div
            className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full blur-3xl"
            style={{ background: "color-mix(in srgb, var(--primary) 28%, transparent)" }}
          />
          <div
            className="pointer-events-none absolute right-40 top-8 h-24 w-24 rounded-full blur-2xl"
            style={{ background: "color-mix(in srgb, var(--theme-scroll-end) 22%, transparent)" }}
          />

          <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-8">
            <div className="min-w-0">
              <span
                className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur"
                style={{ borderColor: "var(--theme-border)", color: "var(--theme-dark)" }}
              >
                <span className="text-sm leading-none">📚</span> Knowledge Hub
              </span>

              <div className="mt-3 flex items-center gap-3">
                <h2
                  className="m-0 text-[26px] font-extrabold leading-tight tracking-tight md:text-[34px]"
                  style={{ color: "var(--theme-dark)" }}
                >
                  School Library
                </h2>
                {isSchoolAdmin && (
                  <Badge count={pendingItems.length} size="small" offset={[-2, 2]}>
                    <button
                      onClick={() => setApprovalsOpen(true)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border bg-white/70 backdrop-blur transition-all duration-200 hover:bg-white active:scale-95"
                      style={{ borderColor: "var(--theme-border)", color: "var(--theme-dark)" }}
                      title="Pending upload approvals"
                    >
                      <BellOutlined style={{ fontSize: 16 }} />
                    </button>
                  </Badge>
                )}
              </div>

              <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-slate-600 md:text-[15px]">
                Every book, paper, recording and website your school has gathered — kept in one calm, searchable place. Open, read and explore without ever leaving the page.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border bg-white/80 px-3 py-1 text-xs font-semibold backdrop-blur"
                  style={{ borderColor: "var(--theme-border)", color: "var(--theme-dark)" }}
                >
                  <FileOutlined /> {totalResourcesCount} resources
                </span>
                {(searchQuery ||
                  activeTypeTab !== "all" ||
                  activeCategoryTab !== "all") && (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm"
                    style={{ background: "var(--primary)" }}
                  >
                    {visibleResourcesCount} shown
                  </span>
                )}
              </div>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center md:w-auto">
              <Input
                allowClear
                size="large"
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Search the library..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="!rounded-xl sm:!w-72"
              />
              {canUpload && (
                <Button
                  type="primary"
                  size="large"
                  icon={<UploadOutlined />}
                  onClick={openUploadModal}
                  className="premium-pill-btn flex items-center justify-center !h-11 !rounded-xl !px-5 !font-semibold"
                >
                  {isMobile ? "Upload" : "Upload Resource"}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-3 pt-1">
            <Tabs
              activeKey={activeTypeTab}
              onChange={(key) => {
                if (key === "add") {
                  window.location.href = "/dashboard/library/resourcestype";
                  return;
                }
                setActiveTypeTab(key);
                setActiveCategoryTab("all");
              }}
              tabBarStyle={{ marginBottom: 0, border: "none" }}
              tabBarGutter={24}
              items={typeTabItems}
            />
          </div>

          {categories?.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto px-4 py-3">
              <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Categories
              </span>
              <Button
                size="small"
                type={activeCategoryTab === "all" ? "primary" : "default"}
                shape="round"
                onClick={() => setActiveCategoryTab("all")}
                className={`shrink-0 transition-all ${
                  activeCategoryTab === "all"
                    ? "!bg-primary"
                    : "bg-white hover:bg-gray-50 hover:!border-green-600 hover:!text-green-600"
                }`}
              >
                All
              </Button>

              {categories?.map((category) => (
                <Button
                  key={category?.id}
                  size="small"
                  type={
                    activeCategoryTab === String(category.id)
                      ? "primary"
                      : "default"
                  }
                  shape="round"
                  onClick={() => setActiveCategoryTab(String(category.id))}
                  className={`shrink-0 transition-all ${
                    activeCategoryTab === String(category.id)
                      ? "!bg-primary"
                      : "bg-white hover:bg-gray-50 border-gray-200 hover:!border-green-600 hover:!text-green-600"
                  }`}
                >
                  {formatCategoryLabel(category?.name)}
                </Button>
              ))}

              {canUpload && (
                <Link
                  href="/dashboard/library/librarycategory"
                  className="flex shrink-0 items-center gap-1 rounded-full border border-dashed border-green-600 bg-white px-3 py-1 text-xs !text-green-600 transition-all hover:bg-gray-50"
                >
                  <Plus size={16} /> Add
                </Link>
              )}
            </div>
          )}
        </div>

        {filteredItems?.length === 0 ? (
          <Card className="rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-100">
                <FileOutlined className="text-3xl text-slate-300" />
              </div>
              <Typography.Text type="secondary" className="text-base">
                No resources found
              </Typography.Text>
              <Typography.Text type="secondary" className="text-xs">
                Try a different search, type or category{canUpload ? " — or upload a new resource." : "."}
              </Typography.Text>
              {canUpload && (
                <Button
                  type="primary"
                  icon={<UploadOutlined />}
                  onClick={openUploadModal}
                  className="mt-1 !rounded-xl !bg-primary !border-primary"
                >
                  Upload Resource
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div
            className={`grid grid-cols-1 ${
              screens.md ? "md:grid-cols-2" : ""
            } ${screens.lg ? "lg:grid-cols-3" : ""} ${
              screens.xl ? "xl:grid-cols-4" : ""
            } gap-5`}
          >
            {filteredItems?.map((item) => {
              const resourceType = getResourceName(
                item.library_resources_id
              ).toLowerCase();
              const cleanPath = cleanFilePath(item.file_path);
              const isExternal = isExternalLink(cleanPath);
              const domainLabel = isExternal
                ? getLinkDomain(cleanPath)
                : "";
              const savedThumb = (item.thumbnail_url || "").trim();
              const coverUrl = savedThumb
                ? savedThumb
                : isExternal && resourceType === "video"
                ? getVideoThumbnailUrl(cleanPath)
                : isImageUrl(cleanPath)
                ? cleanPath
                : "";
              const faviconUrl =
                !coverUrl && isExternal
                  ? `https://www.google.com/s2/favicons?domain=${domainLabel}&sz=128`
                  : "";

              return (
                <Card
                  key={item.id}
                  className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
                  hoverable
                  styles={{ body: { padding: 0 } }}
                  onClick={() => openResourceDirectly(item)}
                >
                  <div className="relative h-44 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50/60">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={item.title}
                        className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : faviconUrl ? (
                      <div className="flex h-44 flex-col items-center justify-center gap-3">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
                          <img
                            src={faviconUrl}
                            alt={domainLabel}
                            className="h-9 w-9 object-contain"
                            loading="lazy"
                          />
                        </div>
                        <div className="max-w-[90%] truncate px-3 text-xs font-medium text-slate-500">
                          {domainLabel}
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-44 flex-col items-center justify-center gap-2">
                        <div
                          className="flex h-16 w-16 items-center justify-center rounded-2xl border text-3xl"
                          style={{
                            backgroundColor: getEmojiStyleForType(resourceType).bg,
                            borderColor: getEmojiStyleForType(resourceType).border,
                            boxShadow: `0 6px 14px ${getEmojiStyleForType(resourceType).shadow}`,
                          }}
                        >
                          {getEmojiForType(resourceType)}
                        </div>
                      </div>
                    )}

                    {coverUrl && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent" />
                    )}

                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold capitalize text-slate-700 shadow-sm backdrop-blur">
                      <span>{getEmojiForType(resourceType)}</span>
                      {getResourceName(item.library_resources_id)}
                    </span>

                    {isExternal && coverUrl && (
                      <span className="absolute bottom-2 left-3 inline-flex items-center gap-1 text-[11px] font-medium text-white drop-shadow">
                        {domainLabel}
                      </span>
                    )}

                    <span
                      className="pointer-events-none absolute bottom-3 right-3 translate-y-1 rounded-full px-3 py-1 text-[11px] font-semibold text-white opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                      style={{ background: "var(--primary)" }}
                    >
                      Open
                    </span>

                    {canUpload && !isTeacher && (
                      <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <Button
                          shape="circle"
                          size="small"
                          icon={<DeleteOutlined className="text-xs" />}
                          danger
                          onClick={(e) => {
                            e.stopPropagation();
                            setItemToDelete(item.id);
                            setDeleteModalVisible(true);
                          }}
                          className="border-none bg-white shadow-sm hover:bg-red-50"
                        />
                        <Button
                          shape="circle"
                          size="small"
                          icon={<EditOutlined className="text-xs" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item);
                          }}
                          className="border-none bg-white shadow-sm hover:bg-blue-50"
                        />
                      </div>
                    )}
                  </div>

                <div className="flex flex-grow flex-col p-4">
                  <h3 className="mb-1 line-clamp-2 text-base font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mb-3 line-clamp-2 min-h-[40px] text-sm text-slate-500">
                    {item.description || " "}
                  </p>

                  {parseTags(item.tags)?.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {parseTags(item.tags).slice(0, 3).map((tag) => (
                        <Tag
                          key={`${item.id}-${tag}`}
                          className="m-0 rounded-full border-emerald-100 bg-emerald-50 text-emerald-700"
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                    <Tag
                      color={getCategoryColor(item.library_categories_id)}
                      className="m-0 rounded-full px-2.5 py-[1px]"
                    >
                      {getCategoryName(item.library_categories_id)}
                    </Tag>
                    <span className="text-xs text-slate-400">
                      {item.updated_at
                        ? new Date(item.updated_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>
                </div>
                </Card>
              );
            })}
          </div>
        )}
      </Space>

      <UploadResourceModal
        open={isUploadModalOpen}
        onCancel={() => {
          setIsUploadModalOpen(false);
          form.resetFields();
          setFileList([]);
          setIsEditing(false);
          setCurrentItem(null);
        }}
        onFinish={handleUpload}
        form={form}
        loading={loading}
        isEditing={isEditing}
        fileList={fileList}
        setFileList={setFileList}
        categories={categories}
        resources={resources}
      />

      <ViewResourceModal
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        currentItem={currentItem}
      />

      <Modal
        title="Delete Resource"
        open={deleteModalVisible}
        onOk={handleConfirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this resource?</p>
      </Modal>

      <Modal
        title="Upload Error Details"
        open={!!debugError}
        onCancel={() => setDebugError(null)}
        footer={[
          <Button key="close" onClick={() => setDebugError(null)}>
            Close
          </Button>,
        ]}
        width={720}
      >
        <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-3 rounded">
          {debugError ? JSON.stringify(debugError, null, 2) : ""}
        </pre>
      </Modal>
      {/* ── Approvals drawer ─────────────────────────────────────────────── */}
      {isSchoolAdmin && (
        <Drawer
          title={
            <div className="flex items-center gap-2">
              <BellOutlined className="text-amber-500" />
              <span>Pending Upload Approvals</span>
              {pendingItems.length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center h-5 min-w-[20px] rounded-full
                                 bg-amber-100 text-amber-700 text-xs font-bold px-1.5">
                  {pendingItems.length}
                </span>
              )}
            </div>
          }
          open={approvalsOpen}
          onClose={() => setApprovalsOpen(false)}
          width={480}
          styles={{ body: { padding: 0 } }}
        >
          <Spin spinning={approvalsLoading}>
            {pendingItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <CheckOutlined style={{ fontSize: 36, color: "#86efac" }} />
                <p className="mt-3 text-sm font-medium">No pending requests</p>
                <p className="text-xs text-slate-300 mt-1">All uploads have been reviewed.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pendingItems.map((item: any) => (
                  <div key={item.id} className="px-5 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-800 truncate">{item.title}</p>
                        {item.description && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{item.description}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(item.created_at).toLocaleDateString("en-GB", {
                            day: "2-digit", month: "short", year: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex-shrink-0 flex items-center gap-1.5 mt-0.5">
                        <button
                          onClick={() => handleApprove(item.id)}
                          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold
                                     bg-emerald-50 text-emerald-700 border border-emerald-200
                                     hover:bg-emerald-100 transition-colors active:scale-95"
                          title="Approve"
                        >
                          <CheckOutlined /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(item.id)}
                          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold
                                     bg-red-50 text-red-600 border border-red-200
                                     hover:bg-red-100 transition-colors active:scale-95"
                          title="Reject"
                        >
                          <CloseOutlined /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Spin>
        </Drawer>
      )}
    </div>
  );
}
