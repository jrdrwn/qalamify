import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'via.placeholder.com',
      },
      {
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
