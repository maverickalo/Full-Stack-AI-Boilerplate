import type { NextConfig } from 'next';
import * as path from 'path';

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../'),

  // NEEDED TO ALLOW NEXT TO NOT BLOCK EXTERNAL IMAGES
  // FOR WHEN USING NEXT IMAGE
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oaidalleapiprodscus.blob.core.windows.net',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
      },
    ],
  },

  // ALIAS
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles'), path.join(__dirname, '.')],
  },

  // ALIAS
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/types': path.resolve(__dirname, 'src/types'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/store': path.resolve(__dirname, 'src/store'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/styles': path.resolve(__dirname, 'src/styles'),
    };
    return config;
  },
};

export default nextConfig;
