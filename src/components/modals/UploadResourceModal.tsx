import React, { useMemo } from "react";
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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

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
