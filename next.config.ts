import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
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
    { url: "/icons/osteps-192.png?v=20260714", revision: null },
    { url: "/icons/osteps-512.png?v=20260714", revision: null },
    { url: "/icons/osteps-maskable-512.png?v=20260714", revision: null },
    { url: "/icons/apple-touch-icon.png?v=20260714", revision: null },
  ],
  exclude: [/.*/],
});

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
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
        ],
      },
    ];

    return baseHeaders;
  },
};

export default withSerwist({
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
});
