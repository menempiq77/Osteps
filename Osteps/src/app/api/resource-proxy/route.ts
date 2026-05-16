import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const HTML_RE = /text\/html|application\/xhtml\+xml/i;
const CSS_RE = /text\/css/i;
const PRIVATE_HOST_RE = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.|0\.|169\.254\.|::1$)/i;
const NON_PROXYABLE_URL_RE = /^(?:#|data:|blob:|javascript:|mailto:|tel:)/i;
const PROXY_PATH = "/api/resource-proxy";

const isSafeProxyUrl = (url: URL) => {
  if (!["http:", "https:"].includes(url.protocol)) return false;
  return !PRIVATE_HOST_RE.test(url.hostname);
};

const resolvePublicOrigin = (
  value: string | null | undefined,
  fallbackProtocol = "https"
) => {
  if (!value) return null;

  try {
    const normalized = value.includes("://")
      ? value
      : `${fallbackProtocol}://${value}`;
    const url = new URL(normalized);

    if (!["http:", "https:"].includes(url.protocol)) return null;
    if (PRIVATE_HOST_RE.test(url.hostname)) return null;

    return url.origin;
  } catch {
    return null;
  }
};

const getRequestOrigin = (request: NextRequest) => {
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const protocol = forwardedProto || request.nextUrl.protocol.replace(/:$/, "");
  const host = request.headers.get("host")?.split(",")[0]?.trim();

  return (
    resolvePublicOrigin(forwardedHost, protocol) ||
    resolvePublicOrigin(request.headers.get("origin"), protocol) ||
    resolvePublicOrigin(request.headers.get("referer"), protocol) ||
    resolvePublicOrigin(host, protocol) ||
    resolvePublicOrigin(request.nextUrl.origin, protocol) ||
    resolvePublicOrigin(process.env.NEXT_PUBLIC_APP_ORIGIN, protocol) ||
    resolvePublicOrigin(process.env.NEXT_PUBLIC_SITE_ORIGIN, protocol) ||
    (process.env.NODE_ENV === "production"
      ? "https://www.osteps.com"
      : request.nextUrl.origin)
  );
};

const getProxyUrl = (proxyOrigin: string, url: string) =>
  `${proxyOrigin}${PROXY_PATH}?url=${encodeURIComponent(url)}`;

const resolvePreviewUrl = (value: string, targetUrl: string) => {
  const trimmed = value.trim();
  if (!trimmed || NON_PROXYABLE_URL_RE.test(trimmed)) return null;

  try {
    const resolved = new URL(trimmed, targetUrl);
    if (!isSafeProxyUrl(resolved)) return null;
    return resolved;
  } catch {
    return null;
  }
};

const rewritePreviewUrl = (
  value: string,
  targetUrl: string,
  proxyOrigin: string
) => {
  const resolved = resolvePreviewUrl(value, targetUrl);
  if (!resolved) return value;

  const previewOrigin = new URL(targetUrl).origin;
  if (resolved.origin !== previewOrigin) {
    return resolved.toString();
  }

  return getProxyUrl(proxyOrigin, resolved.toString());
};

const rewriteSrcSet = (value: string, targetUrl: string, proxyOrigin: string) =>
  value
    .split(",")
    .map((part) => {
      const trimmed = part.trim();
      if (!trimmed) return part;

      const [urlPart, ...descriptors] = trimmed.split(/\s+/);
      const rewrittenUrl = rewritePreviewUrl(urlPart, targetUrl, proxyOrigin);
      return [rewrittenUrl, ...descriptors].join(" ");
    })
    .join(", ");

const rewriteCssUrls = (css: string, targetUrl: string, proxyOrigin: string) =>
  css
    .replace(
      /url\((["']?)([^)"']+)\1\)/gi,
      (_match, quote: string, value: string) =>
        `url(${quote}${rewritePreviewUrl(value, targetUrl, proxyOrigin)}${quote})`
    )
    .replace(
      /@import\s+(?:url\()?(["'])([^"']+)\1\)?/gi,
      (_match, quote: string, value: string) =>
        `@import ${quote}${rewritePreviewUrl(value, targetUrl, proxyOrigin)}${quote}`
    );

const rewriteInlineStyleBlocks = (
  html: string,
  targetUrl: string,
  proxyOrigin: string
) =>
  html.replace(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi, (_match, attributes, css) => {
    return `<style${attributes}>${rewriteCssUrls(css, targetUrl, proxyOrigin)}</style>`;
  });

const rewriteInlineScriptBaseUrls = (html: string, targetUrl: string) =>
  html.replace(/<script\b(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi, (_match, attributes, scriptBody) => {
    const rewrittenScript = scriptBody.replace(
      /((?:var|let|const)?\s*(?:rootDir|publicRoot|hostingDomain)\s*=\s*)(["'])([^"']+)\2/g,
      (_assignment, prefix: string, quote: string, value: string) => {
        const resolved = resolvePreviewUrl(value, targetUrl);
        const rewrittenValue = resolved ? resolved.toString() : value;
        return `${prefix}${quote}${rewrittenValue}${quote}`;
      }
    );

    return `<script${attributes}>${rewrittenScript}</script>`;
  });

const rewriteHtmlResourceUrls = (
  html: string,
  targetUrl: string,
  proxyOrigin: string
) =>
  html
    .replace(
      /\b(href|src|action|poster)=("|')([^"']*)\2/gi,
      (_match, attribute: string, quote: string, value: string) =>
        `${attribute}=${quote}${rewritePreviewUrl(
          value,
          targetUrl,
          proxyOrigin
        )}${quote}`
    )
    .replace(
      /\b(srcset|imagesrcset)=("|')([^"']*)\2/gi,
      (_match, attribute: string, quote: string, value: string) =>
        `${attribute}=${quote}${rewriteSrcSet(
          value,
          targetUrl,
          proxyOrigin
        )}${quote}`
    )
    .replace(
      /\bstyle=("|')([^"']*)\1/gi,
      (_match, quote: string, value: string) =>
        `style=${quote}${rewriteCssUrls(value, targetUrl, proxyOrigin)}${quote}`
    );

const buildClientRuntimeShim = (targetUrl: string, proxyOrigin: string) => {
  const targetOrigin = new URL(targetUrl).origin;

  return [
    "<script>",
    "(() => {",
    `  const TARGET_URL = ${JSON.stringify(targetUrl)};`,
    `  const TARGET_ORIGIN = ${JSON.stringify(targetOrigin)};`,
    `  const PROXY_ORIGIN = ${JSON.stringify(proxyOrigin)};`,
    `  const PROXY_PATH = ${JSON.stringify(PROXY_PATH)};`,
    "  const CURRENT_ORIGIN = window.location.origin;",
    "  const NON_PROXYABLE_RE = /^(?:#|data:|blob:|javascript:|mailto:|tel:)/i;",
    "",
    "  const rewriteAbsoluteTarget = (input) => {",
    "    if (input == null) return null;",
    "    const raw = String(input);",
    "    if (!raw || NON_PROXYABLE_RE.test(raw)) return null;",
    "    if (raw.startsWith(PROXY_PATH) || raw.startsWith(CURRENT_ORIGIN + PROXY_PATH)) return null;",
    "",
    "    let resolved;",
    "    try {",
    "      resolved = new URL(raw, TARGET_URL);",
    "    } catch {",
    "      return null;",
    "    }",
    "",
    "    if (!/^https?:$/.test(resolved.protocol)) return null;",
    "    if (resolved.origin === TARGET_ORIGIN) return resolved;",
    "",
    "    if (resolved.origin === CURRENT_ORIGIN && !resolved.pathname.startsWith(PROXY_PATH)) {",
    "      return new URL(resolved.pathname + resolved.search + resolved.hash, TARGET_ORIGIN);",
    "    }",
    "",
    "    return null;",
    "  };",
    "",
    "  const toProxyUrl = (input) => {",
    "    const rewritten = rewriteAbsoluteTarget(input);",
    "    return rewritten ? `${PROXY_ORIGIN}${PROXY_PATH}?url=${encodeURIComponent(rewritten.toString())}` : input;",
    "  };",
    "",
    "  const rewriteSrcSetValue = (value) =>",
    "    String(value)",
    "      .split(',')",
    "      .map((part) => {",
    "        const trimmed = part.trim();",
    "        if (!trimmed) return part;",
    "        const [urlPart, ...descriptors] = trimmed.split(/\\s+/);",
    "        return [toProxyUrl(urlPart), ...descriptors].join(' ');",
    "      })",
    "      .join(', ');",
    "",
    "  const rewriteAttributeValue = (attribute, value) => {",
    "    if (value == null) return value;",
    "",
    "    switch (String(attribute).toLowerCase()) {",
    "      case 'srcset':",
    "      case 'imagesrcset':",
    "        return rewriteSrcSetValue(value);",
    "      case 'src':",
    "      case 'href':",
    "      case 'action':",
    "      case 'poster':",
    "        return toProxyUrl(value);",
    "      default:",
    "        return value;",
    "    }",
    "  };",
    "",
    "  Element.prototype.setAttribute = ((original) => function setAttribute(name, value) {",
    "    return original.call(this, name, rewriteAttributeValue(name, value));",
    "  })(Element.prototype.setAttribute);",
    "",
    "  const patchProperty = (prototype, property, attribute = property) => {",
    "    if (!prototype) return;",
    "",
    "    const descriptor = Object.getOwnPropertyDescriptor(prototype, property);",
    "    if (!descriptor || typeof descriptor.set !== 'function') return;",
    "",
    "    Object.defineProperty(prototype, property, {",
    "      configurable: true,",
    "      enumerable: descriptor.enumerable ?? true,",
    "      get: descriptor.get ? function get() {",
    "        return descriptor.get.call(this);",
    "      } : undefined,",
    "      set: function set(value) {",
    "        return descriptor.set.call(this, rewriteAttributeValue(attribute, value));",
    "      },",
    "    });",
    "  };",
    "",
    "  patchProperty(HTMLAnchorElement?.prototype, 'href');",
    "  patchProperty(HTMLFormElement?.prototype, 'action');",
    "  patchProperty(HTMLIFrameElement?.prototype, 'src');",
    "  patchProperty(HTMLImageElement?.prototype, 'src');",
    "  patchProperty(HTMLImageElement?.prototype, 'srcset');",
    "  patchProperty(HTMLLinkElement?.prototype, 'href');",
    "  patchProperty(HTMLScriptElement?.prototype, 'src');",
    "  patchProperty(HTMLSourceElement?.prototype, 'src');",
    "  patchProperty(HTMLSourceElement?.prototype, 'srcset');",
    "  patchProperty(HTMLVideoElement?.prototype, 'poster');",
    "",
    "  const patchInsertion = (prototype, methodName) => {",
    "    if (!prototype || typeof prototype[methodName] !== 'function') return;",
    "",
    "    const original = prototype[methodName];",
    "    prototype[methodName] = function patchedNodeInsertion(node, ...rest) {",
    "      if (node instanceof Element) {",
    "        rewriteTree(node);",
    "      }",
    "",
    "      return original.call(this, node, ...rest);",
    "    };",
    "  };",
    "",
    "  patchInsertion(Node.prototype, 'appendChild');",
    "  patchInsertion(Node.prototype, 'insertBefore');",
    "  patchInsertion(Node.prototype, 'replaceChild');",
    "",
    "  const rewriteElement = (element) => {",
    "    if (!(element instanceof Element)) return;",
    "",
    "    ['src', 'href', 'action', 'poster'].forEach((attribute) => {",
    "      const value = element.getAttribute(attribute);",
    "      if (!value) return;",
    "      const rewritten = rewriteAttributeValue(attribute, value);",
    "      if (typeof rewritten === 'string' && rewritten !== value) {",
    "        element.setAttribute(attribute, rewritten);",
    "      }",
    "    });",
    "",
    "    ['srcset', 'imagesrcset'].forEach((attribute) => {",
    "      const value = element.getAttribute(attribute);",
    "      if (!value) return;",
    "      const rewritten = rewriteAttributeValue(attribute, value);",
    "      if (rewritten !== value) {",
    "        element.setAttribute(attribute, rewritten);",
    "      }",
    "    });",
    "  };",
    "",
    "  const rewriteTree = (root) => {",
    "    if (!(root instanceof Element)) return;",
    "    rewriteElement(root);",
    "    root.querySelectorAll('[src], [href], [action], [poster], [srcset], [imagesrcset]').forEach(rewriteElement);",
    "  };",
    "",
    "  history.pushState = ((original) => function pushState(state, title, url) {",
    "    if (typeof url === 'string' && url) {",
    "      return original.call(this, state, title, toProxyUrl(url));",
    "    }",
    "    return original.call(this, state, title, url);",
    "  })(history.pushState.bind(history));",
    "",
    "  history.replaceState = ((original) => function replaceState(state, title, url) {",
    "    if (typeof url === 'string' && url) {",
    "      return original.call(this, state, title, toProxyUrl(url));",
    "    }",
    "    return original.call(this, state, title, url);",
    "  })(history.replaceState.bind(history));",
    "",
    "  const originalFetch = window.fetch.bind(window);",
    "  window.fetch = (input, init) => {",
    "    if (typeof input === 'string') {",
    "      return originalFetch(toProxyUrl(input), init);",
    "    }",
    "",
    "    if (input instanceof Request) {",
    "      const rewrittenUrl = toProxyUrl(input.url);",
    "      if (typeof rewrittenUrl === 'string' && rewrittenUrl !== input.url) {",
    "        return originalFetch(new Request(rewrittenUrl, input), init);",
    "      }",
    "    }",
    "",
    "    return originalFetch(input, init);",
    "  };",
    "",
    "  XMLHttpRequest.prototype.open = ((original) => function open(method, url, ...rest) {",
    "    return original.call(this, method, typeof url === 'string' ? toProxyUrl(url) : url, ...rest);",
    "  })(XMLHttpRequest.prototype.open);",
    "",
    "  window.open = ((original) => function open(url, target, features) {",
    "    return original.call(window, typeof url === 'string' ? toProxyUrl(url) : url, target, features);",
    "  })(window.open.bind(window));",
    "",
    "  if (document.documentElement) {",
    "    rewriteTree(document.documentElement);",
    "",
    "    const observer = new MutationObserver((mutations) => {",
    "      mutations.forEach((mutation) => {",
    "        if (mutation.type === 'attributes' && mutation.target instanceof Element) {",
    "          rewriteElement(mutation.target);",
    "        }",
    "",
    "        mutation.addedNodes.forEach((node) => {",
    "          if (node instanceof Element) {",
    "            rewriteTree(node);",
    "          }",
    "        });",
    "      });",
    "    });",
    "",
    "    observer.observe(document.documentElement, {",
    "      subtree: true,",
    "      childList: true,",
    "      attributes: true,",
    "      attributeFilter: ['src', 'href', 'action', 'poster', 'srcset', 'imagesrcset'],",
    "    });",
    "  }",
    "})();",
    "</script>",
  ].join("\n");
};

const injectPreviewHead = (html: string, targetUrl: string, proxyOrigin: string) => {
  const withoutFrameBlockingMeta = html.replace(
    /<meta\s+[^>]*http-equiv=["']Content-Security-Policy["'][^>]*>/gi,
    ""
  );
  const injection = `${buildClientRuntimeShim(
    targetUrl,
    proxyOrigin
  )}<base href="${targetUrl}"><meta name="referrer" content="no-referrer-when-downgrade">`;

  if (/<head[^>]*>/i.test(withoutFrameBlockingMeta)) {
    return withoutFrameBlockingMeta.replace(/<head([^>]*)>/i, `<head$1>${injection}`);
  }

  return `${injection}${withoutFrameBlockingMeta}`;
};

const preparePreviewHtml = (html: string, targetUrl: string, proxyOrigin: string) =>
  injectPreviewHead(
    rewriteInlineScriptBaseUrls(
      rewriteInlineStyleBlocks(
        rewriteHtmlResourceUrls(html, targetUrl, proxyOrigin),
        targetUrl,
        proxyOrigin
      ),
      targetUrl,
      
    ),
    targetUrl,
    proxyOrigin
  );

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url") || "";
  const proxyOrigin = getRequestOrigin(request);

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

    const contentType =
      upstream.headers.get("content-type") || "text/html; charset=utf-8";
    const previewTargetUrl = upstream.url || targetUrl.toString();

    if (HTML_RE.test(contentType)) {
      const html = await upstream.text();
      return new NextResponse(
        preparePreviewHtml(html, previewTargetUrl, proxyOrigin),
        {
          status: upstream.status,
          headers: {
            "content-type": contentType,
            "cache-control": "no-store",
          },
        }
      );
    }

    if (CSS_RE.test(contentType)) {
      const css = await upstream.text();
      return new NextResponse(rewriteCssUrls(css, previewTargetUrl, proxyOrigin), {
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
    return NextResponse.json({ error: "Website preview failed" }, { status: 502 });
  }
}