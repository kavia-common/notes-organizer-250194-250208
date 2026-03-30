import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The app needs runtime API calls + auth state; static export would break this.
};

export default nextConfig;
