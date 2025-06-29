import { Footer, Header } from '@/components';
import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import NextTopLoader from 'nextjs-toploader';
import CacheProvider from 'react-inlinesvg/provider';
import { Providers } from './providers';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
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
        <link rel="icon" type="image/x-icon" href="/images/play.png" />
        <NextIntlClientProvider locale={locale}>
          <body className="night">
            <NextTopLoader showSpinner={false} height={4} />
            <Header />
            <Providers>{children}</Providers>
            <Footer />
          </body>
        </NextIntlClientProvider>
      </html>
    </CacheProvider>
  );
}
