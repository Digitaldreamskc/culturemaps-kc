/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Disable static page generation for dynamic routes
  output: 'standalone',
  experimental: {
    // This will ensure the app is built as a standalone application
    outputFileTracingRoot: undefined,
  },
};

module.exports = nextConfig; 