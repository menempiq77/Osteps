"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Breadcrumb } from "antd";
import ClassStoryPanel from "@/components/dashboard/ClassStoryPanel";

export default function ClassStoryPage() {
  const { classId } = useParams<{ classId: string }>();

  return (
    <div className="min-h-screen bg-[#f5f7fd] p-3 md:p-6">
      <Breadcrumb
        items={[
          { title: <Link href="/dashboard">Dashboard</Link> },
          { title: <Link href="/dashboard/classes">Classes</Link> },
          { title: <span>Class Story</span> },
        ]}
        className="!mb-3"
      />
      <ClassStoryPanel classId={classId} />
    </div>
  );
}
