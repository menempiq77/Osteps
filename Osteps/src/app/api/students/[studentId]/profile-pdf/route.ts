import { NextRequest, NextResponse } from "next/server";
import { createSimplePdf } from "@/lib/server/simplePdf";

type Ctx = { params: Promise<{ studentId: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const { studentId } = await ctx.params;
  const body = await req.json().catch(() => ({}));

  const studentName = String(body?.studentName ?? `Student ${studentId}`);
  const email = String(body?.email ?? "N/A");
  const className = String(body?.className ?? "N/A");
  const status = String(body?.status ?? "unknown");
  const completed = String(body?.completedTasks ?? "0");
  const total = String(body?.totalTasks ?? "0");
  const behaviorPoints = String(body?.behaviorPoints ?? "0");
  const attendanceTotal = String(body?.attendanceTotal ?? "0");
  const attendancePresent = String(body?.attendancePresent ?? "0");
  const attendanceAbsent = String(body?.attendanceAbsent ?? "0");

  const lines = [
    `Student ID: ${studentId}`,
    `Name: ${studentName}`,
    `Email: ${email}`,
    `Class: ${className}`,
    `Status: ${status}`,
    `Tasks Completed: ${completed}/${total}`,
    `Behavior Points: ${behaviorPoints}`,
    `Attendance Total: ${attendanceTotal}`,
    `Attendance Present: ${attendancePresent}`,
    `Attendance Absent: ${attendanceAbsent}`,
    "",
    `Generated: ${new Date().toISOString()}`,
  ];

  const pdf = createSimplePdf(`Student Profile Report - ${studentName}`, lines);
  return new NextResponse(pdf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=\"student-${studentId}-profile.pdf\"`,
      "Cache-Control": "no-store",
    },
  });
}

