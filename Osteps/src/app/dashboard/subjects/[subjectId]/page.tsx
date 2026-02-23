"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { FileTextOutlined, BarChartOutlined, EditOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function SubjectDetailPage() {
  const router = useRouter();
  const { subjectId } = useParams();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const studendId = currentUser?.studentClass;

  const cards = [
    { title: "Trackers", path: `/dashboard/trackers/${studendId}`, icon: <BarChartOutlined /> },
    { title: "Assessments", path: "/dashboard/students/assignments", icon: <EditOutlined /> },
    { title: "Worksheets", path: "/dashboard/shared_materials", icon: <FileTextOutlined /> },
  ];

  const handleNavigate = (path: string) => {
    router.push(`${path}`);
  };

  return (
    <div className="p-3 md:p-6 min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Subject Overview
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          Select a section below to explore trackers, assessments, or worksheets.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl">
        {cards.map((card) => (
          <div
            key={card.path}
            onClick={() => handleNavigate(card.path)}
            className="cursor-pointer bg-white text-gray-800 p-8 rounded-xl shadow-sm hover:shadow-md border border-gray-200 
                       hover:-translate-y-1 transform transition-all duration-200 flex flex-col items-center justify-center gap-4"
          >
            <div className="text-3xl text-primary">{card.icon}</div>
            <h2 className="text-lg font-medium">{card.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
