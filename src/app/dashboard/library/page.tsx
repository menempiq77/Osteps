"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  BookOutlined,
  FileOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  DownloadOutlined,
  DeleteOutlined,
  AudioOutlined,
  EyeOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Tabs,
  Modal,
  Form,
  message,
  Divider,
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
    isError,
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
        formData.append("file_path", values.link);
        formData.append("external_link", values.link);
        formData.append("link", values.link);
      } else if (fileList.length > 0) {
        const fileToUpload = fileList[0].originFileObj || fileList[0];

        console.log("Uploading file:", {
          name: fileToUpload.name,
          type: fileToUpload.type,
          size: fileToUpload.size,
          file: fileToUpload,
        });

        formData.append("file_path", fileToUpload);
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
    const isLink = isExternalLink(item.file_path || "");
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
      link: isLink ? item.file_path : undefined,
    });

    setFileList(
      !isLink && item.file_path
        ? [
            {
              uid: "-1",
              name: item.title,
              status: "done",
              url: item.file_path,
            },
          ]
        : []
    );
  };

  const handleView = (item: any) => {
    const resourceType = getResourceName(item.library_resources_id).toLowerCase();
    if (resourceType === "pdf") {
      window.open(item.file_path, "_blank");
      return;
    }

    if (isExternalLink(item.file_path) && resourceType !== "video") {
      window.open(item.file_path, "_blank");
      return;
    }

    setCurrentItem({
      ...item,
      type: resourceType,
      url: item.file_path,
      uploadedBy: item.uploaded_by || "Unknown",
      uploadDate: new Date(item.updated_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      size: item.size || "N/A",
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

  const getIconForType = (type: string) => {
    switch (type) {
      case "book":
        return <BookOutlined style={{ fontSize: "24px", color: "#1890ff" }} />;
      case "video":
        return (
          <VideoCameraOutlined style={{ fontSize: "24px", color: "#ff4d4f" }} />
        );
      case "pdf":
        return <FileOutlined style={{ fontSize: "24px", color: "#52c41a" }} />;
      case "audio":
        return <AudioOutlined style={{ fontSize: "24px", color: "#fa8c16" }} />;
      default:
        return <FileOutlined style={{ fontSize: "24px" }} />;
    }
  };

  const getEmojiForType = (type: string) => {
    switch (type) {
      case "book":
        return "📘";
      case "pdf":
        return "📄";
      case "video":
        return "🎬";
      case "audio":
        return "🎧";
      default:
        return "📚";
    }
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
    return category?.name || "Unknown";
  };

  const getCategoryColor = (id: number | string) => {
    const categoryId = Number(id);
    const category = categories.find((cat) => Number(cat.id) === categoryId);
    return category?.color || "default";
  };

  const filteredItems = libraryItems?.filter((item) => {
    const typeMatch =
      activeTypeTab === "all" ||
      getResourceName(item.library_resources_id).toLowerCase() ===
        activeTypeTab;

    const categoryMatch =
      activeCategoryTab === "all" ||
      getCategoryName(item.library_categories_id).toLowerCase() ===
        activeCategoryTab.toLowerCase();

    return typeMatch && categoryMatch;
  });

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
        className="!mb-2"
      />

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div className="flex justify-between items-center">
          <Typography.Title level={3} style={{ margin: 0 }}>
            {isMobile ? "Islamic Library" : "Islamic Library Resources"}
          </Typography.Title>
          {canUpload && (
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={openUploadModal}
              className="flex items-center !bg-primary !border-primary"
            >
              {isMobile ? "Upload" : "Upload Resource"}
            </Button>
          )}
        </div>

        {/* Main Type Tabs - Modern Design */}
        <div className="border-b border-gray-200">
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
          <div className="flex flex-wrap gap-2 mb-6">
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
                  activeCategoryTab === category.name.toLowerCase()
                    ? "primary"
                    : "default"
                }
                shape="round"
                onClick={() =>
                  setActiveCategoryTab(category.name.toLowerCase())
                }
                className={`transition-all ${
                  activeCategoryTab === category.name.toLowerCase()
                    ? "!bg-primary !hover:bg-green-700"
                    : "bg-white hover:bg-gray-50 border-gray-200 hover:!border-green-600 hover:!text-green-600"
                }`}
              >
                {category?.name}
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
        )}

        {filteredItems?.length === 0 ? (
          <Card className="shadow-sm rounded-lg border-0">
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
            } ${screens.lg ? "lg:grid-cols-3" : ""} gap-6`}
          >
            {filteredItems?.map((item) => {
              const resourceType = getResourceName(
                item.library_resources_id
              ).toLowerCase();
              const isExternal = isExternalLink(item.file_path);
              const domainLabel = isExternal
                ? getLinkDomain(item.file_path)
                : "";
              const coverUrl =
                isExternal && resourceType === "video"
                  ? getVideoThumbnailUrl(item.file_path)
                  : isImageUrl(item.file_path)
                  ? item.file_path
                  : "";

              return (
                <Card
                  key={item.id}
                  className="hover:shadow-lg shadow-sm transition-all duration-300 border border-gray-100 rounded-xl overflow-hidden flex flex-col h-full"
                  hoverable
                  styles={{ body: { padding: 0 } }}
                >
                  <div className="relative">
                    {coverUrl ? (
                      <img
                        src={coverUrl}
                        alt={item.title}
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center gap-2">
                        <div className="text-4xl">
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
                          onClick={() => handleEdit(item)}
                          className="shadow-sm bg-white hover:bg-blue-50 border-none"
                        />
                      </div>
                    )}
                  </div>

                <div className="p-5 flex-grow flex flex-col">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-800">
                    {item.title}
                  </h3>
                  <p className="mb-2 text-gray-700 line-clamp-1">
                    {item.description}
                  </p>

                  {parseTags(item.tags)?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {parseTags(item.tags).map((tag) => (
                        <Tag key={`${item.id}-${tag}`} className="m-0">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {getResourceName(item.library_resources_id)}
                    <Tag
                      color={getCategoryColor(item.library_categories_id)}
                      className="m-0"
                    >
                      {getCategoryName(item.library_categories_id)}
                    </Tag>
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-gray-500">{item.size}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(item.updated_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <Divider className="my-3" />

                    <div className="flex justify-between">
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleView(item)}
                        className="flex items-center text-blue-600 hover:text-blue-800 !px-0 hover:bg-blue-50"
                      >
                        View
                      </Button>
                      {isExternalLink(item.file_path) ? (
                        <a
                          href={item.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex"
                        >
                          <Button
                            type="text"
                            icon={<DownloadOutlined />}
                            className="flex items-center text-green-600 hover:text-green-800 !px-0 hover:bg-green-50"
                          >
                            Open
                          </Button>
                        </a>
                      ) : (
                        <a
                          href={item.file_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="flex"
                        >
                          <Button
                            type="text"
                            icon={<DownloadOutlined />}
                            className="flex items-center text-green-600 hover:text-green-800 !px-0 hover:bg-green-50"
                          >
                            Download
                          </Button>
                        </a>
                      )}
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
