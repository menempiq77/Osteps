"use client";

import { Card, Typography, Button } from "antd";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AQEEDAH_TOPICS } from "../topics";

export default function AqeedahTopicPage() {
  const params = useParams();
  const topicParam = params.topic as string;
  
  // Extract topic ID from "topic-1" format
  const topicId = parseInt(topicParam.replace("topic-", ""));
  const topic = AQEEDAH_TOPICS.find((t) => t.id === topicId);

  if (!topic) {
    return (
      <div className="p-3 md:p-6">
        <Card className="border border-[#D6EFE2]">
          <Typography.Title level={3}>Topic Not Found</Typography.Title>
          <Link href="/dashboard/mind-upgrade/aqeedah">
            <Button type="primary">← Back to Aqeedah Topics</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-6">
      <div className="mb-4">
        <Link href="/dashboard/mind-upgrade/aqeedah">
          <Button>← Back to Aqeedah Topics</Button>
        </Link>
      </div>

      <Card className="border border-[#D6EFE2]">
        <Typography.Title level={3} className="!mb-2">
          Topic {topic.id}: {topic.titleEn}
        </Typography.Title>
        <Typography.Title level={4} dir="rtl" className="!mb-4 text-gray-600">
          {topic.titleAr}
        </Typography.Title>

        <div className="mt-6">
          <Typography.Paragraph className="text-gray-500">
            Detailed content for this topic will be added here, including:
          </Typography.Paragraph>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Qur'anic verses with translations</li>
            <li>Authentic Hadith evidences</li>
            <li>Detailed explanations from scholars</li>
            <li>Practical lessons and applications</li>
            <li>Quiz to test understanding</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
