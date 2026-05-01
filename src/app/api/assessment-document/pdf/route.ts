import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_HOSTS = new Set([
  "dashboard.osteps.com",
  "osteps.com",
  "www.osteps.com",
  "localhost",
  "127.0.0.1",
]);

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ message: "File url is required" }, { status: 400 });
  }

  let sourceUrl: URL;
  try {
    sourceUrl = new URL(rawUrl);
  } catch {
    return NextResponse.json({ message: "Invalid file url" }, { status: 400 });
  }

  if (!ALLOWED_HOSTS.has(sourceUrl.hostname)) {
    return NextResponse.json({ message: "File host is not allowed" }, { status: 400 });
  }

  const upstream = await fetch(sourceUrl.toString(), {
    cache: "no-store",
    headers: {
      Accept: "application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/*,*/*",
    },
  });

  if (!upstream.ok) {
    return NextResponse.json(
      { message: "Could not load file" },
      { status: upstream.status }
    );
  }

  const body = await upstream.arrayBuffer();
  const contentType = upstream.headers.get("content-type") || "application/octet-stream";

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
