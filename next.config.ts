import type { NextConfig } from "next";

// @ts-ignore
import withPWA from "next-pwa";

const nextConfig: NextConfig = {};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
})(nextConfig);