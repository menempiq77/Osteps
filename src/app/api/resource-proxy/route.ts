import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const HTML_RE = /text\/html|application\/xhtml\+xml/i;
const PRIVATE_HOST_RE = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|0\.|169\.254\.|::1$)/i;

const isSafeProxyUrl = (url: URL) => {
  if (!["http:", "https:"].includes(url.protocol)) return false;
  return !PRIVATE_HOST_RE.test(url.hostname);
};

const absolutizeRootRelativeValue = (value: string, targetUrl: string) => {
  if (!value.startsWith("/") || value.startsWith("//")) return value;
  return new URL(value, targetUrl).toString();
};

const absolutizeSrcSet = (value: string, targetUrl: string) =>
  value
    .split(",")
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return part;

      const [urlPart, ...descriptors] = trimmed.split(/\s+/);
      const absoluteUrl = absolutizeRootRelativeValue(urlPart, targetUrl);
      return [absoluteUrl, ...descriptors].join(" ");
    })
    .join(", ");

const rewriteRootRelativeUrls = (html: string, targetUrl: string) =>
  html
    .replace(
      /\b(href|src|action|poster)=(["'])\/(?!\/)([^"']*)\2/gi,
      (_match, attribute: string, quote: string, path: string) =>
        `${attribute}=${quote}${new URL(`/${path}`, targetUrl).toString()}${quote}`
    )
    .replace(
      /\b(srcset|imagesrcset)=(["'])([^"']*)\2/gi,
      (_match, attribute: string, quote: string, value: string) =>
        `${attribute}=${quote}${absolutizeSrcSet(value, targetUrl)}${quote}`
    )
    .replace(
      /url\((["']?)\/(?!\/)([^)"']+)\1\)/gi,
      (_match, quote: string, path: string) =>
        `url(${quote}${new URL(`/${path}`, targetUrl).toString()}${quote})`
    );

const injectPreviewBase = (html: string, targetUrl: string) => {
  const withoutFrameBlockingMeta = html.replace(
    /<meta\s+[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi,
    ""
  );
  const injection = `<base href="${targetUrl}"><meta name="referrer" content="no-referrer-when-downgrade">`;

  if (/<head[^>]*>/i.test(withoutFrameBlockingMeta)) {
    return withoutFrameBlockingMeta.replace(/<head([^>]*)>/i, `<head$1>${injection}`);
  }

  return `${injection}${withoutFrameBlockingMeta}`;
};

const preparePreviewHtml = (html: string, targetUrl: string) =>
  injectPreviewBase(rewriteRootRelativeUrls(html, targetUrl), targetUrl);

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url") || "";

  let targetUrl: URL;
  try {
    targetUrl = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!isSafeProxyUrl(targetUrl)) {
    return NextResponse.json({ error: "URL cannot be previewed" }, { status: 400 });
  }

  try {
    const upstream = await fetch(targetUrl.toString(), {
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const contentType = upstream.headers.get("content-type") || "text/html; charset=utf-8";

    if (HTML_RE.test(contentType)) {
      const html = await upstream.text();
      const previewTargetUrl = upstream.url || targetUrl.toString();
      return new NextResponse(preparePreviewHtml(html, previewTargetUrl), {
        status: upstream.status,
        headers: {
          "content-type": contentType,
          "cache-control": "no-store",
        },
      });
    }

    const body = await upstream.arrayBuffer();
    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        "content-type": contentType,
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    console.error("Resource proxy failed:", error);
    return NextResponse.json(
      { error: "Website preview failed" },
      { status: 502 }
    );
  }
}