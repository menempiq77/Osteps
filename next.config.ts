import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import withBundleAnalyzer from "@next/bundle-analyzer";
import withSerwistInit from "@serwist/next";
import type { NextConfig } from "next";

const srcPath = `${__dirname}/src`;
const offlinePagePath = `${__dirname}/public/offline.html`;
const offlineRevision = createHash("sha256")
  .update(readFileSync(offlinePagePath))
  .digest("hex");

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  register: false,
  additionalPrecacheEntries: [
    { url: "/offline.html", revision: offlineRevision },
    { url: "/icons/osteps-192.png", revision: null },
    { url: "/icons/osteps-512.png", revision: null },
    { url: "/icons/osteps-maskable-512.png", revision: null },
    { url: "/icons/apple-touch-icon.png", revision: null },
  ],
  exclude: [/.*/],
});
const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  reactStrictMode: true,
  compress: process.env.NODE_ENV === 'production',
  productionBrowserSourceMaps: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  experimental: {
    // Work around intermittent dev manifest crashes on Next 15 + webpack.
    devtoolSegmentExplorer: false,
    browserDebugInfoInTerminal: false,
  },
  turbopack: {
    resolveAlias: {
      "@": srcPath,
    },
  },
  webpack: (config, { dev, isServer, webpack }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': srcPath,
    };

    if (dev) {
      // Filesystem cache can be flaky on Windows + OneDrive paths (missing chunk/module errors).
      config.cache = { type: 'memory' };
    }


    return config;
  },
  async headers() {
    // This deliberately permissive baseline keeps the current app working while
    // CSP violations are measured. Tighten each directive iteratively once all
    // inline Ant Design styles, Next runtime code, PDF workers, uploads, media,
    // and embedded viewers have been migrated or nonce-enabled. The app embeds
    // its own read-only pages, so same-origin framing remains allowed while
    // external clickjacking and exam-lockdown embedding remain blocked.
    const contentSecurityPolicy = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
      "style-src 'self' 'unsafe-inline' https:",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' https: wss:",
      "media-src 'self' blob: https:",
      "worker-src 'self' blob:",
      "frame-src 'self' https:",
      "frame-ancestors 'self'",
      "object-src 'self' blob:",
      "base-uri 'self'",
      "form-action 'self' https:",
    ].join("; ");
    const baseHeaders = [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
        ],
      },
    ];

    return baseHeaders;
  },
};

export default withSerwist(withAnalyzer({
  ...nextConfig,
  async headers() {
    const existingHeaders = await nextConfig.headers?.();

    return [
      ...(existingHeaders ?? []),
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
}));
