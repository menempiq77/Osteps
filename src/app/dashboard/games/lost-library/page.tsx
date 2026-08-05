"use client";

import dynamic from "next/dynamic";
import { Spin } from "antd";

const LostLibraryGame = dynamic(
  () => import("@/components/games/LostLibraryGame"),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spin size="large" />
      </div>
    ),
  }
);

export default function LostLibraryPage() {
  return (
    <div className="pb-10">
      <LostLibraryGame />
    </div>
  );
}
