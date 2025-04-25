import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  transpilePackages: [
    "@mantine/core",
    "@mantine/hooks",
    "@mantine/form",
    "@mantine/notifications",
  ],
};

export default nextConfig;
