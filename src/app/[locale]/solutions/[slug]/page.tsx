import type {Metadata} from 'next';
import {pageMetadata} from '@/lib/seo';
import {notFound} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {Check, Cloud, Landmark, Minus, Server} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import {routing, type Locale} from '@/i18n/routing';
import {getIndustries, getPillars, getSolutions} from '@/content';
import {getSolutionDetail} from '@/content/details';
import type {SolutionDetail} from '@/content/schema';
import {cn} from '@/lib/cn';
import {PageHero} from '@/components/page/PageHero';
import {Breadcrumbs} from '@/components/page/Breadcrumbs';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {TagChip} from '@/components/ui/TagChip';
import {ButtonLink} from '@/components/ui/Button';
import {Footnote} from '@/components/ui/Footnote';
import {VerifyFlag} from '@/components/ui/ReviewFlag';
import {Reveal} from '@/components/ui/Reveal';
import {SolutionCard} from '@/components/ui/SolutionCard';
import {Sources} from '@/components/home/Sources';
import {CtaBand} from '@/components/home/CtaBand';
import {JsonLd} from '@/components/ui/JsonLd';
import {localePath, siteUrl} from '@/lib/seo';

type Params = {params: Promise<{locale: string; slug: string}>};

export const dynamicParams = false;

export function generateStaticParams() {
  return getSolutions(routing.defaultLocale).map((s) => ({slug: s.slug}));
}

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale, slug} = (await params) as {locale: Locale; slug: string};
  const detail = await getSolutionDetail(locale, slug);
  if (!detail) return {};
  return pageMetadata({locale: locale as Locale, path: `/solutions/${slug}`, title: detail.seo.title, description: detail.seo.description});
}

export default async function SolutionPage({params}: Params) {
  const {locale, slug} = (await params) as {locale: Locale; slug: string};
  setRequestLocale(locale);
  const detail = await getSolutionDetail(locale, slug);
  if (!detail) notFound();
  return <SolutionView locale={locale} detail={detail} />;
}

// Values made only of digits and symbols read left to right even in Arabic.
const isNumeric = (value: string) => !/[؀-ۿ]/.test(value);

function SolutionView({locale, detail}: {locale: Locale; detail: SolutionDetail}) {
  const t = useTranslations('pages');
  const tc = useTranslations('common.a11y');
  const solutions = getSolutions(locale);
  const solution = solutions.find((s) => s.slug === detail.slug)!;
  const pillar = getPillars(locale).find((p) => p.id === solution.pillar)!;
  const related = solutions.filter((s) => s.pillar === pillar.id && s.slug !== solution.slug);
  const industries = getIndustries(locale);
  const sources = detail.opportunity.sources;
  const steps = t.raw('solutionPage.engageSteps') as Array<{title: string; body: string}>;
  const deployment = [
    {key: 'cloud', icon: Cloud, on: detail.deployment.cloud},
    {key: 'inKingdom', icon: Landmark, on: detail.deployment.inKingdom},
    {key: 'onPrem', icon: Server, on: detail.deployment.onPrem}
  ] as const;

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: solution.title,
    description: detail.seo.description,
    serviceType: pillar.name,
    url: `${siteUrl}${localePath(locale, `/solutions/${solution.slug}`)}`,
    provider: {'@id': `${siteUrl}/#organization`},
    areaServed: {'@type': 'Country', name: 'Saudi Arabia'}
  };

  return (
    <>
      <JsonLd data={serviceSchema} />
      <PageHero
        icon={pillar.icon}
        chip={pillar.name}
        title1={detail.hero.title1}
        title2={detail.hero.title2}
        sub={detail.hero.subtitle}
        breadcrumbs={
          <Breadcrumbs
            items={[
              {label: t('breadcrumb.home'), href: '/'},
              {label: t('breadcrumb.solutions'), href: '/solutions'},
              {label: solution.title}
            ]}
          />
        }
      >
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <ButtonLink href="/contact">{t('solutionPage.ctaButton')}</ButtonLink>
          <ul className="flex flex-wrap gap-1.5" aria-label={t('solutionPage.deployment')}>
            {deployment
              .filter((d) => d.on)
              .map(({key, icon: Icon}) => (
                <li key={key} className="flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 text-[12px] text-navy-900 ring-1 ring-navy-900/10">
                  <Icon aria-hidden strokeWidth={1.5} className="size-3.5 text-blue-600" />
                  {t(`solutionPage.${key}`)}
                </li>
              ))}
          </ul>
        </div>
      </PageHero>

      {/* Challenge and opportunity */}
      <section aria-label={`${detail.challenge.title}, ${detail.opportunity.title}`} className="container-site pb-20 sm:pb-24">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Reveal className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-navy-900/[0.06] sm:p-8">
            <TagChip>{t('solutionPage.challengeChip')}</TagChip>
            <h2 className="mt-4 text-[22px] font-semibold text-navy-900">{detail.challenge.title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-500">{detail.challenge.body}</p>
            <ul className="mt-6 grid gap-2">
              {detail.challenge.points.map((point) => (
                <li key={point} className="flex items-start gap-3 rounded-xl bg-sand-50 px-4 py-3 text-[14px] text-ink-700">
                  <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-gold-500" />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08} className="on-dark rounded-[var(--radius-card)] bg-[linear-gradient(160deg,var(--color-navy-700),var(--color-navy-500))] p-6 text-white sm:p-8">
            <span aria-hidden className="block h-1 w-10 rounded-full bg-gold-500" />
            <h2 className="mt-5 text-[22px] font-semibold">{detail.opportunity.title}</h2>
            <p className="mt-3 text-[15px] leading-relaxed text-white/80">
              {detail.opportunity.body}
              {sources.map((id, i) => (
                <span key={id} className="[&_a]:text-gold-300">
                  <Footnote n={i + 1} id={id} label={tc('source', {n: i + 1})} />
                </span>
              ))}
            </p>
          </Reveal>
        </div>
      </section>

      {/* What it does */}
      <section aria-labelledby="capabilities-title" className="bg-white/50 py-20 sm:py-24">
        <div className="container-site">
          <SectionHeading id="capabilities-title" chip={t('solutionPage.whatItDoes')} title1={solution.title} sub={t('solutionPage.whatItDoesSub')} />
          <ol className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {detail.capabilities.map((cap, i) => (
              <li key={cap.title}>
                <Reveal delay={(i % 3) * 0.06} className="h-full rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-navy-900/[0.06]">
                  <span className="text-[12px] font-semibold text-blue-600 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-3 text-[16px] leading-snug font-semibold text-navy-900">{cap.title}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">{cap.body}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Applications */}
      <section aria-labelledby="applications-title" className="container-site py-20 sm:py-24">
        <SectionHeading id="applications-title" chip={t('solutionPage.applications')} title1={t('solutionPage.applicationsTitle')} />
        <ul className="mt-10 grid grid-cols-1 gap-3 md:grid-cols-2">
          {detail.applications.map((app) => (
            <li key={app.title} className="flex gap-4 rounded-[var(--radius-card)] bg-sand-100 p-5 ring-1 ring-navy-900/[0.04]">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-navy-700 text-gold-500">
                <Check aria-hidden strokeWidth={2} className="size-3.5" />
              </span>
              <span>
                <span className="block text-[15px] font-semibold text-navy-900">{app.title}</span>
                <span className="mt-1 block text-[13.5px] leading-relaxed text-ink-500">{app.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Typical outcomes */}
      <section aria-labelledby="outcomes-title" className="container-site pb-20 sm:pb-24">
        <SectionHeading id="outcomes-title" chip={t('solutionPage.outcomes')} title1={t('solutionPage.outcomesTitle')} />
        {detail.outcomes.length > 0 ? (
          <>
            <ol className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:items-start">
              {detail.outcomes.map((o, i) => (
                <li key={o.label} className={['lg:mt-0', 'lg:mt-10', 'lg:mt-20', 'lg:mt-30'][i]}>
                  <div className="flex min-h-44 flex-col justify-between gap-8 rounded-[var(--radius-card)] bg-sand-100 p-5 ring-1 ring-navy-900/[0.04] sm:p-6">
                    <bdi
                      dir={isNumeric(o.value) ? 'ltr' : undefined}
                      className={cn(
                        'leading-none font-medium tracking-tight text-navy-900 rtl:tracking-normal',
                        /\d/.test(o.value) ? 'text-[30px] sm:text-[38px]' : 'text-[22px] leading-tight sm:text-[26px]'
                      )}
                    >
                      {o.value}
                    </bdi>
                    <p className="flex flex-wrap items-center gap-2 text-[13px] font-medium text-ink-700">
                      {o.label}
                      <VerifyFlag />
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 max-w-2xl text-[13px] text-ink-500">{t('solutionPage.outcomesNote')}</p>
          </>
        ) : (
          <p className="mt-8 max-w-2xl rounded-[var(--radius-card)] bg-sand-100 p-6 text-[15px] leading-relaxed text-ink-700 ring-1 ring-navy-900/[0.04]">
            {t('solutionPage.outcomesEmpty')}
          </p>
        )}
      </section>

      {/* Solution-specific details (watermark fields, frameworks, extensions...) */}
      {detail.extras.length > 0 && (
        <section aria-label={t('solutionPage.extrasChip')} className="container-site pb-20 sm:pb-24">
          <div className={cn('grid grid-cols-1 gap-4', detail.extras.length > 1 && 'lg:grid-cols-3', detail.extras.length === 2 && 'lg:grid-cols-2')}>
            {detail.extras.map((extra) => (
              <div key={extra.title} className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-navy-900/[0.06]">
                <h2 className="flex flex-wrap items-center gap-2 text-[17px] font-semibold text-navy-900">
                  {extra.title}
                  {extra.verify && <VerifyFlag />}
                </h2>
                <ul className="mt-4 grid gap-2">
                  {extra.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-ink-700">
                      <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Deployment, Vision 2030, sectors */}
      <section aria-labelledby="deployment-title" className="bg-white/50 py-20 sm:py-24">
        <div className="container-site grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading id="deployment-title" chip={t('solutionPage.deployment')} title1={t('solutionPage.deploymentTitle')} />
            <ul className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
              {deployment.map(({key, icon: Icon, on}) => (
                <li
                  key={key}
                  className={cn('flex flex-col gap-4 rounded-2xl p-4', on ? 'bg-white ring-1 ring-navy-900/[0.08]' : 'border border-dashed border-navy-900/20')}
                >
                  <Icon aria-hidden strokeWidth={1.5} className={cn('size-5', on ? 'text-blue-600' : 'text-ink-500')} />
                  <span>
                    <span className={cn('block text-[14px] font-semibold', on ? 'text-navy-900' : 'text-ink-500')}>{t(`solutionPage.${key}`)}</span>
                    <span className="mt-1 flex items-center gap-1 text-[12px] text-ink-500">
                      {on ? <Check aria-hidden strokeWidth={2} className="size-3.5 text-success" /> : <Minus aria-hidden strokeWidth={2} className="size-3.5" />}
                      {on ? t('solutionPage.available') : t('solutionPage.notOffered')}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-relaxed text-ink-500">{detail.deployment.note}</p>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-navy-900/[0.06] sm:p-8">
              <TagChip>{t('solutionPage.vision')}</TagChip>
              <h2 className="mt-4 text-[22px] font-semibold text-navy-900">{t('solutionPage.visionTitle')}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-ink-500">{detail.vision2030.body}</p>
              <p className="mt-5 flex items-center gap-2 text-[12.5px] font-semibold text-navy-900">
                {t('solutionPage.programs')}
                <VerifyFlag />
              </p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {detail.vision2030.programs.map((p) => (
                  <li key={p} className="rounded-full bg-sand-100 px-3 py-1.5 text-[12.5px] text-navy-900">
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-navy-900/[0.06] sm:p-8">
              <h2 className="text-[17px] font-semibold text-navy-900">{t('solutionPage.sectorsTitle')}</h2>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {detail.sectors.map((slug) => {
                  const industry = industries.find((i) => i.slug === slug)!;
                  return (
                    <li key={slug}>
                      <Link href={`/industries/${slug}`} className="block rounded-full bg-navy-700 px-3.5 py-2 text-[12.5px] text-white transition-colors hover:bg-navy-900">
                        {industry.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How we engage */}
      <section aria-labelledby="engage-title" className="container-site py-20 sm:py-24">
        <SectionHeading id="engage-title" chip={t('solutionPage.engage')} title1={t('solutionPage.engageTitle')} />
        <ol className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="relative rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-navy-900/[0.06]">
              <span className="grid size-9 place-items-center rounded-full bg-navy-700 text-[13px] font-semibold text-white ring-[1.5px] ring-gold-500 tabular-nums">
                {i + 1}
              </span>
              <h3 className="mt-5 text-[16px] font-semibold text-navy-900">{step.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="container-site pb-20 sm:pb-24">
          <SectionHeading id="related-title" chip={t('solutionPage.related')} title1={pillar.name} />
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <li key={s.slug}>
                <SolutionCard solution={s} pillar={pillar} cta={t('solutionsHub.explore')} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {sources.length > 0 && <Sources ids={sources} locale={locale} />}

      <CtaBand
        title1={t('solutionPage.ctaTitle1')}
        title2={t('solutionPage.ctaTitle2', {solution: solution.title})}
        sub={t('solutionPage.ctaSub')}
        button={t('solutionPage.ctaButton')}
      />
    </>
  );
}
