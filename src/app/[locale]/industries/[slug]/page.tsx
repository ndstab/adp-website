import type {Metadata} from 'next';
import {pageMetadata} from '@/lib/seo';
import {notFound} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {ShieldCheck} from 'lucide-react';
import {routing, type Locale} from '@/i18n/routing';
import {getIndustries, getPillars, getSolutions} from '@/content';
import {getIndustryDetail} from '@/content/details';
import type {IndustryDetail} from '@/content/schema';
import {PhotoHero} from '@/components/page/PageHero';
import {Breadcrumbs} from '@/components/page/Breadcrumbs';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {TagChip} from '@/components/ui/TagChip';
import {ButtonLink} from '@/components/ui/Button';
import {VerifyFlag} from '@/components/ui/ReviewFlag';
import {Reveal} from '@/components/ui/Reveal';
import {SolutionCard} from '@/components/ui/SolutionCard';
import {CtaBand} from '@/components/home/CtaBand';

type Params = {params: Promise<{locale: string; slug: string}>};

export const dynamicParams = false;

export function generateStaticParams() {
  return getIndustries(routing.defaultLocale).map((i) => ({slug: i.slug}));
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale, slug} = (await params) as {locale: Locale; slug: string};
  const detail = await getIndustryDetail(locale, slug);
  if (!detail) return {};
  return pageMetadata({locale: locale as Locale, path: `/industries/${slug}`, title: detail.seo.title, description: detail.seo.description});
}

export default async function IndustryPage({params}: Params) {
  const {locale, slug} = (await params) as {locale: Locale; slug: string};
  setRequestLocale(locale);
  const detail = await getIndustryDetail(locale, slug);
  if (!detail) notFound();
  return <IndustryView locale={locale} detail={detail} />;
}

function IndustryView({locale, detail}: {locale: Locale; detail: IndustryDetail}) {
  const t = useTranslations('pages');
  const industry = getIndustries(locale).find((i) => i.slug === detail.slug)!;
  const solutions = getSolutions(locale);
  const pillars = getPillars(locale);
  const recommended = detail.solutions.map((slug) => solutions.find((s) => s.slug === slug)!);

  return (
    <>
      <PhotoHero
        image={industry.image}
        alt={industry.imageAlt}
        chip={t('breadcrumb.industries')}
        title1={detail.hero.title1}
        title2={detail.hero.title2}
        sub={detail.hero.subtitle}
        breadcrumbs={
          <Breadcrumbs
            items={[
              {label: t('breadcrumb.home'), href: '/'},
              {label: t('breadcrumb.industries'), href: '/industries'},
              {label: industry.name}
            ]}
          />
        }
      >
        <ButtonLink href="/contact" className="mt-8">
          {t('industryPage.ctaButton')}
        </ButtonLink>
      </PhotoHero>

      {/* Context and regulation */}
      <section aria-labelledby="context-title" className="container-site py-20 sm:py-24">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <Reveal className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-navy-900/[0.06] sm:p-8">
            <TagChip>{t('industryPage.contextChip')}</TagChip>
            <h2 id="context-title" className="mt-4 text-[24px] font-semibold text-navy-900">
              {detail.context.title}
            </h2>
            <p className="mt-3 text-[15.5px] leading-relaxed text-ink-500">{detail.context.body}</p>
          </Reveal>
          <Reveal delay={0.08} className="on-dark rounded-[var(--radius-card)] bg-[linear-gradient(160deg,var(--color-navy-700),var(--color-navy-500))] p-6 text-white sm:p-8">
            <ShieldCheck aria-hidden strokeWidth={1.5} className="size-6 text-gold-500" />
            <h2 className="mt-4 flex flex-wrap items-center gap-2 text-[18px] font-semibold">
              {t('industryPage.regulation')}
              <VerifyFlag tone="dark" />
            </h2>
            <ul className="mt-4 grid gap-2">
              {detail.regulation.map((r) => (
                <li key={r} className="flex items-start gap-2.5 text-[14px] text-white/85">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-500" />
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[12.5px] leading-relaxed text-white/80">{t('industryPage.regulationNote')}</p>
          </Reveal>
        </div>
      </section>

      {/* Challenges */}
      <section aria-labelledby="challenges-title" className="bg-white/50 py-20 sm:py-24">
        <div className="container-site">
          <SectionHeading id="challenges-title" chip={t('industryPage.challenges')} title1={t('industryPage.challengesTitle')} />
          <ul className={`mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 ${detail.challenges.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
            {detail.challenges.map((c, i) => (
              <li key={c.title} className="rounded-[var(--radius-card)] bg-sand-100 p-6 ring-1 ring-navy-900/[0.04]">
                <span className="text-[12px] font-semibold text-navy-700 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 text-[16px] leading-snug font-semibold text-navy-900">{c.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">{c.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Use cases */}
      <section aria-labelledby="usecases-title" className="container-site py-20 sm:py-24">
        <SectionHeading id="usecases-title" chip={t('industryPage.useCases')} title1={t('industryPage.useCasesTitle')} />
        <ol className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2">
          {detail.useCases.map((u, i) => (
            <li key={u.title} className="flex gap-4 rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-navy-900/[0.06]">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy-700 text-[13px] font-semibold text-white ring-[1.5px] ring-gold-500 tabular-nums">
                {i + 1}
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-navy-900">{u.title}</span>
                <span className="mt-1 block text-[13.5px] leading-relaxed text-ink-500">{u.body}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* Recommended solutions */}
      <section aria-labelledby="recommended-title" className="bg-white/50 py-20 sm:py-24">
        <div className="container-site">
          <SectionHeading id="recommended-title" chip={t('industryPage.solutions')} title1={t('industryPage.solutionsTitle')} />
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recommended.map((s) => (
              <li key={s.slug}>
                <SolutionCard solution={s} pillar={pillars.find((p) => p.id === s.pillar)!} cta={t('solutionsHub.explore')} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Vision 2030 */}
      <section aria-labelledby="vision-title" className="container-site py-20 sm:py-24">
        <div className="rounded-[var(--radius-card)] bg-sand-100 p-6 ring-1 ring-navy-900/[0.04] sm:p-10">
          <SectionHeading id="vision-title" chip={t('industryPage.vision')} title1={t('industryPage.visionTitle')} sub={detail.vision2030.body} />
          <p className="mt-6 flex items-center gap-2 text-[12.5px] font-semibold text-navy-900">
            {t('industryPage.programs')}
            <VerifyFlag />
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {detail.vision2030.programs.map((p) => (
              <li key={p} className="rounded-full bg-white px-3 py-1.5 text-[12.5px] text-navy-900 ring-1 ring-navy-900/[0.06]">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand
        title1={t('industryPage.ctaTitle1')}
        title2={t('industryPage.ctaTitle2', {industry: industry.name})}
        button={t('industryPage.ctaButton')}
      />
    </>
  );
}
