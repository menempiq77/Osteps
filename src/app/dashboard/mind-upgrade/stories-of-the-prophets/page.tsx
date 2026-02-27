"use client";

import { Card, Col, Row, Tag, Typography } from "antd";
import Link from "next/link";
import { PROPHETS } from "./prophets";

export default function StoriesOfTheProphetsPage() {
  return (
    <div className="p-3 md:p-6">
      <Card className="border border-[#D6EFE2] mb-4">
        <Typography.Title level={3} className="!mb-2">
          Stories of the Prophets
        </Typography.Title>
        <Typography.Text className="text-gray-500">
          25 prophets mentioned in the Qur'an, imported from the Mind-upgrade module.
        </Typography.Text>
      </Card>

      <Row gutter={[12, 12]}>
        {PROPHETS.map((prophet, index) => (
          <Col key={prophet.slug} xs={24} sm={12} lg={8}>
            <Link href={`/dashboard/mind-upgrade/stories-of-the-prophets/${prophet.slug}`} className="block">
              <Card className="h-full border border-[#D6EFE2] cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <Tag color="blue">#{index + 1}</Tag>
                </div>
                <Typography.Text strong>{prophet.name}</Typography.Text>
                <div className="mt-2">
                  <Typography.Text className="text-gray-500">{prophet.subtitle}</Typography.Text>
                </div>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  );
}
