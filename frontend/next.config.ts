import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ['*.trycloudflare.com'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.aisaph.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],
  },
}

export default nextConfig