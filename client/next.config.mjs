/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  reactStrictMode: false,
  images: {
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
        pathname: '/**',
      },
    ],
  },
  webpack(config, { isServer }) {
    config.infrastructureLogging = {
      level: 'error', // Only show errors, not warnings/info
    };
    return config;
  },
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: '**', // Allows all HTTPS domains
  //     },
  //     {
  //       protocol: 'http',
  //       hostname: '**', // Allows all HTTP domains
  //     },
  //   ],
  // },
};

export default withNextIntl(nextConfig);
