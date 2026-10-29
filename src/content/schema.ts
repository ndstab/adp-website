import {z} from 'zod';

export const pillarIds = [
  'core-infrastructure',
  'intelligence',
  'efficiency-operations',
  'trust-security',
  'smart-infrastructure'
] as const;
export type PillarId = (typeof pillarIds)[number];

export const pillarIcons = ['server', 'cpu', 'cloud', 'shield', 'drone'] as const;

export const Pillar = z.object({
  id: z.enum(pillarIds),
  order: z.number().int(),
  orbitOrder: z.number().int(),
  icon: z.enum(pillarIcons),
  name: z.string().min(1),
  /** One or two words, for tight spaces such as icon tiles. */
  label: z.string().min(1),
  short: z.string().min(1),
  outcome: z.object({label: z.string().min(1), verify: z.boolean()})
});
export type Pillar = z.infer<typeof Pillar>;

// Summary fields only; Phase 3 extends this with the full solution-page template.
export const Solution = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  pillar: z.enum(pillarIds),
  order: z.number().int(),
  code: z.string(),
  title: z.string().min(1),
  summary: z.string().min(1)
});
export type Solution = z.infer<typeof Solution>;

export const Industry = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number().int(),
  name: z.string().min(1),
  summary: z.string().min(1),
  image: z.string().startsWith('/images/'),
  imageAlt: z.string().min(1)
});
export type Industry = z.infer<typeof Industry>;

export const FaqGroup = z.object({
  id: z.string(),
  label: z.string(),
  items: z.array(z.object({q: z.string().min(1), a: z.string().min(1)})).min(1)
});
export type FaqGroup = z.infer<typeof FaqGroup>;

export const Source = z.object({
  id: z.string(),
  publisher: z.string(),
  title: z.string(),
  year: z.number().int().nullable(),
  url: z.string().url().nullable(),
  verify: z.boolean(),
  label: z.object({en: z.string(), ar: z.string()})
});
export type Source = z.infer<typeof Source>;

const Localized = z.object({en: z.string(), ar: z.string()});
export const Site = z.object({
  brand: z.string(),
  legalName: Localized,
  domain: z.string(),
  url: z.string().url(),
  phone: z.object({display: z.string(), e164: z.string(), whatsapp: z.string()}),
  email: z.string().email(),
  city: Localized,
  hours: Localized,
  cr: z.string(),
  vat: z.string(),
  nationalAddress: z.string(),
  socials: z.object({linkedin: z.string(), x: z.string(), instagram: z.string()})
});
export type Site = z.infer<typeof Site>;

const Item = z.object({title: z.string().min(1), body: z.string().min(1)});
const Hero = z.object({eyebrow: z.string().min(1), title1: z.string().min(1), title2: z.string().min(1), subtitle: z.string().min(1)});
const Vision = z.object({
  body: z.string().min(1),
  // Vision Realization Programs; every mapping is pending verification.
  programs: z.array(z.string().min(1)).min(1)
});
const Seo = z.object({title: z.string().min(1).max(70), description: z.string().min(50).max(170)});

export const industrySlugs = [
  'government',
  'bfsi',
  'energy-utilities',
  'telecom',
  'healthcare',
  'giga-projects-construction',
  'retail-hospitality',
  'education'
] as const;

/** Full solution page. Section order is fixed by the page template. */
export const SolutionDetail = z.object({
  slug: z.string(),
  hero: Hero,
  challenge: z.object({title: z.string().min(1), body: z.string().min(1), points: z.array(z.string().min(1)).min(3).max(5)}),
  opportunity: z.object({title: z.string().min(1), body: z.string().min(1), sources: z.array(z.string()).default([])}),
  capabilities: z.array(Item).min(4).max(8),
  applications: z.array(Item).min(4).max(6),
  // Always presented as "typical" and flagged for verification.
  outcomes: z.array(z.object({value: z.string().min(1), label: z.string().min(1)})).max(4),
  sectors: z.array(z.enum(industrySlugs)).min(1),
  vision2030: Vision,
  deployment: z.object({cloud: z.boolean(), inKingdom: z.boolean(), onPrem: z.boolean(), note: z.string().min(1)}),
  extras: z
    .array(z.object({title: z.string().min(1), items: z.array(z.string().min(1)).min(2), verify: z.boolean().default(false)}))
    .max(3)
    .default([]),
  seo: Seo
});
export type SolutionDetail = z.infer<typeof SolutionDetail>;

export const IndustryDetail = z.object({
  slug: z.enum(industrySlugs),
  hero: Hero,
  context: z.object({title: z.string().min(1), body: z.string().min(1)}),
  challenges: z.array(Item).min(3).max(4),
  useCases: z.array(Item).min(3).max(4),
  solutions: z.array(z.string()).min(3).max(6),
  regulation: z.array(z.string().min(1)).min(1),
  vision2030: Vision,
  seo: Seo
});
export type IndustryDetail = z.infer<typeof IndustryDetail>;
