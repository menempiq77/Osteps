"use client";
import React from "react";
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
  subject?: string;
  description?: string;
};

export default function LibraryPage() {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = React.useState<string>("all");
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
      subject: "Quran",
      description:
        "Complete Arabic text of the Holy Quran with proper formatting for easy reading.",
    },
    {
      id: "2",
      title: "Sahih Bukhari - Selected Hadith",
      type: "book",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      uploadedBy: "Hadith Research Center",
      uploadDate: "2023-03-22",
      size: "32MB",
      subject: "Hadith",
      description:
        "Selected authentic hadith from Sahih Bukhari with English translation.",
    },
    {
      id: "3",
      title: "Fiqh of Salah - Video Guide",
      type: "video",
      url: "https://www.w3schools.com/html/mov_bbb.mp4",
      uploadedBy: "Islamic Education",
      uploadDate: "2023-05-10",
      size: "85MB",
      subject: "Fiqh",
      description:
        "Step-by-step video guide on how to perform Salah correctly according to Quran and Sunnah.",
    },
    {
      id: "4",
      title: "Tafseer Ibn Kathir - Surah Al-Fatiha",
      type: "pdf",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      uploadedBy: "Tafseer Research",
      uploadDate: "2023-07-18",
      size: "8MB",
      subject: "Tafseer",
      description:
        "Detailed explanation of Surah Al-Fatiha from Tafseer Ibn Kathir.",
    },
    {
      id: "5",
      title: "Islamic History - The Prophet's Life",
      type: "book",
      url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      uploadedBy: "History Department",
      uploadDate: "2023-09-05",
      size: "45MB",
      subject: "Seerah",
      description:
        "Comprehensive biography of Prophet Muhammad (PBUH) from authentic sources.",
    },
    {
      id: "6",
      title: "Dua Collection - Audio",
      type: "audio",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      uploadedBy: "Spiritual Guidance",
      uploadDate: "2023-11-30",
      size: "12MB",
      subject: "Dua",
      description:
        "Collection of authentic duas from Quran and Sunnah with Arabic recitation and English translation.",
    },
  ]);

  const filteredItems =
    activeTab === "all"
      ? libraryItems
      : libraryItems.filter((item) => item.type === activeTab);

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
                subject: values.subject,
                description: values.description,
                // In a real app, you'd update the file here too
              }
            : item
        );
        setLibraryItems(updatedItems);
        message.success("Resource updated successfully!");
      } else {
        // Add new item
        const newItem: LibraryItem = {
          id: Date.now().toString(), // Simple ID generation
          title: values.title,
          type: values.type,
          url: "https://example.com/new-file", // In a real app, this would be the uploaded file URL
          uploadedBy: currentUser?.name || "Current User",
          uploadDate: new Date().toISOString().split("T")[0],
          size: "10MB", // In a real app, you'd get this from the file
          subject: values.subject,
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
        `Failed to ${
          isEditing ? "update" : "upload"
        } resource. Please try again.`
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
        console.log("Deleting item with id:", id); // Debug log
        console.log("Current items before delete:", libraryItems); // Debug log

        const updatedItems = libraryItems.filter((item) => {
          console.log(`Checking item ${item.id} against ${id}`); // Debug log
          return item.id !== id;
        });

        console.log("Updated items after delete:", updatedItems); // Debug log

        setLibraryItems(updatedItems);
        message.success("Resource deleted successfully");
      },
    });
  };
  const handleView = (item: LibraryItem) => {
    if (item.type === "pdf") {
      // Open PDF in new tab
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

    // Pre-fill the form with the item's data
    form.setFieldsValue({
      title: item.title,
      type: item.type,
      subject: item.subject,
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
            >
              {isMobile ? "Upload" : "Upload Resource"}
            </Button>
          )}
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          tabBarStyle={{ marginBottom: 24 }}
          items={[
            { label: "All Resources", key: "all" },
            { label: "Books", key: "book" },
            { label: "Videos", key: "video" },
            { label: "Audios", key: "audio" },
            { label: "PDFs", key: "pdf" },
          ]}
        />

        {filteredItems.length === 0 ? (
          <Card className="shadow-sm">
            <div className="text-center py-12 text-gray-500 text-lg">
              No resources found in this category
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
                className="hover:shadow-lg transition-shadow duration-300 border border-gray-100 rounded-lg overflow-hidden flex flex-col h-full"
                hoverable
              >
                {/* Enhanced Header with Icon */}
                <div className="relative bg-gradient-to-br from-blue-50 to-gray-50 p-8">
                  <div className="flex items-center justify-center h-24">
                    <div className="text-4xl text-blue-500">
                      {getIconForType(item.type)}
                    </div>
                  </div>

                  {canUpload && (
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button
                        shape="circle"
                        size="small"
                        icon={<DeleteOutlined className="text-sm" />}
                        danger
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleDelete(item.id);
                        }}
                        className="shadow-sm bg-white hover:bg-red-50"
                      />
                      <Button
                        shape="circle"
                        size="small"
                        icon={<EditOutlined className="text-sm" />}
                        onClick={() => handleEdit(item)}
                        className="shadow-sm bg-white hover:bg-blue-50"
                      />
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 flex-grow flex flex-col">
                  <h3 className="text-lg font-medium mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {getTypeTag(item.type)}
                    {item.subject && (
                      <Tag color="purple" className="m-0">
                        {item.subject}
                      </Tag>
                    )}
                  </div>

                  <div className="mt-auto">
                    <p className="text-gray-500 text-sm mb-2">{item.size}</p>
                    <p className="text-gray-400 text-xs mb-3">
                      Uploaded by {item.uploadedBy} on {item.uploadDate}
                    </p>

                    <Divider className="my-2" />

                    <div className="flex justify-between">
                      <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => handleView(item)}
                        className="flex items-center text-blue-500 hover:text-blue-700 px-0"
                      >
                        View
                      </Button>
                      <a href={item.url} download className="flex">
                        <Button
                          type="text"
                          icon={<DownloadOutlined />}
                          className="flex items-center text-green-500 hover:text-green-700 px-0"
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

      {/* Upload/Edit Modal */}
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
      />

      {/* View Modal (for videos and audio) */}

      <ViewResourceModal
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        currentItem={currentItem}
      />
    </div>
  );
}
