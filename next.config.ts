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
      {
        hostname: 'peach-labour-yak-496.mypinata.cloud',
      },
    ],
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding', 'pinata');
    return config;
  },
  // TODO: REMOVE THIS
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
