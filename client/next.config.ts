import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'sgp.cloud.appwrite.io' },
      { protocol: 'https', hostname: 'cloud.appwrite.io' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'http', hostname: 'localhost', port: '5005' },
      { protocol: 'http', hostname: '127.0.0.1', port: '5005' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
      { protocol: 'https', hostname: 'localhost' },
      { protocol: 'https', hostname: '127.0.0.1' }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/pincode/:pincode',
        destination: 'https://api.postalpincode.in/pincode/:pincode',
      },
      {
        source: '/api/postoffice/:name',
        destination: 'https://api.postalpincode.in/postoffice/:name',
      },
    ];
  },
};

export default nextConfig;
