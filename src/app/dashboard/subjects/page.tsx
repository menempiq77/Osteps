"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubjectsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/manager");
  }, [router]);

  return <div className="p-3 md:p-6" />;
}
