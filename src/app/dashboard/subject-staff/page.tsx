"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

export default function SubjectStaffRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/teachers");
  }, [router]);

  return (
    <div className="p-3 md:p-6 flex min-h-[40vh] items-center justify-center">
      <Spin size="large" />
    </div>
  );
}
