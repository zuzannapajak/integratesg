import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.11", "localhost", "127.0.0.1"],
  // The PDF generator opens font files at runtime, so include the selected WOFF
  // subsets in the Vercel serverless function output (not in the client bundle).
  outputFileTracingIncludes: {
    "/api/curriculum/**": [
      "./node_modules/@fontsource/noto-sans/files/noto-sans-*-400-normal.woff",
      "./node_modules/@fontsource/noto-sans/files/noto-sans-*-700-normal.woff",
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
