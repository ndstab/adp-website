import '../globals.css';
import type {Metadata, Viewport} from 'next';
import {notFound} from 'next/navigation';
import {Manrope, IBM_Plex_Sans_Arabic} from 'next/font/google';
import {hasLocale, NextIntlClientProvider} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {isRtl, routing} from '@/i18n/routing';
import {Header} from '@/components/layout/Header';
import {Footer} from '@/components/layout/Footer';
import {CookieConsent} from '@/components/layout/CookieConsent';
import {JsonLd} from '@/components/ui/JsonLd';
import {site} from '@/content';
import {isPlaceholder, reviewMode} from '@/lib/review';
import {ogImage, siteUrl} from '@/lib/seo';

const manrope = Manrope({subsets: ['latin'], variable: '--font-manrope', display: 'swap'});
// Regular and semibold only (Arabic medium renders as regular). Not preloaded: preloading it on every page (English
// included) delayed first paint on mobile; Arabic text paints in a fallback, then swaps.
const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '600'],
  variable: '--font-plex-arabic',
  display: 'swap',
  preload: false
});

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export const viewport: Viewport = {
  themeColor: '#F4F2EE'
};

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'common.meta'});
  return {
    metadataBase: new URL(siteUrl),
    title: {default: t('title'), template: `%s | ${t('siteName')}`},
    description: t('description'),
    applicationName: t('siteName'),
    openGraph: {siteName: t('siteName'), images: [ogImage]},
    // Keep the review build out of search results until launch.
    robots: reviewMode ? {index: false, follow: false} : {index: true, follow: true}
  };
}

/** Organization + local business entity shared by every page. */
function organizationSchema(locale: 'ar' | 'en') {
  const sameAs = Object.values(site.socials).filter((url) => !isPlaceholder(url));
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${siteUrl}/#organization`,
    name: site.brand,
    legalName: site.legalName[locale],
    alternateName: site.legalName[locale === 'ar' ? 'en' : 'ar'],
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/brand/adp-logo.png`,
    image: `${siteUrl}${ogImage.url}`,
    email: site.email,
    telephone: site.phone.e164,
    address: {'@type': 'PostalAddress', addressLocality: locale === 'ar' ? 'الرياض' : 'Riyadh', addressCountry: 'SA'},
    areaServed: [{'@type': 'Country', name: 'Saudi Arabia'}, {'@type': 'Place', name: 'Gulf Cooperation Council'}],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '09:00',
      closes: '18:00'
    },
    knowsLanguage: ['ar', 'en'],
    ...(sameAs.length ? {sameAs} : {})
  };
}

export default async function LocaleLayout({children, params}: {children: React.ReactNode; params: Promise<{locale: string}>}) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} dir={isRtl(locale) ? 'rtl' : 'ltr'} className={`${manrope.variable} ${plexArabic.variable}`} suppressHydrationWarning>
      <head>
        {/* Lets CSS hide not-yet-revealed sections only when JS will reveal them. */}
        <script dangerouslySetInnerHTML={{__html: "document.documentElement.classList.add('js')"}} />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <JsonLd data={organizationSchema(locale)} />
        <NextIntlClientProvider>
            <Header />
            <main id="main" tabIndex={-1} className="focus:outline-none">
              {children}
            </main>
            <Footer />
            <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
