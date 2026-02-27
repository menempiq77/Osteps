"use client";

import Link from "next/link";
import { BookOpen, ScrollText } from "lucide-react";
import { Card, Typography } from "antd";

export default function MindUpgradePage() {
  return (
    <div className="p-3 md:p-6">
      <div className="grid grid-cols-1 gap-4">
        <Card className="border border-[#D6EFE2]">
          <Typography.Title level={3} className="!mb-2">
            {"\uD83E\uDDE0 Mind-upgrade"}
          </Typography.Title>
          <Typography.Text className="text-gray-500">
            Strengthen beliefs and values through focused Islamic learning.
          </Typography.Text>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/dashboard/mind-upgrade/aqeedah"
            className="block rounded-2xl border border-[#A7E2C8] bg-white/70 p-5 transition hover:bg-[#F2FBF6]"
          >
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-xl bg-[#BFE8D5] text-[#2F7D58] flex items-center justify-center">
                <BookOpen className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-3xl font-semibold text-[#1E293B]">Aqeedah</h3>
                <p className="mt-1 text-lg text-[#556070]">
                  Learn core beliefs of Islam in a clear and structured way.
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/mind-upgrade/stories-of-the-prophets"
            className="block rounded-2xl border border-[#A7E2C8] bg-white/70 p-5 transition hover:bg-[#F2FBF6]"
          >
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-xl bg-[#BFE8D5] text-[#2F7D58] flex items-center justify-center">
                <ScrollText className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-3xl font-semibold text-[#1E293B]">Stories of the Prophets</h3>
                <p className="mt-1 text-lg text-[#556070]">
                  Explore prophetic stories and lessons for daily character.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
