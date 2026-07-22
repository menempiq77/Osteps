"use client";

import { Alert, Button, Empty, Form, Input, Select, Tabs } from "antd";
import { useEffect, useState } from "react";

interface YearFormValues {
  id?: number;
  name: string;
  school_id?: number;
  terms?: number;
  color?: string;
  number_of_terms?: string;
}

interface YearFormProps {
  onSubmit: (data: YearFormValues) => void;
  defaultValues?: YearFormValues | null;
  archivedYearGroups?: Array<{
    key: string;
    sourceSubjectName: string;
    yearName: string;
    classCount: number;
  }>;
  archivedYearGroupsLoading?: boolean;
  importingArchivedYear?: boolean;
  onImportArchivedYear?: (key: string) => void;
}

export default function YearForm({
  onSubmit,
  defaultValues,
  archivedYearGroups = [],
  archivedYearGroupsLoading = false,
  importingArchivedYear = false,
  onImportArchivedYear,
}: YearFormProps) {
  const [form] = Form.useForm();
  const [importForm] = Form.useForm();
  const [activeTab, setActiveTab] = useState("manual");

  useEffect(() => {
    if (defaultValues) {
      form.setFieldsValue({
        name: defaultValues.name || "",
        school_id: defaultValues.school_id,
        color: defaultValues.color || "green",
        number_of_terms: defaultValues.number_of_terms ?? undefined,
        ...(defaultValues.id && { id: defaultValues.id }),
      });
    } else {
      form.resetFields();
      importForm.resetFields();
      setActiveTab("manual");
      form.setFieldsValue({
        name: "",
        color: "green",
      });
    }
  }, [defaultValues, form, importForm]);

  const onFinish = (values: YearFormValues) => {
    onSubmit(values);
  };

  const manualForm = (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      className="bg-white space-y-4"
    >
      <Form.Item
        label="Year Name"
        name="name"
        rules={[{ required: true, message: "Year name is required" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Card Color"
        name="color"
        rules={[{ required: true, message: "Please choose a color" }]}
      >
        <Select>
          <Select.Option value="green">Green</Select.Option>
          <Select.Option value="yellow">Yellow</Select.Option>
          <Select.Option value="red">Red</Select.Option>
          <Select.Option value="blue">Blue</Select.Option>
          <Select.Option value="purple">Purple</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Number of Terms"
        name="number_of_terms"
        extra="Sets the term count for all classes in this year group"
      >
        <Select placeholder="Select term count" allowClear>
          <Select.Option value="two">2 Terms</Select.Option>
          <Select.Option value="three">3 Terms</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="float-right !bg-primary !border-primary"
        >
          {defaultValues?.id ? "Update Year" : "Create Year"}
        </Button>
      </Form.Item>
    </Form>
  );

  if (defaultValues?.id || !onImportArchivedYear) {
    return manualForm;
  }

  return (
    <Tabs
      activeKey={activeTab}
      onChange={setActiveTab}
      items={[
        {
          key: "manual",
          label: "Create manually",
          children: manualForm,
        },
        {
          key: "import",
          label: "Import archived year group",
          children: archivedYearGroupsLoading ? (
            <div className="py-10 text-center text-sm text-slate-500">
              Loading archived year groups…
            </div>
          ) : archivedYearGroups.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No archived subjects contain year groups that can be imported."
            />
          ) : (
            <Form
              form={importForm}
              layout="vertical"
              onFinish={({ archived_year_group_key }) =>
                onImportArchivedYear(String(archived_year_group_key))
              }
              className="space-y-4"
            >
              <Alert
                type="info"
                showIcon
                message="Copy classes and student assignments"
                description="The selected year group becomes active in this subject. The archived subject and all of its historical data remain unchanged and read-only."
              />
              <Form.Item
                label="Archived year group"
                name="archived_year_group_key"
                rules={[
                  { required: true, message: "Choose a year group to import" },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  placeholder="Choose an archived subject and year group"
                  options={archivedYearGroups.map((group) => ({
                    value: group.key,
                    label: `${group.sourceSubjectName} — ${group.yearName} (${group.classCount} ${
                      group.classCount === 1 ? "class" : "classes"
                    })`,
                  }))}
                />
              </Form.Item>
              <Form.Item className="!mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={importingArchivedYear}
                  className="float-right !bg-primary !border-primary"
                >
                  Import Year Group
                </Button>
              </Form.Item>
            </Form>
          ),
        },
      ]}
    />
  );
}
