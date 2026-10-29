import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  localePrefix: 'always',
  // Arabic first: "/" always lands on /ar regardless of browser language.
  localeDetection: false
});

export type Locale = (typeof routing.locales)[number];

export const isRtl = (locale: string) => locale === 'ar';
