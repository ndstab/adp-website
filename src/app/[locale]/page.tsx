import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {pageMetadata} from '@/lib/seo';
import type {Locale} from '@/i18n/routing';
import {getFaq, getIndustries, getPillars, getSolutions} from '@/content';
import {Hero} from '@/components/home/Hero';
import {Capabilities} from '@/components/home/Capabilities';
import {SolutionsGrid} from '@/components/home/SolutionsGrid';
import {IndustriesStrip} from '@/components/home/IndustriesStrip';
import {Faq} from '@/components/home/Faq';
import {Sources} from '@/components/home/Sources';
import {CtaBand} from '@/components/home/CtaBand';
import {JsonLd} from '@/components/ui/JsonLd';

// Footnote numbers follow the order the sources first appear on the page.
const SOURCES = ['year-of-ai', 'ai-market', 'nsdai'];

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = (await params) as {locale: Locale};
  const t = await getTranslations({locale, namespace: 'common.meta'});
  return pageMetadata({locale, path: '/', title: t('title'), description: t('description'), absoluteTitle: true});
}

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  const footnotes = Object.fromEntries(SOURCES.map((id, i) => [id, i + 1]));
  const faq = getFaq(locale);
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.flatMap((g) => g.items.map((item) => ({'@type': 'Question', name: item.q, acceptedAnswer: {'@type': 'Answer', text: item.a}})))
  };

  return (
    <>
      <JsonLd data={faqSchema} />
      {/* Trimmed to six sections at the client's request. BusinessImpact, AgentWorkflow,
          FeatureRows and WhyContact still exist in src/components/home and keep their copy in
          content/{ar,en}/home.json (impact, agents, features, contact), so any of them can be
          dropped back in here without rewriting anything. */}
      <Hero locale={locale} footnotes={footnotes} />
      <Capabilities locale={locale} />
      <SolutionsGrid pillars={getPillars(locale)} solutions={getSolutions(locale)} />
      <IndustriesStrip industries={getIndustries(locale)} />
      <Faq groups={faq} />
      <Sources ids={SOURCES} locale={locale} />
      <CtaBand />
    </>
  );
}
