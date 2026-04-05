import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/ws/:path*",
        destination: `${BACKEND_URL}/ws/:path*`,
      },
      {
        source: "/backend/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
