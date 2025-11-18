/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // compiler: {
  //   removeConsole: {
  //     exclude: ['error', 'warn'],
  //   },
  // },

  experimental: {
    optimizePackageImports: [
      '@chakra-ui/react',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion',
      '@ant-design/react-slick',
    ],
    cssChunking: true,
  },

  images: {
    deviceSizes: [360, 414, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    qualities: [65, 70, 75, 80, 85, 90, 95, 100],
    minimumCacheTTL: 86400,
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/api/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
        pathname: '/api/**',
      },
    ],
  },

  webpack(config, { dev, isServer }) {
    // Suppress infrastructure logging
    config.infrastructureLogging = {
      level: 'error',
    };

    // Suppress localhost image warnings in development only
    if (dev && !isServer) {
      const originalWarn = console.warn;
      console.warn = (...args) => {
        if (
          typeof args[0] === 'string' &&
          args[0].includes('resolved to private ip')
        ) {
          return;
        }
        originalWarn.apply(console, args);
      };
    }

    // Target modern browsers for client-side bundles
    if (!isServer) {
      config.target = ['web', 'es2020'];
    }

    // Enhanced tree shaking
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: false,
      providedExports: true,
    };

    // Better chunk splitting for production
    if (!dev && !isServer) {
      const splitChunks = config.optimization.splitChunks || {};

      config.optimization.splitChunks = {
        ...splitChunks,
        chunks: 'all',
        maxSize: 244000,
        cacheGroups: {
          ...splitChunks.cacheGroups,
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 30,
            chunks: 'all',
          },
          ui: {
            test: /[\\/]node_modules[\\/](@chakra-ui|@emotion|framer-motion)[\\/]/,
            name: 'ui-libs',
            priority: 20,
            chunks: 'all',
          },
          slider: {
            test: /[\\/]node_modules[\\/](react-slick|slick-carousel)[\\/]/,
            name: 'slider',
            priority: 15,
            chunks: 'all',
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
            enforce: true,
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            chunks: 'all',
            reuseExistingChunk: true,
          },
        },
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
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*.css',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
