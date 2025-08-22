import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }];
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v3.fal.media',
        port: '',
        pathname: '/files/**',
      },
    ],
  },
};

export default nextConfig;
