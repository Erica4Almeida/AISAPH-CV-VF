import type { NextConfig } from 'next'

const isDev = process.env.NODE_ENV === 'development'

const nextConfig: NextConfig = {
  output: 'standalone',
  devIndicators: false,
  allowedDevOrigins: ['*.trycloudflare.com'],
  images: {
    unoptimized: isDev,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.aisaph.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'api.aisaph-cv.com',
        pathname: '/uploads/**',
      },
    ],
  },
}

export default nextConfig
