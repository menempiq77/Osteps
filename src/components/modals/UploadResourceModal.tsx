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
          <Select>
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
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="description" label="Description">
          <Input.TextArea
            rows={3}
            placeholder="Brief description of the resource"
          />
        </Form.Item>

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
              <UploadOutlined style={{ fontSize: "32px", color: "#38C16C" }} />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
          </Upload.Dragger>
        </Form.Item>

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
