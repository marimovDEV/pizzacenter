/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '193.42.124.54',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'api.pizzacentergarden.uz',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'pizzacentergarden.uz',
        pathname: '/media/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    unoptimized: false,
    loader: 'default',
    domains: ['localhost', 'pizzacentr.uz', 'pizzacentergarden.uz', 'api.pizzacentergarden.uz'],
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  swcMinify: true,
  compress: true,
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

export default nextConfig
