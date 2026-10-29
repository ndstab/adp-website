import type {Metadata} from 'next';
import {pageMetadata} from '@/lib/seo';
import {useTranslations} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ArrowRight} from 'lucide-react';
import type {Locale} from '@/i18n/routing';
import {getPillars} from '@/content';
import {PageHero} from '@/components/page/PageHero';
import {Breadcrumbs} from '@/components/page/Breadcrumbs';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {PillarIcon} from '@/components/ui/PillarIcon';
import {Footnote} from '@/components/ui/Footnote';
import {VerifyFlag} from '@/components/ui/ReviewFlag';
import {Reveal} from '@/components/ui/Reveal';
import {Sources} from '@/components/home/Sources';
import {CtaBand} from '@/components/home/CtaBand';

type Params = {params: Promise<{locale: string}>};
type Fact = {value: string; unit?: string; label: string; source: string};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'company.vision.meta'});
  return pageMetadata({locale: locale as Locale, path: '/vision-2030', title: t('title'), description: t('description')});
}

export default async function VisionPage({params}: Params) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  return <Vision locale={locale} />;
}

function Vision({locale}: {locale: Locale}) {
  const t = useTranslations('company.vision');
  const tp = useTranslations('pages.breadcrumb');
  const tc = useTranslations('common.a11y');
  const facts = t.raw('facts.items') as Fact[];
  const gaps = t.raw('gap.items') as Array<{title: string; body: string; help: string}>;
  const themes = t.raw('themes.items') as Array<{title: string; body: string; pillars: string[]; programs: string[]}>;
  const pillars = getPillars(locale);
  // Footnote numbers follow first appearance on the page.
  const sourceIds = [...new Set(facts.map((f) => f.source))];
  const n = (id: string) => sourceIds.indexOf(id) + 1;

  return (
    <>
      <PageHero
        icon="cpu"
        chip={t('hero.chip')}
        title1={t('hero.title1')}
        title2={t('hero.title2')}
        sub={t('hero.sub')}
        breadcrumbs={<Breadcrumbs items={[{label: tp('home'), href: '/'}, {label: t('meta.title')}]} />}
      />

      {/* National context */}
      <section aria-labelledby="facts-title" className="container-site pb-20 sm:pb-28">
        <SectionHeading id="facts-title" chip={t('facts.chip')} title1={t('facts.title1')} title2={t('facts.title2')} />
        <dl className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((f, i) => (
            <Reveal key={f.label} delay={(i % 3) * 0.06} className="flex flex-col-reverse justify-end gap-3 rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-navy-900/[0.06]">
              <dt className="text-[14px] leading-snug text-ink-500">
                {f.label}
                <Footnote n={n(f.source)} id={f.source} label={tc('source', {n: n(f.source)})} />
              </dt>
              <dd className="text-navy-900">
                <bdi dir="ltr" className="text-[38px] leading-none font-medium tracking-tight">
                  {f.value}
                </bdi>
                {f.unit && <span className="ms-2 text-[17px] font-semibold">{f.unit}</span>}
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Execution gap */}
      <section aria-labelledby="gap-title" className="bg-white/50 py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading id="gap-title" chip={t('gap.chip')} title1={t('gap.title1')} title2={t('gap.title2')} />
          <ul className="mt-10 grid gap-2">
            {gaps.map((g) => (
              <li key={g.title} className="grid grid-cols-1 items-center gap-3 rounded-[var(--radius-card)] bg-white p-5 ring-1 ring-navy-900/[0.06] md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-6 md:p-6">
                <div>
                  <h3 className="text-[16px] font-semibold text-navy-900">{g.title}</h3>
                  <p className="mt-1 text-[13.5px] text-ink-500">{g.body}</p>
                </div>
                <ArrowRight aria-hidden strokeWidth={1.5} className="hidden size-5 text-gold-500 md:block rtl:-scale-x-100" />
                <p className="rounded-xl bg-sand-50 px-4 py-3 text-[14px] font-medium text-navy-900">{g.help}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Vision 2030 themes */}
      <section aria-labelledby="themes-title" className="container-site py-20 sm:py-28">
        <SectionHeading id="themes-title" chip={t('themes.chip')} title1={t('themes.title')} />
        <p className="mt-4 flex items-center gap-2 text-[13px] text-ink-500">
          {t('themes.note')}
          <VerifyFlag />
        </p>
        <ul className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {themes.map((theme) => (
            <li key={theme.title} className="flex flex-col rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-navy-900/[0.06] sm:p-8">
              <h3 className="text-[20px] font-semibold text-navy-900">{theme.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-500">{theme.body}</p>
              <ul className="mt-6 grid gap-2">
                {theme.pillars.map((id) => {
                  const p = pillars.find((x) => x.id === id)!;
                  return (
                    <li key={id} className="flex items-center gap-2.5 text-[13.5px] font-medium text-navy-900">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-navy-700 text-white ring-[1.5px] ring-gold-500">
                        <PillarIcon icon={p.icon} className="size-3.5" />
                      </span>
                      {p.name}
                    </li>
                  );
                })}
              </ul>
              <ul className="mt-6 flex flex-wrap gap-1.5 border-t border-navy-900/[0.08] pt-5">
                {theme.programs.map((prog) => (
                  <li key={prog} className="rounded-full bg-sand-100 px-3 py-1.5 text-[12px] text-navy-900">
                    {prog}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <Sources ids={sourceIds} locale={locale} />
      <CtaBand />
    </>
  );
}
