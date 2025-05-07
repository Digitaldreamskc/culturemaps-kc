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
  // Configure for client-side rendering
  output: 'standalone',
  experimental: {
    // This will ensure the app is built as a standalone application
    outputFileTracingRoot: undefined,
  },
  // Add trailing slashes to prevent 404s
  trailingSlash: true,
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  // Enable both app and pages directories
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig; 