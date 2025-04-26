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
    "@mantine/dates",
  ],
  images: {
    domains: [
      "fljnffgnpjpfnzqnewxj.supabase.co",
      "via.placeholder.com",
      "images.unsplash.com",
    ],
  },
};

export default nextConfig;
