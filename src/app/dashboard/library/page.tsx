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
} from "@ant-design/icons";
import {
  Button,
  Card,
  Tabs,
  Modal,
  Form,
  Input,
  Select,
  Upload,
  message,
  Divider,
  Tag,
  Space,
  Grid,
  Typography,
  Spin,
  Alert,
} from "antd";
import useMediaQuery from "@/hooks/useMediaQuery";
import UploadResourceModal from "@/components/modals/UploadResourceModal";
import ViewResourceModal from "@/components/modals/ViewResourceModal";
import {
  addLibrary,
  deleteLibrary,
  fetchCategories,
  fetchLibrary,
  fetchResources,
  updateLibrary,
} from "@/services/api";

const { Text, Title } = Typography;
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
  const [libraryItems, setLibraryItems] = useState<any[]>([]);

  const [error, setError] = useState<string | null>(null);

  console.log(categories, "categories");
  console.log(resources, "resources");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        setError("Failed to fetch categories");
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
        setError("Failed to fetch categories");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  useEffect(() => {
    const loadLibrary = async () => {
      try {
        const data = await fetchLibrary();
        setLibraryItems(data);
      } catch (err) {
        setError("Failed to fetch Library Items");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLibrary();
  }, []);

  const typeTabItems = [
    { label: <span className="font-medium">All Resources</span>, key: "all" },
    ...resources?.map((type) => ({
      label: <span className="font-medium">{type.name}</span>,
      key: type.name.toLowerCase(),
    })),
  ];

  // Get filtered items based on active tabs
  const filteredItems = libraryItems.filter((item) => {
    const typeMatch = activeTypeTab === "all" || item.type === activeTypeTab;
    const categoryMatch =
      activeCategoryTab === "all" || item.category === activeCategoryTab;
    return typeMatch && categoryMatch;
  });

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "TEACHER";

  const handleUpload = async (values: any) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("library_resources_id", values.type);
      formData.append("library_categories_id", values.category);
      formData.append("description", values.description || "");

      if (fileList.length > 0) {
        formData.append("file_path", fileList[0]);
      }

      if (isEditing && currentItem) {
        await updateLibrary(currentItem.id, formData);
        message.success("Resource updated successfully!");
      } else {
        await addLibrary(formData);
        message.success("Resource uploaded successfully!");
      }

      // Refresh the library items
      const data = await fetchLibrary();
      setLibraryItems(data);

      setIsUploadModalOpen(false);
      form.resetFields();
      setFileList([]);
      setCurrentItem(null);
      setIsEditing(false);
    } catch (error) {
      message.error(
        `Failed to ${
          isEditing ? "update" : "upload"
        } resource. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Update the handleDelete function to use the API
  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Delete Resource",
      content: "Are you sure you want to delete this resource?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          await deleteLibrary(id);
          const updatedItems = libraryItems.filter((item) => item.id !== id);
          setLibraryItems(updatedItems);
          message.success("Resource deleted successfully");
        } catch (error) {
          message.error("Failed to delete resource. Please try again.");
        }
      },
    });
  };

  const handleView = (item: LibraryItem) => {
    if (item.type === "pdf") {
      window.open(item.url, "_blank");
      return;
    }
    setCurrentItem(item);
    setIsViewModalOpen(true);
  };

  const handleEdit = (item: LibraryItem) => {
    setCurrentItem(item);
    setIsEditing(true);
    setIsUploadModalOpen(true);
    form.setFieldsValue({
      title: item.title,
      type: item.library_resources_id,
      category: item.library_categories_id,
      description: item.description,
    });

    setFileList(
      item.file_path
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

  const openUploadModal = () => {
    setIsEditing(false);
    setCurrentItem(null);
    form.resetFields();
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

  const getResourceName = (id: number) => {
    const resource = resources.find((res) => res.id === id);
    return resource?.name || "Unknown";
  };

  const getCategoryName = (id: number) => {
    const category = categories.find((cat) => cat.id === id);
    return category?.name || "Unknown";
  };

  const getCategoryColor = (id: number) => {
    const category = categories.find((cat) => cat.id === id);
    return category?.color || "default";
  };

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
    <div className="p-6">
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
              className="flex items-center"
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
                  ? "bg-blue-600 hover:bg-blue-700 border-blue-600"
                  : "bg-white hover:bg-gray-50 border-gray-200"
              }`}
            >
              All
            </Button>

            {categories?.map((category) => (
              <Button
                key={category?.id}
                size="middle"
                type={activeCategoryTab === category ? "primary" : "default"}
                shape="round"
                onClick={() => setActiveCategoryTab(category)}
                className={`transition-all ${
                  activeCategoryTab === category
                    ? "bg-blue-600 hover:bg-blue-700 border-blue-600"
                    : "bg-white hover:bg-gray-50 border-gray-200"
                }`}
              >
                {category?.name}
              </Button>
            ))}
          </div>
        )}

        {filteredItems.length === 0 ? (
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
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="hover:shadow-lg shadow-sm transition-all duration-300 border border-gray-100 rounded-xl overflow-hidden flex flex-col h-full"
                hoverable
              >
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                  <div className="flex items-center justify-center h-20">
                    <div className="text-3xl text-blue-500">
                      {getIconForType(item.type)}
                    </div>
                  </div>

                  {canUpload && (
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button
                        shape="circle"
                        size="small"
                        icon={<DeleteOutlined className="text-xs" />}
                        danger
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDelete(item.id);
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
                        className="flex items-center text-blue-600 hover:text-blue-800 px-0 hover:bg-blue-50"
                      >
                        View
                      </Button>
                      <a href={item.url} download className="flex">
                        <Button
                          type="text"
                          icon={<DownloadOutlined />}
                          className="flex items-center text-green-600 hover:text-green-800 px-0 hover:bg-green-50"
                        >
                          Download
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
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
    </div>
  );
}
