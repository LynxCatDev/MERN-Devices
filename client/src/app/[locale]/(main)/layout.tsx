import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { Poppins } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import CacheProvider from 'react-inlinesvg/provider';
import { Footer, Header } from '@/components';
import { Toaster } from '@/components/Toaster/Toaster';
import { Providers } from './providers';
import { routing } from '@/i18n/routing';

import '../../globals.scss';

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'optional',
  preload: true,
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
      <html lang={locale} suppressHydrationWarning>
        <head>
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
              {/* Mount global toaster once */}
              <Toaster />
            </body>
          </Providers>
        </NextIntlClientProvider>
      </html>
    </CacheProvider>
  );
}
