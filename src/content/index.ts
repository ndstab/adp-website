import type {Locale} from '@/i18n/routing';
import {FaqGroup, Industry, Pillar, Site, Solution, Source} from './schema';

import siteJson from '@content/site.json';
import sourcesJson from '@content/sources.json';
import enPillars from '@content/en/pillars.json';
import arPillars from '@content/ar/pillars.json';
import enSolutions from '@content/en/solutions.json';
import arSolutions from '@content/ar/solutions.json';
import enIndustries from '@content/en/industries.json';
import arIndustries from '@content/ar/industries.json';
import enFaq from '@content/en/faq.json';
import arFaq from '@content/ar/faq.json';

// Parsing at module load means a malformed content file fails the build.
export const site = Site.parse(siteJson);
const sources = Source.array().parse(sourcesJson);

const pillars = {
  en: Pillar.array().length(5).parse(enPillars),
  ar: Pillar.array().length(5).parse(arPillars)
};
const solutions = {
  en: Solution.array().length(13).parse(enSolutions),
  ar: Solution.array().length(13).parse(arSolutions)
};
const industries = {
  en: Industry.array().length(8).parse(enIndustries),
  ar: Industry.array().length(8).parse(arIndustries)
};
const faq = {
  en: FaqGroup.array().parse(enFaq),
  ar: FaqGroup.array().parse(arFaq)
};

const byOrder = <T extends {order: number}>(list: T[]) => [...list].sort((a, b) => a.order - b.order);

export const getPillars = (locale: Locale) => byOrder(pillars[locale]);
export const getSolutions = (locale: Locale) => byOrder(solutions[locale]);
export const getIndustries = (locale: Locale) => byOrder(industries[locale]);
export const getFaq = (locale: Locale) => faq[locale];

export function getSources(ids: string[]) {
  return ids.map((id) => {
    const source = sources.find((s) => s.id === id);
    if (!source) throw new Error(`Unknown source id "${id}" in content`);
    return source;
  });
}
