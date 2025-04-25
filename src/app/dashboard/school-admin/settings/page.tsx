"use client"
import React from 'react'
import { Tabs, Form, Input, Button, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const SchoolAdminSettings = () => {
  const [profileForm] = Form.useForm()
  const [schoolForm] = Form.useForm()
  const [securityForm] = Form.useForm()

  const [profileImage, setProfileImage] = React.useState([])
  const [schoolLogo, setSchoolLogo] = React.useState([])

  const onFinish = (values) => {
    console.log('Success:', values)
    message.success('Settings updated successfully!')
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
    message.error('Please fill all required fields!')
  }

  const items = [
    {
      key: '1',
      label: 'Profile',
      children: (
        <div className="w-full max-w-3xl">
          <Form
            form={profileForm}
            name="profile"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Form.Item
                  label="First Name"
                  name="firstName"
                  rules={[{ required: true, message: 'Please input your first name!' }]}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
              <div className="flex-1">
                <Form.Item
                  label="Last Name"
                  name="lastName"
                  rules={[{ required: true, message: 'Please input your last name!' }]}
                >
                  <Input size="large" />
                </Form.Item>
              </div>
            </div>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[{ required: true, message: 'Please input your phone number!' }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item label="Profile Picture">
              <Upload
                fileList={profileImage}
                onChange={({ fileList }) => setProfileImage(fileList)}
                beforeUpload={() => false}
                listType="picture"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Upload Photo</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" className="w-full md:w-auto">
                Update Profile
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: '2',
      label: 'School Information',
      children: (
        <div className="w-full max-w-3xl">
          <Form
            form={schoolForm}
            name="school"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="School Name"
              name="schoolName"
              rules={[{ required: true, message: 'Please input school name!' }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="School Address"
              name="address"
              rules={[{ required: true, message: 'Please input school address!' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label="School Phone"
              name="schoolPhone"
              rules={[{ required: true, message: 'Please input school phone number!' }]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="School Email"
              name="schoolEmail"
              rules={[
                { required: true, message: 'Please input school email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item label="School Logo">
              <Upload
                fileList={schoolLogo}
                onChange={({ fileList }) => setSchoolLogo(fileList)}
                beforeUpload={() => false}
                listType="picture"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Upload Logo</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" className="w-full md:w-auto">
                Save School Information
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: '3',
      label: 'Security',
      children: (
        <div className="w-full max-w-3xl">
          <Form
            form={securityForm}
            name="security"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[{ required: true, message: 'Please input your current password!' }]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[{ required: true, message: 'Please input new password!' }]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('The two passwords do not match!'))
                  },
                }),
              ]}
            >
              <Input.Password size="large" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" className="w-full md:w-auto">
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ]

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">School Settings</h1>
      <Tabs
        defaultActiveKey="1"
        items={items}
        tabPosition="top"
        type="line"
        className="w-full"
      />
    </div>
  )
}

export default SchoolAdminSettings
