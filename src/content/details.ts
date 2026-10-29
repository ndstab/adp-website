import type {Locale} from '@/i18n/routing';
import {IndustryDetail, SolutionDetail} from './schema';
import {getIndustries, getSolutions} from './index';

// Detail files are imported on demand; every slug is built statically, so a
// malformed file still fails the build.
export async function getSolutionDetail(locale: Locale, slug: string) {
  if (!getSolutions(locale).some((s) => s.slug === slug)) return null;
  const file = await import(`@content/${locale}/solutions/${slug}.json`);
  const detail = SolutionDetail.parse(file.default);
  if (detail.slug !== slug) throw new Error(`Solution file ${slug}.json has slug "${detail.slug}"`);
  return detail;
}

export async function getIndustryDetail(locale: Locale, slug: string) {
  if (!getIndustries(locale).some((i) => i.slug === slug)) return null;
  const file = await import(`@content/${locale}/industries/${slug}.json`);
  const detail = IndustryDetail.parse(file.default);
  if (detail.slug !== slug) throw new Error(`Industry file ${slug}.json has slug "${detail.slug}"`);
  const known = new Set(getSolutions(locale).map((s) => s.slug));
  const unknown = detail.solutions.filter((s) => !known.has(s));
  if (unknown.length) throw new Error(`Industry ${slug} links unknown solutions: ${unknown.join(', ')}`);
  return detail;
}
