import type {Metadata} from 'next';
import {routing, type Locale} from '@/i18n/routing';

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://adpway.com').replace(/\/$/, '');
export const ogImage = {url: '/og/adp-og.png', width: 1200, height: 630, alt: 'ADP Solutions'};

/** "/" → "/ar", "/about" → "/ar/about" */
export const localePath = (locale: Locale, path: string) => `/${locale}${path === '/' ? '' : path}`;

type Input = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  type?: 'website' | 'article';
  image?: string;
  /** Home page title already contains the brand, so it bypasses the "%s | ADP Solutions" template. */
  absoluteTitle?: boolean;
};

/** Canonical URL, hreflang alternates (ar, en, x-default → ar), Open Graph and Twitter cards. */
export function pageMetadata({locale, path, title, description, type = 'website', image, absoluteTitle}: Input): Metadata {
  const languages: Record<string, string> = Object.fromEntries(routing.locales.map((l) => [l, localePath(l, path)]));
  languages['x-default'] = localePath(routing.defaultLocale, path);
  const images = [image ? {url: image, width: 1200, height: 630, alt: title} : ogImage];

  return {
    title: absoluteTitle ? {absolute: title} : title,
    description,
    alternates: {canonical: localePath(locale, path), languages},
    openGraph: {
      type,
      url: localePath(locale, path),
      title,
      description,
      siteName: 'ADP Solutions',
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      alternateLocale: locale === 'ar' ? ['en_US'] : ['ar_SA'],
      images
    },
    twitter: {card: 'summary_large_image', title, description, images: images.map((i) => i.url)}
  };
}
