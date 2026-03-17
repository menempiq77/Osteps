"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubjectClassesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/subject-cards");
  }, [router]);

  return null;
}
