import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { Poppins } from 'next/font/google';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { Providers } from '../(main)/providers';

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

import '../../globals.scss';

export default async function RegistrationLayout({
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
  const messages = await getMessages();

  return (
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
      <body className={poppins.className} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
