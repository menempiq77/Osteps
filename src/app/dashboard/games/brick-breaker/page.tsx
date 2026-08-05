"use client";

import dynamic from "next/dynamic";
import { Spin } from "antd";

const BrickBreakerGame = dynamic(
  () => import("@/components/games/BrickBreakerGame"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spin size="large" />
      </div>
    ),
  }
);

export default function BrickBreakerPage() {
  return <BrickBreakerGame />;
}
