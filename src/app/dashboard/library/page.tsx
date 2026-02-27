"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  UploadOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  FileOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Tabs,
  Modal,
  Form,
  message,
  Tag,
  Space,
  Grid,
  Typography,
  Spin,
  Breadcrumb,
} from "antd";
import useMediaQuery from "@/hooks/useMediaQuery";
import UploadResourceModal from "@/components/modals/UploadResourceModal";
import ViewResourceModal from "@/components/modals/ViewResourceModal";
import { Plus } from "lucide-react";
import Link from "next/link";
import { IMG_BASE_URL } from "@/lib/config";
import {
  addLibrary,
  deleteLibrary,
  fetchCategories,
  fetchLibrary,
  fetchResources,
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
    const typeMatch =
      activeTypeTab === "all" ||
      getResourceName(item.library_resources_id).toLowerCase() ===
        activeTypeTab;

    const categoryMatch =
      activeCategoryTab === "all" ||
      String(item.library_categories_id ?? "") === String(activeCategoryTab);

    return typeMatch && categoryMatch;
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

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-lime-50 p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Typography.Title level={3} style={{ margin: 0 }}>
                {isMobile ? "Islamic Library" : "Islamic Library Resources"}
              </Typography.Title>
              <p className="mt-1 text-sm text-gray-600">
                Discover, view, and share learning resources in one place.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Tag className="m-0 rounded-full border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700">
                  {totalResourcesCount} Total
                </Tag>
                <Tag className="m-0 rounded-full border-sky-200 bg-sky-50 px-3 py-1 text-sky-700">
                  {visibleResourcesCount} Showing
                </Tag>
              </div>
            </div>
            {canUpload && (
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={openUploadModal}
                className="flex items-center !h-11 !rounded-xl !bg-primary !border-primary !px-5 !font-medium"
              >
                {isMobile ? "Upload" : "Upload Resource"}
              </Button>
            )}
          </div>
        </div>

        {/* Main Type Tabs - Modern Design */}
        <div className="rounded-2xl border border-gray-100 bg-white px-3 pt-2 shadow-sm">
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
            tabBarStyle={{
              marginBottom: 0,
              border: "none",
            }}
            tabBarGutter={24}
            items={typeTabItems}
          />
        </div>

        {/* Category Tabs - Modern Pill Design */}
        {categories?.length > 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white p-3 md:p-4 shadow-sm">
            <div className="mb-3 text-sm font-medium text-gray-600">
              Browse by category
            </div>
            <div className="flex flex-wrap gap-2">
            <Button
              size="middle"
              type={activeCategoryTab === "all" ? "primary" : "default"}
              shape="round"
              onClick={() => setActiveCategoryTab("all")}
              className={`transition-all ${
                activeCategoryTab === "all"
                  ? "!bg-primary !hover:bg-green-700"
                  : "bg-white hover:bg-gray-50 hover:!border-green-600 hover:!text-green-600"
              }`}
            >
              All
            </Button>

            {categories?.map((category) => (
              <Button
                key={category?.id}
                size="middle"
                type={
                  activeCategoryTab === String(category.id)
                    ? "primary"
                    : "default"
                }
                shape="round"
                onClick={() => setActiveCategoryTab(String(category.id))}
                className={`transition-all ${
                  activeCategoryTab === String(category.id)
                    ? "!bg-primary !hover:bg-green-700"
                    : "bg-white hover:bg-gray-50 border-gray-200 hover:!border-green-600 hover:!text-green-600"
                }`}
              >
                {formatCategoryLabel(category?.name)}
              </Button>
            ))}

            {canUpload && (
              <Link
                href="/dashboard/library/librarycategory"
                className="transition-all flex items-center gap-1 bg-white hover:bg-gray-50 border border-dashed rounded-full px-4 !text-green-600 border-green-600"
              >
                <Plus size={18} /> Add More
              </Link>
            )}
            </div>
          </div>
        )}

        {filteredItems?.length === 0 ? (
          <Card className="shadow-sm rounded-2xl border border-gray-100">
            <div className="text-center py-12">
              <FileOutlined className="text-4xl text-gray-300 mb-4" />
              <Typography.Text type="secondary" className="text-lg">
                No resources found in this category
              </Typography.Text>
            </div>
          </Card>
        ) : (
          <div
            className={`grid grid-cols-1 ${
              screens.md ? "md:grid-cols-2" : ""
            } ${screens.lg ? "lg:grid-cols-3" : ""} ${
              screens.xl ? "xl:grid-cols-4" : ""
            } gap-4`}
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
              const coverUrl =
                isExternal && resourceType === "video"
                  ? getVideoThumbnailUrl(cleanPath)
                  : isImageUrl(cleanPath)
                  ? cleanPath
                  : "";

              return (
                <Card
                  key={item.id}
                  className="hover:shadow-xl hover:-translate-y-1 shadow-sm transition-all duration-300 border border-gray-100 rounded-2xl overflow-hidden flex flex-col h-full cursor-pointer"
                  hoverable
                  styles={{ body: { padding: 0 } }}
                  onClick={() => openResourceDirectly(item)}
                >
                  <div className="relative">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={item.title}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="h-32 bg-gradient-to-br from-emerald-50 via-white to-sky-50 flex flex-col items-center justify-center gap-2">
                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-full border text-2xl"
                          style={{
                            backgroundColor: getEmojiStyleForType(resourceType).bg,
                            borderColor: getEmojiStyleForType(resourceType).border,
                            boxShadow: `0 6px 14px ${getEmojiStyleForType(resourceType).shadow}`,
                          }}
                        >
                          {getEmojiForType(resourceType)}
                        </div>
                        <div className="text-xs uppercase tracking-wide text-gray-500">
                          {resourceType || "resource"}
                        </div>
                      </div>
                    )}

                    {isExternal && (
                      <span className="absolute bottom-2 left-2 text-xs bg-white/90 text-gray-700 px-2 py-1 rounded-full">
                        {domainLabel}
                      </span>
                    )}

                    {canUpload && !isTeacher && (
                      <div className="absolute top-3 right-3 flex gap-2">
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
                          className="shadow-sm bg-white hover:bg-red-50 border-none"
                        />
                        <Button
                          shape="circle"
                          size="small"
                          icon={<EditOutlined className="text-xs" />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item);
                          }}
                          className="shadow-sm bg-white hover:bg-blue-50 border-none"
                        />
                      </div>
                    )}
                  </div>

                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-base font-semibold mb-1 line-clamp-2 text-gray-900">
                    {item.title}
                  </h3>
                  <p className="mb-2 text-sm text-gray-600 line-clamp-1 min-h-[20px]">
                    {item.description || " "}
                  </p>

                  {parseTags(item.tags)?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {parseTags(item.tags).map((tag) => (
                        <Tag
                          key={`${item.id}-${tag}`}
                          className="m-0 rounded-full border-emerald-100 bg-emerald-50 text-emerald-700"
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Tag className="m-0 rounded-full border-sky-100 bg-sky-50 px-2 py-[1px] text-sky-700">
                      {getResourceName(item.library_resources_id)}
                    </Tag>
                    <Tag
                      color={getCategoryColor(item.library_categories_id)}
                      className="m-0 rounded-full px-2 py-[1px]"
                    >
                      {getCategoryName(item.library_categories_id)}
                    </Tag>
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">
                        {item.size || "N/A"}
                      </span>
                      <span className="text-xs text-gray-400">
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
    </div>
  );
}
