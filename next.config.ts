
import type {NextConfig} from 'next';

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  swSrc: 'src/service-worker.ts', // Specify the custom service worker file
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'zenbabafurniture.com',
        port: '',
        pathname: '/**',
      },
      // Removed firebasestorage.googleapis.com if it was solely for category images
      // Data URIs do not need a remote pattern.
    ],
    // Allow data URIs for next/image
    dangerouslyAllowSVG: true, // While not directly for data URIs, often related to flexible src types
    contentSecurityPolicy: "default-src 'self'; img-src * data: blob:; script-src 'unsafe-eval' 'unsafe-inline' *;",
  },
};

export default withPWA(nextConfig);
