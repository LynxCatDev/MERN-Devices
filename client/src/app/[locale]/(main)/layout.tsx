import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import NextTopLoader from 'nextjs-toploader';
import CacheProvider from 'react-inlinesvg/provider';
import { Footer, Header } from '@/components';
import { Providers } from './providers';
import { routing } from '@/i18n/routing';

import '../../globals.scss';

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
            <body className="night">
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
