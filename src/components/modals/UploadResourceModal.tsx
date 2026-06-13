import React, { useMemo, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Divider,
  Button,
  Space,
  Radio,
  Tooltip,
  Spin,
  message,
} from "antd";
import {
  SearchOutlined,
  PictureOutlined,
  CloseCircleOutlined,
  LinkOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import { UploadOutlined } from "@ant-design/icons";

type ImageResult = { thumb: string; full: string; title: string };

// Free, keyless image search via Wikimedia Commons (CORS-enabled with origin=*).
async function searchCommonsImages(query: string): Promise<ImageResult[]> {
  const endpoint =
    "https://commons.wikimedia.org/w/api.php?" +
    new URLSearchParams({
      action: "query",
      format: "json",
      origin: "*",
      generator: "search",
      gsrsearch: `${query} filetype:bitmap`,
      gsrlimit: "24",
      gsrnamespace: "6",
      prop: "imageinfo",
      iiprop: "url",
      iiurlwidth: "320",
    }).toString();

  const res = await fetch(endpoint);
  const data = await res.json();
  const pages = data?.query?.pages ? Object.values(data.query.pages) : [];
  return (pages as any[])
    .map((p) => {
      const info = p?.imageinfo?.[0];
      if (!info?.thumburl) return null;
      return {
        thumb: info.thumburl as string,
        full: (info.url as string) || (info.thumburl as string),
        title: String(p?.title || "").replace(/^File:/, ""),
      };
    })
    .filter(Boolean) as ImageResult[];
}

interface UploadResourceModalProps {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: any) => void;
  form: any;
  loading: boolean;
  isEditing: boolean;
  fileList: any[];
  setFileList: (files: any[]) => void;
  categories: any[];
  resources: any[];
}

const UploadResourceModal: React.FC<UploadResourceModalProps> = ({
  open,
  onCancel,
  onFinish,
  form,
  loading,
  isEditing,
  fileList,
  categories,
  resources,
  setFileList,
}) => {
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

  const selectedResourceType = Form.useWatch("type", form);
  const selectedSource = Form.useWatch("source", form);
  const linkValue = Form.useWatch("link", form);
  const thumbnailUrlValue = Form.useWatch("thumbnail_url", form);
  const [thumbPreviewError, setThumbPreviewError] = useState(false);
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [imageQuery, setImageQuery] = useState("");
  const [imageResults, setImageResults] = useState<ImageResult[]>([]);
  const [searchingImages, setSearchingImages] = useState(false);
  const [fetchingFromLink, setFetchingFromLink] = useState(false);

  const setThumbnail = (url: string) => {
    form.setFieldsValue({ thumbnail_url: url });
    setThumbPreviewError(false);
  };

  const runImageSearch = async (term: string) => {
    const query = term.trim();
    if (!query) return;
    setSearchingImages(true);
    try {
      const results = await searchCommonsImages(query);
      setImageResults(results);
      if (results.length === 0) {
        message.info("No images found. Try a different search term.");
      }
    } catch {
      message.error("Image search failed. You can paste an image URL instead.");
    } finally {
      setSearchingImages(false);
    }
  };

  const openImageSearch = () => {
    const next = !searchPanelOpen;
    setSearchPanelOpen(next);
    if (next && imageResults.length === 0) {
      const seed = form.getFieldValue("title") || "";
      setImageQuery(seed);
      if (seed.trim()) runImageSearch(seed);
    }
  };

  const fetchThumbnailFromLink = async () => {
    const link = (form.getFieldValue("link") || "").trim();
    if (!link) {
      message.info("Enter a resource link first.");
      return;
    }
    setFetchingFromLink(true);
    try {
      const res = await fetch(`/api/link-preview?url=${encodeURIComponent(link)}`);
      const data = await res.json();
      const image = data?.image || data?.favicon;
      if (image) {
        setThumbnail(image);
        message.success("Cover image loaded from link.");
      } else {
        message.info("Couldn't find an image on that page. Try searching instead.");
      }
    } catch {
      message.error("Couldn't fetch a preview from that link.");
    } finally {
      setFetchingFromLink(false);
    }
  };

  const selectedResource = useMemo(() => {
    if (!selectedResourceType) return null;
    const selectedId = Number(selectedResourceType);
    return resources.find((resource) => Number(resource.id) === selectedId) || null;
  }, [resources, selectedResourceType]);

  const resourceName = selectedResource?.name?.toLowerCase();
  const sourceMode = (selectedSource as "upload" | "link") || "upload";
  const isLinkMode = sourceMode === "link";

  const getAcceptedFileTypes = () => {
    if (!selectedResource) return "";
    const resourceName = selectedResource.name.toLowerCase();
    
    switch (resourceName) {
      case 'video':
        return '.mp4,.mov,.avi,.mkv,.webm';
      case 'audio':
        return '.mp3,.wav,.m4a,.ogg,.aac';
      case 'pdf':
        return '.pdf';
      case 'book':
      case 'document':
        return '.pdf,.doc,.docx,.txt,.epub';
      default:
        return "";
    }
  };

  return (
    <Modal
      title={isEditing ? "Edit Resource" : "Upload New Islamic Resource"}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please input the title!" }]}
        >
          <Input placeholder="Enter resource title" />
        </Form.Item>

        <Form.Item
          name="type"
          label="Resource Type"
          rules={[{ required: true, message: "Please select a type!" }]}
        >
          <Select 
            onChange={(value) => {
              const selectedId = Number(value);
              const resource = resources.find(
                (item) => Number(item.id) === selectedId
              );
              const resourceName = resource?.name?.toLowerCase();
              setFileList([]);
              form.setFieldsValue({ source: "upload", link: undefined });
            }}
          >
            {resources?.map((resource) => (
              <Select.Option key={resource.id} value={resource.id}>
                {resource.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: "Please select a Category!" }]}
        >
          <Select placeholder="Select Category">
            {categories?.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {formatCategoryLabel(category.name)}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please add a description!" }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Brief description of the resource"
          />
        </Form.Item>

        <Form.Item name="source" label="Resource Source" initialValue="upload">
          <Radio.Group
            onChange={(event) => {
              if (event.target.value === "link") {
                setFileList([]);
              }
            }}
          >
            <Radio value="upload">Upload File</Radio>
            <Radio value="link">External Link</Radio>
          </Radio.Group>
        </Form.Item>

        {isLinkMode && (
          <Form.Item
            name="link"
            label="Resource Link"
            rules={[
              { required: true, message: "Please add a resource link!" },
              { type: "url", message: "Please enter a valid URL!" },
            ]}
          >
            <Input
              placeholder={
                selectedResourceType
                  ? "https://..."
                  : "Select resource type first"
              }
              disabled={!selectedResourceType}
            />
          </Form.Item>
        )}

        {!isLinkMode && (
          <Form.Item
            name="file"
            label="File"
            rules={
              isEditing
                ? []
                : [{ required: true, message: "Please upload a file!" }]
            }
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
          >
            <Upload.Dragger
              name="file"
              multiple={false}
              fileList={fileList}
              beforeUpload={(file) => {
                setFileList([file]);
                return false;
              }}
              onRemove={() => {
                setFileList([]);
              }}
              maxCount={1}
              accept={getAcceptedFileTypes()}
              disabled={!selectedResourceType}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ fontSize: "32px", color: "#38C16C" }} />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                {selectedResourceType 
                  ? `Supported formats: ${getAcceptedFileTypes().replace(/,/g, ', ')}`
                  : "Please select a resource type first"}
              </p>
            </Upload.Dragger>
          </Form.Item>
        )}

        <Divider />

        {/* Cover Image */}
        <div className="mb-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <PictureOutlined className="text-emerald-600" /> Cover Image
              <span className="text-xs font-normal text-gray-400">
                (optional — appears on the card)
              </span>
            </span>
            <div className="flex items-center gap-2">
              {isLinkMode && (
                <Tooltip title="Pull a cover image from the resource link">
                  <Button
                    size="small"
                    icon={<LinkOutlined />}
                    loading={fetchingFromLink}
                    disabled={!linkValue}
                    onClick={fetchThumbnailFromLink}
                    className="!rounded-xl"
                  >
                    Use from link
                  </Button>
                </Tooltip>
              )}
              <Button
                size="small"
                type={searchPanelOpen ? "primary" : "default"}
                icon={<SearchOutlined />}
                onClick={openImageSearch}
                className={`!rounded-xl ${searchPanelOpen ? "!bg-primary !border-primary" : ""}`}
              >
                Search images
              </Button>
            </div>
          </div>

          {searchPanelOpen && (
            <div className="mb-3 rounded-xl border border-gray-200 bg-white p-3">
              <Input.Search
                placeholder="Search images (e.g. Qur'an, mosque, prayer)"
                enterButton
                allowClear
                value={imageQuery}
                onChange={(e) => setImageQuery(e.target.value)}
                onSearch={(value) => runImageSearch(value)}
                loading={searchingImages}
              />
              <div className="mt-3 max-h-56 overflow-y-auto">
                {searchingImages ? (
                  <div className="flex h-32 items-center justify-center">
                    <Spin />
                  </div>
                ) : imageResults.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {imageResults.map((img) => {
                      const selected = thumbnailUrlValue === img.full;
                      return (
                        <button
                          type="button"
                          key={img.full}
                          title={img.title}
                          onClick={() => setThumbnail(img.full)}
                          className={`relative aspect-square overflow-hidden rounded-lg border transition-all ${
                            selected
                              ? "border-emerald-500 ring-2 ring-emerald-200"
                              : "border-gray-200 hover:border-emerald-300"
                          }`}
                        >
                          <img
                            src={img.thumb}
                            alt={img.title}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                          {selected && (
                            <span className="absolute right-1 top-1 text-emerald-500">
                              <CheckCircleFilled />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="py-6 text-center text-xs text-gray-400">
                    Type a keyword and press search to find a cover image.
                  </p>
                )}
              </div>
            </div>
          )}

          <Form.Item name="thumbnail_url" noStyle>
            <Input
              placeholder="Or paste an image URL here (https://...)"
              allowClear={{ clearIcon: <CloseCircleOutlined /> }}
              onChange={() => setThumbPreviewError(false)}
              className="!rounded-xl"
            />
          </Form.Item>

          {thumbnailUrlValue && !thumbPreviewError && (
            <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
              <img
                src={thumbnailUrlValue}
                alt="Cover preview"
                className="h-36 w-full object-cover"
                onError={() => setThumbPreviewError(true)}
              />
            </div>
          )}
          {thumbnailUrlValue && thumbPreviewError && (
            <p className="mt-2 text-xs text-red-500">
              Could not load this image URL — check that it is a direct image link.
            </p>
          )}
          {!thumbnailUrlValue && !searchPanelOpen && (
            <p className="mt-2 text-xs text-gray-400">
              Tip: click “Search images” to find and pick a cover without copying links.
            </p>
          )}
        </div>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} className="!bg-primary">
              {isEditing ? "Update" : "Upload"}
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UploadResourceModal;
