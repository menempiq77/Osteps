"use client"
import React from 'react'
import { Tabs, Form, Input, Button, Upload, message, Select } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

const TeacherSettings = () => {
  const [form] = Form.useForm()
  const [fileList, setFileList] = React.useState([])

  const onFinish = (values) => {
    console.log('Success:', values)
    message.success('Settings updated successfully!')
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
    message.error('Please fill all required fields!')
  }

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList)
  }

  const subjects = [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Geography',
    'Computer Science',
    'Physical Education',
    'Art',
    'Music',
  ]

  const items = [
    {
      key: '1',
      label: 'Profile',
      children: (
        <div className="max-w-2xl">
          <Form
            form={form}
            name="profile"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <div className="flex gap-6 mb-6">
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

            <Form.Item
              label="Subjects"
              name="subjects"
              rules={[{ required: true, message: 'Please select at least one subject!' }]}
            >
              <Select
                mode="multiple"
                size="large"
                placeholder="Select subjects you teach"
                options={subjects.map((subject) => ({ value: subject, label: subject }))}
              />
            </Form.Item>

            <Form.Item label="Profile Picture">
              <Upload
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false}
                listType="picture"
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Upload Photo</Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                Update Profile
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Class Preferences',
      children: (
        <div className="max-w-2xl">
          <Form
            name="preferences"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Default Class View"
              name="defaultView"
              initialValue="list"
            >
              <Select size="large">
                <Select.Option value="list">List View</Select.Option>
                <Select.Option value="grid">Grid View</Select.Option>
                <Select.Option value="calendar">Calendar View</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Notification Preferences"
              name="notifications"
              initialValue={['assignments', 'messages']}
            >
              <Select mode="multiple" size="large">
                <Select.Option value="assignments">New Assignments</Select.Option>
                <Select.Option value="submissions">Assignment Submissions</Select.Option>
                <Select.Option value="messages">Messages from Students</Select.Option>
                <Select.Option value="announcements">School Announcements</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large">
                Save Preferences
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
        <div className="max-w-2xl">
          <Form
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
              <Button type="primary" htmlType="submit" size="large">
                Change Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      ),
    },
  ]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Teacher Settings</h1>
      <Tabs defaultActiveKey="1" items={items} tabPosition="left" />
    </div>
  )
}

export default TeacherSettings