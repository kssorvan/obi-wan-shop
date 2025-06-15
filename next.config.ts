import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: 'www.hypershop.com',
        port: '',
        pathname: '/cdn/shop/files/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.4imprint.com',
        port: '',
        pathname: '/prod/**',
      },
      {
        protocol: 'https',
        hostname: 'i5.walmartimages.com',
        port: '',
        pathname: '/seo/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.thewirecutter.com',
        port: '',
        pathname: '/wp-content/media/**',
      },
      {
        protocol: 'https',
        hostname: 'www.yogikuti.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-img.poizonapp.com',
        port: '',
        pathname: '/pro-img/cut-img/**',
      },
      {
        protocol: 'https',
        hostname: 'premiumlevella.com',
        port: '',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
};

export default nextConfig;