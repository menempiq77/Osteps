import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors
  },
};

export default nextConfig;
