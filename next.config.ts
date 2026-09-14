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

  // Long-lived caching for the static files under /public. Cloudflare's asset
  // handler is what actually serves them (see public/_headers, which is the
  // authoritative copy); this keeps `next start` and any non-Cloudflare
  // preview consistent with production.
  async headers() {
    const immutable = [
      { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    ];
    return [
      { source: "/videos/:path*", headers: immutable },
      { source: "/images/:path*", headers: immutable },
    ];
  },
};

export default nextConfig;
