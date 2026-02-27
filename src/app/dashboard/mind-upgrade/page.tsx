"use client";

import { Card, Typography } from "antd";

export default function MindUpgradePage() {
  return (
    <div className="p-3 md:p-6">
      <Card className="border border-[#D6EFE2]">
        <Typography.Title level={3} className="!mb-2">
          🧠 Mind-upgrade
        </Typography.Title>
        <Typography.Text className="text-gray-500">
          Mind-upgrade section is ready. Content coming soon.
        </Typography.Text>
      </Card>
    </div>
  );
}
