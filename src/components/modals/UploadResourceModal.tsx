import React from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Upload,
  Divider,
  Button,
  Space,
  message,
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
}

const UploadResourceModal: React.FC<UploadResourceModalProps> = ({
  open,
  onCancel,
  onFinish,
  form,
  loading,
  isEditing,
  fileList,
  setFileList,
}) => {
  return (
    <Modal
      title={isEditing ? "Edit Resource" : "Upload New Islamic Resource"}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
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
          <Select>
            <Select.Option value="pdf">PDF Document</Select.Option>
            <Select.Option value="book">Book</Select.Option>
            <Select.Option value="video">Video</Select.Option>
            <Select.Option value="audio">Audio</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="category"
          label="Quran"
          rules={[{ required: true, message: "Please select a subject!" }]}
        >
          <Select placeholder="Select Category">
            <Select.Option value="Quran">Quran</Select.Option>
            <Select.Option value="Hadees">Hadees</Select.Option>
            <Select.Option value="Tafseer">Tafseer</Select.Option>
            <Select.Option value="Seerah">Seerah</Select.Option>
            <Select.Option value="Fiqh">Fiqh</Select.Option>
            <Select.Option value="Dua">Dua</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="description" label="Description (Optional)">
          <Input.TextArea
            rows={3}
            placeholder="Brief description of the resource"
          />
        </Form.Item>

        {!isEditing && (
          <Form.Item
            name="file"
            label="File"
            rules={[{ required: true, message: "Please upload a file!" }]}
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
              accept=".pdf,.doc,.docx,.mp4,.mov,.avi,.mp3,.wav,.m4a"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Supports PDF, DOC, MP4, MP3 files (Max 100MB)
              </p>
            </Upload.Dragger>
          </Form.Item>
        )}

        <Divider />

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
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