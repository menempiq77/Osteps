import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const PRIVATE_HOST_RE = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|0\.|169\.254\.|::1$)/i;

const isSafeUrl = (url: URL) => {
  if (!["http:", "https:"].includes(url.protocol)) return false;
  return !PRIVATE_HOST_RE.test(url.hostname);
};

const absolutize = (value: string | null, base: string): string | null => {
  if (!value) return null;
  try {
    return new URL(value, base).toString();
  } catch {
    return null;
  }
};

const metaContent = (html: string, patterns: RegExp[]): string | null => {
  for (const re of patterns) {
    const match = html.match(re);
    if (match?.[1]) return match[1].trim();
  }
  return null;
};

// Fetch a web page and pull out a usable preview image, favicon, title and
// description so the caller can use them as a thumbnail without manual copying.
export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url") || "";

  let targetUrl: URL;
  try {
    targetUrl = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  if (!isSafeUrl(targetUrl)) {
    return NextResponse.json({ error: "URL not allowed" }, { status: 400 });
  }

  const origin = targetUrl.origin;
  const faviconFallback = `https://www.google.com/s2/favicons?domain=${targetUrl.hostname}&sz=128`;

  try {
    const upstream = await fetch(targetUrl.toString(), {
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const finalUrl = upstream.url || targetUrl.toString();
    const contentType = upstream.headers.get("content-type") || "";

    if (!/text\/html|application\/xhtml/i.test(contentType)) {
      return NextResponse.json({
        image: null,
        favicon: faviconFallback,
        title: targetUrl.hostname,
        description: null,
      });
    }

    const html = (await upstream.text()).slice(0, 600000);

    const image =
      absolutize(
        metaContent(html, [
          /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
          /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image:secure_url["']/i,
          /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
          /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
          /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
          /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
          /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i,
        ]),
        finalUrl
      ) || null;

    const favicon =
      absolutize(
        metaContent(html, [
          /<link[^>]+rel=["'][^"']*apple-touch-icon[^"']*["'][^>]+href=["']([^"']+)["']/i,
          /<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["']/i,
        ]),
        finalUrl
      ) || faviconFallback;

    const title =
      metaContent(html, [
        /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i,
        /<title[^>]*>([^<]+)<\/title>/i,
      ]) || targetUrl.hostname;

    const description =
      metaContent(html, [
        /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i,
      ]) || null;

    return NextResponse.json(
      { image, favicon, title, description, origin },
      { headers: { "cache-control": "public, max-age=86400" } }
    );
  } catch {
    return NextResponse.json({
      image: null,
      favicon: faviconFallback,
      title: targetUrl.hostname,
      description: null,
    });
  }
}
