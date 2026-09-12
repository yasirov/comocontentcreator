import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    // Next.js's on-the-fly image optimizer is unreliable on Cloudflare
    // Workers (large widths fail outright), and it isn't needed here:
    // Sanity URLs already carry width/quality/auto-format parameters (see
    // lib/sanity/queries.ts) and the local files under /public/images are
    // pre-sized. Serving them as-is removes a whole failure mode.
    unoptimized: true,
  },
};

export default nextConfig;
