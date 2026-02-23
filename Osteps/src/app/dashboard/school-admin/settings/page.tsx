"use client";
import React from "react";
import { Tabs, Form, Input, Button, Upload, message, Breadcrumb } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setCurrentUser } from "@/features/auth/authSlice";
import {
  changePassword,
  updateSchoolAdminProfile,
} from "@/services/settingApi";
import Link from "next/link";

const SchoolAdminSettings = () => {
  const [profileForm] = Form.useForm();
  const [securityForm] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [profileImage, setProfileImage] = React.useState([]);
  const [schoolLogo, setSchoolLogo] = React.useState([]);
  const [profileLoading, setProfileLoading] = React.useState(false);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [messageApi, contextHolder] = message.useMessage();

  React.useEffect(() => {
    if (currentUser?.id) {
      const nameParts = currentUser.name?.trim().split(" ") || [];
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      profileForm.setFieldsValue({
        firstName: firstName,
        lastName: lastName,
        email: currentUser.email,
        contact: currentUser.contact || "",
      });
    }
  }, [currentUser, profileForm]);

  const onProfileFinish = async (values) => {
    try {
      setProfileLoading(true);
      const formData = new FormData();
      formData.append("user_id", currentUser.id.toString());
      formData.append("first_name", values.firstName);
      formData.append("last_name", values.lastName);
      formData.append("email", values.email);
      formData.append("contact", values.contact);

      if (profileImage.length > 0) {
        formData.append("profile_path", profileImage[0].originFileObj);
      }

      if (schoolLogo.length > 0) {
        formData.append("logo", schoolLogo[0].originFileObj);
      }

      const response = await updateSchoolAdminProfile(formData);

      const updatedUser = {
        ...currentUser,
        name: response?.name,
        profile_path: response?.profile_photo,
        contact: response.phone_number,
        logo: response?.logo,
      };

      dispatch(setCurrentUser(updatedUser));

      messageApi.success("Profile updated successfully!");
      profileForm.setFieldsValue({
        firstName: response.first_name,
        lastName: response.last_name,
        email: response.email,
        contact: response.phone_number,
      });
    } catch (error) {
      console.error("Profile update failed:", error);
      messageApi.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    messageApi.error("Please fill all required fields!");
  };

  const onSecurityFinish = async (values) => {
    try {
      setLoading(true);
      await changePassword({
        current_password: values.currentPassword,
        new_password: values.newPassword,
        new_password_confirmation: values.confirmPassword,
      });
      messageApi.success("Password changed successfully!");
      securityForm.resetFields();
    } catch (error) {
      console.error("Password change failed:", error);
      messageApi.error(
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
        <div className="w-full max-w-3xl">
          <Form
            form={profileForm}
            name="profile"
            layout="vertical"
            onFinish={onProfileFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div className="flex justify-between gap-4 mb-6">
              {/* Profile Image */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {profileImage.length > 0 ? (
                    <img
                      src={URL.createObjectURL(profileImage[0].originFileObj)}
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
                    <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 text-xl">
                        {currentUser?.name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <Form.Item label="Profile Picture" className="mb-0">
                    <Upload
                      fileList={profileImage}
                      onChange={({ fileList }) => setProfileImage(fileList)}
                      beforeUpload={() => false}
                      listType="picture"
                      maxCount={1}
                      showUploadList={false}
                    >
                      <Button icon={<UploadOutlined />}>Change Photo</Button>
                    </Upload>
                    {profileImage.length > 0 && (
                      <Button
                        danger
                        type="text"
                        onClick={() => setProfileImage([])}
                        className="ml-2"
                      >
                        Remove
                      </Button>
                    )}
                  </Form.Item>
                  <div className="text-xs text-gray-500">
                    JPG, GIF or PNG.
                  </div>
                </div>
              </div>
              {/* School Logo */}
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {schoolLogo.length > 0 ? (
                    <img
                      src={URL.createObjectURL(schoolLogo[0].originFileObj)}
                      alt="School Logo"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : currentUser?.logo ? (
                    <img
                      src={currentUser.logo}
                      alt="School Logo"
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 text-xl">S</span>
                    </div>
                  )}
                </div>
                <div>
                  <Form.Item label="School Logo" className="mb-0">
                    <Upload
                      fileList={schoolLogo}
                      onChange={({ fileList }) => setSchoolLogo(fileList)}
                      beforeUpload={() => false}
                      listType="picture"
                      maxCount={1}
                      showUploadList={false}
                    >
                      <Button icon={<UploadOutlined />}>Upload Logo</Button>
                    </Upload>
                    {schoolLogo.length > 0 && (
                      <Button
                        danger
                        type="text"
                        onClick={() => setSchoolLogo([])}
                        className="ml-2"
                      >
                        Remove
                      </Button>
                    )}
                  </Form.Item>
                  <div className="text-xs text-gray-500">
                    JPG, GIF or PNG.
                  </div>
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

            <Form.Item
              label="Phone Number"
              name="contact"
              rules={[
                { required: true, message: "Please input your phone number!" },
              ]}
            >
              <Input size="large" />
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
      key: "3",
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
    <div className="p-4 md:p-6">
      {contextHolder}
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <span>School Settings</span>,
          },
        ]}
        className="!mb-2"
      />
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
        School Settings
      </h1>
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

export default SchoolAdminSettings;
