"use client";

import { Card, Col, Row, Tag, Typography } from "antd";
import Link from "next/link";
import { AQEEDAH_TOPICS } from "./topics";

export default function AqeedahPage() {
  return (
    <div className="p-3 md:p-6">
      <Card className="border border-[#D6EFE2] mb-4">
        <Typography.Title level={3} className="!mb-2">
          Aqeedah
        </Typography.Title>
        <Typography.Text className="text-gray-500">
          Foundations and core creed topics imported from the Mind-upgrade module.
        </Typography.Text>
      </Card>

      <Row gutter={[12, 12]}>
        {AQEEDAH_TOPICS.map((topic) => (
          <Col key={topic.id} xs={24} sm={12} lg={8}>
            <Link href={`/dashboard/mind-upgrade/aqeedah/topic-${topic.id}`} className="block">
              <Card className="h-full border border-[#D6EFE2] cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <Tag color="green">Topic {topic.id}</Tag>
                </div>
                <Typography.Text strong>{topic.titleEn}</Typography.Text>
                <div className="mt-2" dir="rtl">
                  <Typography.Text className="text-gray-500">{topic.titleAr}</Typography.Text>
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}
