/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'api.mapbox.com'],
  },
  // Configure for client-side rendering
  output: 'standalone',
  experimental: {
    // This will ensure the app is built as a standalone application
    outputFileTracingRoot: undefined,
    optimizeCss: true,
    optimizeFonts: true,
  },
  // Add trailing slashes to prevent 404s
  trailingSlash: true,
  // Configure page extensions
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  webpack: (config, { dev, isServer }) => {
    // Optimize CSS loading
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        test: /\.(css|scss)$/,
        chunks: 'all',
        enforce: true,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/css/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/css',
          },
        ],
      },
      {
        source: '/_next/static/media/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'font/woff2',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  // Disable static page generation for error pages
  async generateStaticParams() {
    return {
      exclude: ['/404', '/500', '/_error'],
    };
  },
  // Optimize font loading
  optimizeFonts: true,
};

module.exports = nextConfig; 