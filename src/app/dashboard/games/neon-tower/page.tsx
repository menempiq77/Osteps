"use client";

import dynamic from "next/dynamic";
import { Spin } from "antd";

const NeonTowerGame = dynamic(
  () => import("@/components/games/NeonTowerGame"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spin size="large" />
      </div>
    ),
  }
);

export default function NeonTowerPage() {
  return <NeonTowerGame />;
}
