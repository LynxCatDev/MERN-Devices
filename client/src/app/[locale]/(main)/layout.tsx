import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { Poppins } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import CacheProvider from 'react-inlinesvg/provider';
import { Footer, Header } from '@/components';
import { Providers } from './providers';
import { routing } from '@/i18n/routing';

import '../../globals.scss';

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Arial',
    'sans-serif',
  ],
  adjustFontFallback: true,
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'TechnoHeart',
  description: 'Best devices you can find',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <CacheProvider>
      <html lang={locale}>
        <head>
          {/* Critical resource hints to break dependency chains */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
          <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
          {/* Preload critical images to break image loading chain */}

          <link rel="icon" type="image/x-icon" href="/images/play.png" />

          {process.env.NEXT_PUBLIC_API_BASE_URL && (
            <>
              <link
                rel="dns-prefetch"
                href={process.env.NEXT_PUBLIC_API_BASE_URL}
              />
              <link
                rel="preconnect"
                href={process.env.NEXT_PUBLIC_API_BASE_URL}
                crossOrigin=""
              />
            </>
          )}
        </head>
        <NextIntlClientProvider>
          <Providers>
            <body className={`night ${poppins.className}`}>
              <NextTopLoader showSpinner={false} height={4} />
              <Header />
              <div className="main--wrapper">{children}</div>
              <Footer />
            </body>
          </Providers>
        </NextIntlClientProvider>
      </html>
    </CacheProvider>
  );
}
