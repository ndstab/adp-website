import type {MetadataRoute} from 'next';
import {routing} from '@/i18n/routing';
import {getIndustries, getSolutions} from '@/content';
import {insightSlugs} from '@/content/insights';
import {localePath, siteUrl} from '@/lib/seo';

const staticPaths = [
  '/',
  '/about',
  '/our-model',
  '/solutions',
  '/industries',
  '/vision-2030',
  '/compliance',
  '/insights',
  '/alliance',
  '/careers',
  '/contact',
  '/privacy',
  '/terms',
  '/cookies'
];

/** Every page in both languages, each entry listing its hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...getSolutions(routing.defaultLocale).map((s) => `/solutions/${s.slug}`),
    ...getIndustries(routing.defaultLocale).map((i) => `/industries/${i.slug}`),
    ...insightSlugs.map((slug) => `/insights/${slug}`)
  ];
  const lastModified = new Date();

  return paths.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${siteUrl}${localePath(locale, path)}`,
      lastModified,
      changeFrequency: path === '/' || path === '/insights' ? ('weekly' as const) : ('monthly' as const),
      priority: path === '/' ? 1 : path.split('/').length === 2 ? 0.8 : 0.6,
      alternates: {languages: Object.fromEntries(routing.locales.map((l) => [l, `${siteUrl}${localePath(l, path)}`]))}
    }))
  );
}
