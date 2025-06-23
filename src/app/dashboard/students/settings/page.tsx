"use client";
import React from "react";
import { Tabs, Form, Input, Button, Upload, message, Select } from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { changePassword, updateStudentProfile } from "@/services/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setCurrentUser } from "@/features/auth/authSlice";

const StudentSettings = () => {
  const [profileForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [fileList, setFileList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [profileLoading, setProfileLoading] = React.useState(false);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  React.useEffect(() => {
    if (currentUser?.id) {
      const nameParts = currentUser.name?.trim().split(" ") || [];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      profileForm.setFieldsValue({
        firstName: firstName,
        lastName: lastName,
        email: currentUser.email,
      });
    }
  }, [currentUser, profileForm]);

 const onProfileFinish = async (values) => {
  try {
    setProfileLoading(true);

    const formData = new FormData();
    formData.append("user_id", currentUser.id.toString());
    formData.append("class_id", currentUser.studentClass.toString());
    formData.append("first_name", values.firstName);
    formData.append("last_name", values.lastName);
    formData.append("email", values.email);

    if (fileList.length > 0) {
      formData.append("profile_path", fileList[0].originFileObj);
    }

    const response = await updateStudentProfile(formData);

    const updatedUser = {
      ...currentUser,
      name: response?.name,
      profile_path: response?.profile_photo,
    };

    dispatch(setCurrentUser(updatedUser));

    const nameParts = response.name?.trim().split(" ") || [];
    profileForm.setFieldsValue({
      firstName: nameParts[0] || "",
      lastName: nameParts.slice(1).join(" ") || "",
      email: response.email,
    });

    message.success("Profile updated successfully!");
  } catch (error) {
    console.error("Profile update failed:", error);
    message.error(
      error.response?.message || "Failed to update profile"
    );
  } finally {
    setProfileLoading(false);
  }
};

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Please fill all required fields!");
  };

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
  };
  const handleRemovePhoto = () => {
    setFileList([]);
  };

  const onSecurityFinish = async (values) => {
    try {
      setLoading(true);
      await changePassword({
        current_password: values.currentPassword,
        new_password: values.newPassword,
        new_password_confirmation: values.confirmPassword,
      });
      message.success("Password changed successfully!");
      securityForm.resetFields();
    } catch (error) {
      console.error("Password change failed:", error);
      message.error(
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: "1",
      label: "Profile",
      children: (
        <div className="w-full max-w-2xl px-2">
          <Form
            form={profileForm}
            name="profile"
            layout="vertical"
            onFinish={onProfileFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div className="flex items-center gap-6 mb-6">
              <div className="flex-shrink-0">
                {fileList.length > 0 ? (
                  <img
                    src={URL.createObjectURL(fileList[0].originFileObj)}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : currentUser?.profile_path ? (
                  <img
                    src={currentUser.profile_path}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <UserOutlined className="text-gray-500 text-2xl" />
                  </div>
                )}
              </div>
              <div>
                <Form.Item label="Profile Picture" className="mb-2">
                  <Upload
                    fileList={fileList}
                    onChange={handleUploadChange}
                    beforeUpload={() => false}
                    listType="picture"
                    maxCount={1}
                    showUploadList={false}
                  >
                    <Button icon={<UploadOutlined />}>
                      {fileList.length > 0 || currentUser?.profile_path
                        ? "Change Photo"
                        : "Upload Photo"}
                    </Button>
                  </Upload>
                  {(fileList.length > 0 || currentUser?.profile_path) && (
                    <Button
                      danger
                      type="text"
                      onClick={handleRemovePhoto}
                      className="ml-2"
                    >
                      Remove
                    </Button>
                  )}
                </Form.Item>
                <div className="text-xs text-gray-500">
                  JPG, PNG, or GIF. Max size 2MB
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Please input your first name!",
                    },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
              <div className="flex-1">
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[
                    { required: true, message: "Please input your last name!" },
                  ]}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
            </div>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input size="large" disabled />
            </Form.Item>

            <Form.Item className="text-right">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full md:w-auto !bg-primary !border-primary hover:!bg-primary hover:!border-primary"
                loading={profileLoading}
              >
                Update Profile
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: "2",
      label: "Security",
      children: (
        <div className="w-full max-w-2xl px-2">
          <Form
            form={securityForm}
            name="security"
            layout="vertical"
            onFinish={onSecurityFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: "Please input your current password!",
                },
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please input new password!" },
                { min: 8, message: "Password must be at least 8 characters!" },
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item className="text-right">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full md:w-auto !bg-primary !border-primary hover:!bg-primary hover:!border-primary"
              >
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-6">Student Settings</h1>
      <Tabs
        defaultActiveKey="1"
        items={items}
        tabPosition="top"
        type="line"
        className="w-full"
      />
    </div>
  );
};

export default StudentSettings;
