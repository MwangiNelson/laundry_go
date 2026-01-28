import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ddgisdbosreojahfjhtd.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Suppress source map warnings from dependencies
    config.ignoreWarnings = [
      { module: /node_modules/ },
      (warning: { message: string }) =>
        warning.message.includes("Invalid source map") ||
        warning.message.includes("sourceMapURL could not be parsed"),
    ];
    return config;
  },
};

export default nextConfig;
