import type {ComponentType} from 'react';
import {z} from 'zod';
import type {Locale} from '@/i18n/routing';

export const insightSlugs = [
  'from-ai-pilot-to-production-in-ksa',
  'nca-private-sector-controls',
  'funding-ai-from-it-savings',
  'phone-camera-leak-risk'
] as const;

const InsightMeta = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  readMinutes: z.number().int().positive(),
  image: z.string().startsWith('/images/'),
  imageAlt: z.string().min(1)
});
export type InsightMeta = z.infer<typeof InsightMeta> & {slug: string};

async function load(locale: Locale, slug: string) {
  const mod = (await import(`@content/insights/${locale}/${slug}.mdx`)) as {default: ComponentType; metadata: unknown};
  return {Post: mod.default, meta: {...InsightMeta.parse(mod.metadata), slug}};
}

export async function getInsight(locale: Locale, slug: string) {
  if (!(insightSlugs as readonly string[]).includes(slug)) return null;
  return load(locale, slug);
}

/** Newest first. Every insight is a draft until reviewed. */
export async function getInsights(locale: Locale) {
  const all = await Promise.all(insightSlugs.map((slug) => load(locale, slug)));
  return all.map((i) => i.meta).sort((a, b) => b.date.localeCompare(a.date));
}
