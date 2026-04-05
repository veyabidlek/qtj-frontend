import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://165.22.216.205:8000";

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
    ];
  },
};

export default nextConfig;
