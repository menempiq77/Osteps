"use client";

import Link from "next/link";
import { Card, Typography } from "antd";

export default function MindUpgradePage() {
  return (
    <div className="p-3 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border border-[#D6EFE2] lg:col-span-2">
          <Typography.Title level={3} className="!mb-2">
            {"\uD83E\uDDE0 Mind-upgrade"}
          </Typography.Title>
          <Typography.Text className="text-gray-500">
            Select a topic from the right side.
          </Typography.Text>
        </Card>

        <Card className="border border-[#D6EFE2]">
          <Typography.Title level={5} className="!mb-3">
            Sections
          </Typography.Title>
          <div className="flex flex-col gap-2">
            <Link
              href="/dashboard/mind-upgrade/aqeedah"
              className="rounded-md border border-[#D6EFE2] px-3 py-2 hover:bg-[#F3FBF6]"
            >
              Aqeedah
            </Link>
            <Link
              href="/dashboard/mind-upgrade/stories-of-the-prophets"
              className="rounded-md border border-[#D6EFE2] px-3 py-2 hover:bg-[#F3FBF6]"
            >
              Stories of the Prophets
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
