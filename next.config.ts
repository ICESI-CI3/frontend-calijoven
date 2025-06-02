/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://34.139.3.80:4000',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.cali.gov.co',
      },
    ],
  },
};

export default nextConfig;
