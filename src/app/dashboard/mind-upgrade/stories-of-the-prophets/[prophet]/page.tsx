"use client";

import { Card, Typography, Button } from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PROPHETS } from "../prophets";

export default function ProphetStoryPage() {
  const params = useParams();
  const prophetSlug = params.prophet as string;
  
  const prophet = PROPHETS.find((p) => p.slug === prophetSlug);
  const prophetIndex = PROPHETS.findIndex((p) => p.slug === prophetSlug);

  if (!prophet) {
    return (
      <div className="p-3 md:p-6">
        <Card className="border border-[#D6EFE2]">
          <Typography.Title level={3}>Prophet Not Found</Typography.Title>
          <Link href="/dashboard/mind-upgrade/stories-of-the-prophets">
            <Button type="primary">← Back to Stories of the Prophets</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      <div className="mb-4">
        <Link href="/dashboard/mind-upgrade/stories-of-the-prophets">
          <Button>← Back to All Prophets</Button>
        </Link>
      </div>

      <Card className="border border-[#D6EFE2]">
        <Typography.Title level={3} className="!mb-2">
          #{prophetIndex + 1} - {prophet.name}
        </Typography.Title>
        <Typography.Title level={5} className="!mb-4 text-gray-600">
          {prophet.subtitle}
        </Typography.Title>

        <div className="mt-6">
          <Typography.Paragraph className="text-gray-500">
            The full story will be added here, including:
          </Typography.Paragraph>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Brief introduction and context</li>
            <li>Key events from the Qur'an and authentic Sunnah</li>
            <li>Moral lessons and wisdom</li>
            <li>Practical applications for students</li>
            <li>Quiz to test knowledge</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
