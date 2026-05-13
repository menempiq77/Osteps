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
  UploadOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Breadcrumb,
  Button,
  Card,
  Drawer,
  Empty,
  Form,
  Grid,
  Input,
  message,
  Modal,
  Select,
  Space,
  Spin,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import useMediaQuery from "@/hooks/useMediaQuery";
import UploadResourceModal from "@/components/modals/UploadResourceModal";
import ViewResourceModal from "@/components/modals/ViewResourceModal";
import {
  BookOpen,
  FileAudio,
  FileText,
  FolderOpen,
  Grid2X2,
  Link2,
  ListFilter,
  PlayCircle,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
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
  updated_at?: string;
  uploaded_by?: string;
};

export default function LibraryPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [activeTypeTab, setActiveTypeTab] = React.useState<string>("all");
  const [activeCategoryTab, setActiveCategoryTab] =
    React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortMode, setSortMode] = React.useState<"newest" | "title" | "type">("newest");
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

  // ΓöÇΓöÇ Approvals bell (SCHOOL_ADMIN only) ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
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
    const typeName = getResourceName(item.library_resources_id);
    const categoryName = getCategoryName(item.library_categories_id);
    const tags = parseTags(item.tags).join(" ");
    const searchText = [item.title, item.description, typeName, categoryName, tags]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    const typeMatch = activeTypeTab === "all" || typeName.toLowerCase() === activeTypeTab;
    const categoryMatch = activeCategoryTab === "all" || String(item.library_categories_id ?? "") === String(activeCategoryTab);
    const queryMatch = !searchQuery.trim() || searchText.includes(searchQuery.trim().toLowerCase());

    return typeMatch && categoryMatch && queryMatch;
  });

  const sortedFilteredItems = [...(filteredItems || [])].sort((left, right) => {
    if (sortMode === "title") return String(left.title || "").localeCompare(String(right.title || ""));
    if (sortMode === "type") return getResourceName(left.library_resources_id).localeCompare(getResourceName(right.library_resources_id));
    return new Date(right.updated_at || 0).getTime() - new Date(left.updated_at || 0).getTime();
  });

  const totalResourcesCount = libraryItems?.length || 0;
  const visibleResourcesCount = sortedFilteredItems?.length || 0;
  const totalCategoriesCount = categories?.length || 0;
  const totalTypesCount = resources?.length || 0;
  const recentItems = [...(libraryItems || [])]
    .sort((left, right) => new Date(right.updated_at || 0).getTime() - new Date(left.updated_at || 0).getTime())
    .slice(0, 3);

  const getCountForType = (typeName: string) =>
    libraryItems.filter((item) => getResourceName(item.library_resources_id).toLowerCase() === typeName.toLowerCase()).length;

  const getCountForCategory = (categoryId: number | string) =>
    libraryItems.filter((item) => String(item.library_categories_id ?? "") === String(categoryId)).length;

  const getResourceIcon = (type: string) => {
    const key = (type || "").toLowerCase();
    if (key.includes("video")) return PlayCircle;
    if (key.includes("audio")) return FileAudio;
    if (key.includes("link") || key.includes("website")) return Link2;
    if (key.includes("book")) return BookOpen;
    return FileText;
  };

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

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <section className="relative overflow-hidden rounded-[28px] border border-emerald-100 bg-gradient-to-br from-emerald-900 via-emerald-700 to-teal-600 p-5 text-white shadow-xl md:p-8">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-lime-300/20 blur-2xl" />
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur">
                <Sparkles className="h-4 w-4 text-lime-200" /> Curated learning resources
              </div>
              <Typography.Title level={2} className="!mb-3 !text-white">School Library</Typography.Title>
              <Typography.Paragraph className="!mb-0 !max-w-2xl !text-base !text-emerald-50">
                Find PDFs, videos, audio, links, and teaching resources faster with polished filters, live search, and a professional card layout.
              </Typography.Paragraph>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/15 bg-white/12 p-3 backdrop-blur"><div className="text-2xl font-bold">{totalResourcesCount}</div><div className="text-xs text-emerald-50">Resources</div></div>
                <div className="rounded-2xl border border-white/15 bg-white/12 p-3 backdrop-blur"><div className="text-2xl font-bold">{totalTypesCount}</div><div className="text-xs text-emerald-50">Types</div></div>
                <div className="rounded-2xl border border-white/15 bg-white/12 p-3 backdrop-blur"><div className="text-2xl font-bold">{totalCategoriesCount}</div><div className="text-xs text-emerald-50">Categories</div></div>
                <div className="rounded-2xl border border-white/15 bg-white/12 p-3 backdrop-blur"><div className="text-2xl font-bold">{pendingItems.length}</div><div className="text-xs text-emerald-50">Pending</div></div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isSchoolAdmin && (
                <Badge count={pendingItems.length} size="small">
                  <Button onClick={() => setApprovalsOpen(true)} icon={<BellOutlined />} className="!h-11 !rounded-xl !border-white/20 !bg-white/15 !px-4 !font-medium !text-white hover:!border-white/50 hover:!bg-white/25">
                    Approvals
                  </Button>
                </Badge>
              )}
              {canUpload && (
                <Button type="primary" icon={<UploadOutlined />} onClick={openUploadModal} className="!h-11 !rounded-xl !border-white !bg-white !px-5 !font-semibold !text-emerald-700 hover:!bg-emerald-50">
                  {isMobile ? "Upload" : "Upload Resource"}
                </Button>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[280px_1fr]">
          <aside className="space-y-4">
            <Card className="rounded-3xl border border-gray-100 shadow-sm" styles={{ body: { padding: 18 } }}>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800"><ListFilter className="h-4 w-4 text-emerald-600" /> Resource types</div>
              <div className="space-y-2">
                <button onClick={() => setActiveTypeTab("all")} className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition ${activeTypeTab === "all" ? "bg-emerald-600 text-white shadow-sm" : "bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"}`}>
                  <span className="flex items-center gap-2"><Grid2X2 className="h-4 w-4" /> All resources</span><span className="text-xs opacity-80">{totalResourcesCount}</span>
                </button>
                {resources?.map((type) => {
                  const typeKey = type.name.toLowerCase();
                  const TypeIcon = getResourceIcon(type.name);
                  return (
                    <button key={type.id} onClick={() => { setActiveTypeTab(typeKey); setActiveCategoryTab("all"); }} className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition ${activeTypeTab === typeKey ? "bg-emerald-600 text-white shadow-sm" : "bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"}`}>
                      <span className="flex items-center gap-2"><TypeIcon className="h-4 w-4" /> {type.name}</span><span className="text-xs opacity-80">{getCountForType(type.name)}</span>
                    </button>
                  );
                })}
                {canUpload && <Link href="/dashboard/library/resourcestype" className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"><Plus size={16} /> Manage types</Link>}
              </div>
            </Card>

            <Card className="rounded-3xl border border-gray-100 shadow-sm" styles={{ body: { padding: 18 } }}>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800"><FolderOpen className="h-4 w-4 text-emerald-600" /> Categories</div>
              <div className="flex flex-wrap gap-2 xl:block xl:space-y-2">
                <button onClick={() => setActiveCategoryTab("all")} className={`rounded-full px-3 py-1.5 text-sm transition xl:flex xl:w-full xl:items-center xl:justify-between xl:rounded-2xl xl:py-2 ${activeCategoryTab === "all" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"}`}><span>All categories</span><span className="ml-2 text-xs opacity-75">{totalResourcesCount}</span></button>
                {categories?.map((category) => (
                  <button key={category?.id} onClick={() => setActiveCategoryTab(String(category.id))} className={`rounded-full px-3 py-1.5 text-sm transition xl:flex xl:w-full xl:items-center xl:justify-between xl:rounded-2xl xl:py-2 ${activeCategoryTab === String(category.id) ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"}`}>
                    <span>{formatCategoryLabel(category?.name)}</span><span className="ml-2 text-xs opacity-75">{getCountForCategory(category.id)}</span>
                  </button>
                ))}
              </div>
              {canUpload && <Link href="/dashboard/library/librarycategory" className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"><Plus size={16} /> Manage categories</Link>}
            </Card>

            {recentItems.length > 0 && (
              <Card className="rounded-3xl border border-gray-100 shadow-sm" styles={{ body: { padding: 18 } }}>
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-800"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Recently added</div>
                <div className="space-y-3">
                  {recentItems.map((item) => (
                    <button key={`recent-${item.id}`} onClick={() => openResourceDirectly(item)} className="w-full rounded-2xl border border-gray-100 bg-gray-50 p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50">
                      <div className="line-clamp-1 text-sm font-semibold text-gray-900">{item.title}</div>
                      <div className="mt-1 text-xs text-gray-500">{item.updated_at ? new Date(item.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "No date"}</div>
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </aside>

          <main className="space-y-4">
            <Card className="rounded-3xl border border-gray-100 shadow-sm" styles={{ body: { padding: 16 } }}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div><div className="text-lg font-semibold text-gray-900">Browse resources</div><div className="text-sm text-gray-500">Showing {visibleResourcesCount} of {totalResourcesCount} resources</div></div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <Input allowClear size="large" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search title, category, tags..." prefix={<Search className="h-4 w-4 text-gray-400" />} className="min-w-[260px] !rounded-2xl" />
                  <Select size="large" value={sortMode} onChange={setSortMode} className="min-w-[170px]" options={[{ value: "newest", label: "Newest first" }, { value: "title", label: "Title A-Z" }, { value: "type", label: "Resource type" }]} />
                </div>
              </div>
            </Card>

            {sortedFilteredItems?.length === 0 ? (
              <Card className="rounded-3xl border border-dashed border-gray-200 shadow-sm">
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span className="text-gray-500">No resources match the current filters. Try a different search or category.</span>} />
              </Card>
            ) : (
              <div className={`grid grid-cols-1 ${screens.md ? "md:grid-cols-2" : ""} ${screens.xl ? "xl:grid-cols-3" : ""} gap-5`}>
                {sortedFilteredItems?.map((item) => {
                  const resourceType = getResourceName(item.library_resources_id);
                  const resourceTypeKey = resourceType.toLowerCase();
                  const ResourceIcon = getResourceIcon(resourceType);
                  const cleanPath = cleanFilePath(item.file_path);
                  const isExternal = isExternalLink(cleanPath);
                  const domainLabel = isExternal ? getLinkDomain(cleanPath) : "";
                  const coverUrl = isExternal && resourceTypeKey === "video" ? getVideoThumbnailUrl(cleanPath) : isImageUrl(cleanPath) ? cleanPath : "";
                  const emojiStyle = getEmojiStyleForType(resourceTypeKey);

                  return (
                    <Card key={item.id} className="group overflow-hidden rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-2xl" hoverable styles={{ body: { padding: 0 } }} onClick={() => openResourceDirectly(item)}>
                      <div className="relative h-40 overflow-hidden">
                        {coverUrl ? <img src={coverUrl} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : (
                          <div className="flex h-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-emerald-50 via-white to-sky-50">
                            <div className="flex h-16 w-16 items-center justify-center rounded-3xl border text-3xl" style={{ backgroundColor: emojiStyle.bg, borderColor: emojiStyle.border, boxShadow: `0 16px 30px ${emojiStyle.shadow}` }}><ResourceIcon className="h-8 w-8 text-emerald-700" /></div>
                            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-500 shadow-sm">{resourceType || "Resource"}</span>
                          </div>
                        )}
                        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                          <Tag className="m-0 rounded-full border-white/70 bg-white/90 px-2 py-1 text-xs font-medium text-gray-700 shadow-sm">{resourceType}</Tag>
                          {isExternal && <Tag className="m-0 rounded-full border-white/70 bg-white/90 px-2 py-1 text-xs text-gray-600 shadow-sm">{domainLabel}</Tag>}
                        </div>
                        {canUpload && !isTeacher && (
                          <div className="absolute right-3 top-3 flex gap-2 opacity-100 transition md:opacity-0 md:group-hover:opacity-100">
                            <Tooltip title="Edit resource"><Button shape="circle" size="small" icon={<EditOutlined className="text-xs" />} onClick={(event) => { event.stopPropagation(); handleEdit(item); }} className="!border-white/70 !bg-white/95 shadow-sm hover:!border-blue-200 hover:!bg-blue-50" /></Tooltip>
                            <Tooltip title="Delete resource"><Button shape="circle" size="small" icon={<DeleteOutlined className="text-xs" />} danger onClick={(event) => { event.stopPropagation(); setItemToDelete(item.id); setDeleteModalVisible(true); }} className="!border-white/70 !bg-white/95 shadow-sm hover:!bg-red-50" /></Tooltip>
                          </div>
                        )}
                      </div>
                      <div className="flex min-h-[230px] flex-col p-5">
                        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-gray-950">{item.title}</h3>
                        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-gray-600">{item.description || "No description provided yet."}</p>
                        {parseTags(item.tags)?.length > 0 && <div className="mb-4 mt-4 flex flex-wrap gap-2">{parseTags(item.tags).slice(0, 4).map((tag) => <Tag key={`${item.id}-${tag}`} className="m-0 rounded-full border-emerald-100 bg-emerald-50 text-emerald-700">#{tag}</Tag>)}</div>}
                        <div className="mt-auto space-y-4">
                          <div className="flex flex-wrap gap-2"><Tag color={getCategoryColor(item.library_categories_id)} className="m-0 rounded-full px-3 py-1">{getCategoryName(item.library_categories_id)}</Tag><Tag className="m-0 rounded-full border-sky-100 bg-sky-50 px-3 py-1 text-sky-700">{item.size || "N/A"}</Tag></div>
                          <div className="flex items-center justify-between border-t border-gray-100 pt-3"><span className="text-xs text-gray-400">{item.updated_at ? new Date(item.updated_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}</span><span className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white transition group-hover:bg-emerald-600">Open <Link2 className="h-3 w-3" /></span></div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </main>
        </section>
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
      {/* ΓöÇΓöÇ Approvals drawer ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ */}
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
