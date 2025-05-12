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
} from "antd";
import useMediaQuery from "@/hooks/useMediaQuery";
import UploadResourceModal from "@/components/modals/UploadResourceModal";
import ViewResourceModal from "@/components/modals/ViewResourceModal";
import { fetchCategories, fetchResources } from "@/services/api";

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
  const [activeCategoryTab, setActiveCategoryTab] = React.useState<string>("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false);
  const [currentItem, setCurrentItem] = React.useState<LibraryItem | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [form] = Form.useForm();
  const screens = useBreakpoint();
  const [fileList, setFileList] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)"); 
  const [categories, setCategories] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  // State for library items
  const [libraryItems, setLibraryItems] = React.useState<LibraryItem[]>([
    {
      id: "1",
      title: "Holy Quran - Arabic Text",
      type: "pdf",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      uploadedBy: "Islamic Studies Dept",
      uploadDate: "2023-01-15",
      size: "15MB",
      category: "Quran",
      description: "Complete Arabic text of the Holy Quran.",
    },
    {
      id: "2",
      title: "Sahih Bukhari - Selected Hadith",
      type: "book",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      uploadedBy: "Hadith Research Center",
      uploadDate: "2023-03-22",
      size: "32MB",
      category: "Hadees",
      description: "Selected authentic hadith from Sahih Bukhari.",
    },
    {
      id: "3",
      title: "Fiqh of Salah",
      type: "book",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      uploadedBy: "Fiqh Department",
      uploadDate: "2023-05-10",
      size: "18MB",
      category: "Fiqh",
      description: "Islamic jurisprudence regarding prayer.",
    },
    {
      id: "4",
      title: "Tafseer Ibn Kathir - Surah Al-Fatiha",
      type: "pdf",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      uploadedBy: "Tafseer Research",
      uploadDate: "2023-07-18",
      size: "8MB",
      category: "Tafseer",
      description: "Explanation of Surah Al-Fatiha.",
    },
    {
      id: "5",
      title: "Life of Prophet Muhammad (PBUH)",
      type: "book",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      uploadedBy: "Seerah Department",
      uploadDate: "2023-09-05",
      size: "22MB",
      category: "Seerah",
      description: "Biography of the Prophet Muhammad (PBUH).",
    },
    {
      id: "6",
      title: "Daily Dua Collection - Audio",
      type: "audio",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      uploadedBy: "Spiritual Guidance",
      uploadDate: "2023-11-30",
      size: "12MB",
      category: "Dua",
      description: "Collection of authentic duas for daily life.",
    },
    {
      id: "7",
      title: "Fiqh of Salah - Video Guide",
      type: "video",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      uploadedBy: "Islamic Education",
      uploadDate: "2023-05-10",
      size: "85MB",
      category: "Fiqh",
      description: "Video guide on how to perform Salah.",
    },
    {
      id: "8",
      title: "Seerah Animation Series",
      type: "video",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      uploadedBy: "Seerah Department",
      uploadDate: "2023-06-15",
      size: "120MB",
      category: "Seerah",
      description: "Animated series about the Prophet's life.",
    },
  ]);

  // Get all unique categories from the library items
  const allCategories = Array.from(
    new Set(libraryItems.map((item) => item.category))
  ).sort();

  // Get filtered items based on active tabs
  const filteredItems = libraryItems.filter((item) => {
    const typeMatch = activeTypeTab === "all" || item.type === activeTypeTab;
    const categoryMatch = activeCategoryTab === "all" || item.category === activeCategoryTab;
    return typeMatch && categoryMatch;
  });

  // Get categories available for the active type tab
  const availableCategories = Array.from(
    new Set(
      libraryItems
        .filter((item) => activeTypeTab === "all" || item.type === activeTypeTab)
        .map((item) => item.category)
    )
  ).sort();

  const canUpload =
    currentUser?.role === "SCHOOL_ADMIN" || currentUser?.role === "TEACHER";

  const handleUpload = async (values: any) => {
    setLoading(true);
    try {
      if (isEditing && currentItem) {
        // Update existing item
        const updatedItems = libraryItems.map((item) =>
          item.id === currentItem.id
            ? {
                ...item,
                title: values.title,
                type: values.type,
                category: values.category,
                description: values.description,
              }
            : item
        );
        setLibraryItems(updatedItems);
        message.success("Resource updated successfully!");
      } else {
        // Add new item
        const newItem: LibraryItem = {
          id: Date.now().toString(),
          title: values.title,
          type: values.type,
          url: "https://example.com/new-file",
          uploadedBy: currentUser?.name || "Current User",
          uploadDate: new Date().toISOString().split("T")[0],
          size: "10MB",
          category: values.category,
          description: values.description,
        };
        setLibraryItems([...libraryItems, newItem]);
        message.success("Resource uploaded successfully!");
      }

      setIsUploadModalOpen(false);
      form.resetFields();
      setFileList([]);
      setCurrentItem(null);
      setIsEditing(false);
    } catch (error) {
      message.error(
        `Failed to ${isEditing ? "update" : "upload"} resource. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Delete Resource",
      content: "Are you sure you want to delete this resource?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        const updatedItems = libraryItems.filter((item) => item.id !== id);
        setLibraryItems(updatedItems);
        message.success("Resource deleted successfully");
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
      type: item.type,
      category: item.category,
      description: item.description,
    });
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

  const getTypeTag = (type: string) => {
    const typeMap: Record<string, { color: string; text: string }> = {
      book: { color: "blue", text: "Book" },
      video: { color: "red", text: "Video" },
      pdf: { color: "green", text: "PDF" },
      audio: { color: "orange", text: "Audio" },
    };

    return (
      <Tag color={typeMap[type]?.color || "default"}>
        {typeMap[type]?.text || type}
      </Tag>
    );
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      Quran: "geekblue",
      Hadees: "purple",
      Tafseer: "cyan",
      Seerah: "volcano",
      Fiqh: "gold",
      Dua: "lime",
    };
    return colorMap[category] || "default";
  };

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
              border: 'none',
            }}
            tabBarGutter={24}
            items={[
              { label: <span className="font-medium">All Resources</span>, key: "all" },
              { label: <span className="font-medium">Books</span>, key: "book" },
              { label: <span className="font-medium">Videos</span>, key: "video" },
              { label: <span className="font-medium">Audios</span>, key: "audio" },
              { label: <span className="font-medium">PDFs</span>, key: "pdf" },
            ]}
          />
        </div>

        {/* Category Tabs - Modern Pill Design */}
        {availableCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              size="middle"
              type={activeCategoryTab === "all" ? "primary" : "default"}
              shape="round"
              onClick={() => setActiveCategoryTab("all")}
              className={`transition-all ${
                activeCategoryTab === "all" 
                  ? 'bg-blue-600 hover:bg-blue-700 border-blue-600' 
                  : 'bg-white hover:bg-gray-50 border-gray-200'
              }`}
            >
              All
            </Button>
            
            {availableCategories.map((category) => (
              <Button
                key={category}
                size="middle"
                type={activeCategoryTab === category ? "primary" : "default"}
                shape="round"
                onClick={() => setActiveCategoryTab(category)}
                className={`transition-all ${
                  activeCategoryTab === category 
                    ? 'bg-blue-600 hover:bg-blue-700 border-blue-600' 
                    : 'bg-white hover:bg-gray-50 border-gray-200'
                }`}
              >
                {category}
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
                className="hover:shadow-lg transition-all duration-300 border border-gray-100 rounded-xl overflow-hidden flex flex-col h-full"
                hoverable
                bodyStyle={{ padding: 0 }}
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

                  <div className="flex flex-wrap gap-2 mb-4">
                    {getTypeTag(item.type)}
                    <Tag 
                      color={getCategoryColor(item.category)}
                      className="m-0"
                    >
                      {item.category}
                    </Tag>
                  </div>

                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-gray-500">{item.size}</span>
                      <span className="text-xs text-gray-400">
                        {item.uploadDate}
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