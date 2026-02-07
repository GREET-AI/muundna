import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/ueber-uns/geschichte', destination: '/ueber-uns#geschichte', permanent: true },
      { source: '/ueber-uns/standort', destination: '/ueber-uns#standort', permanent: true },
      { source: '/ueber-uns/kompetenz', destination: '/ueber-uns#kompetenz', permanent: true },
      { source: '/zielgruppen/hoch-tiefbau', destination: '/zielgruppen/bauunternehmen', permanent: true },
      { source: '/zielgruppen/dachdecker-zimmermaenner', destination: '/zielgruppen/dachdecker-zimmerleute', permanent: true },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : 'placeholder.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
