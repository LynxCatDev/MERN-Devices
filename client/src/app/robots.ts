import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const site =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://mern-devices.vercel.app';

  // Allow-list main pages (root + localized paths)
  const allow: string[] = [
    '/', // root
    '/en',
    '/ro',
    '/ru',

    // main sections without locale
    '/devices',
    '/devices/*',
    '/device/*',
    '/search',
    '/promotions',

    // localized main sections
    '/en/devices',
    '/en/devices/*',
    '/en/device/*',
    '/en/search',
    '/en/promotions',
    '/ro/devices',
    '/ro/devices/*',
    '/ro/device/*',
    '/ro/search',
    '/ro/promotions',
    '/ru/devices',
    '/ru/devices/*',
    '/ru/device/*',
    '/ru/search',
    '/ru/promotions',

    // static assets needed for rendering
    '/_next/static/*',
    '/_next/image*',
    '/images/*',
    '/media/*',
  ];

  const disallow: string[] = ['/api/*', '/admin/*', '/auth/*', '/user/*'];

  return {
    rules: [
      {
        userAgent: '*',
        allow,
        disallow,
      },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
