import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.11", "localhost", "127.0.0.1"],
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
