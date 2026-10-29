import type {Metadata} from 'next';
import {pageMetadata} from '@/lib/seo';
import {useTranslations} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Info} from 'lucide-react';
import type {Locale} from '@/i18n/routing';
import {PageHero} from '@/components/page/PageHero';
import {Breadcrumbs} from '@/components/page/Breadcrumbs';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {TagChip} from '@/components/ui/TagChip';
import {Footnote} from '@/components/ui/Footnote';
import {Reveal} from '@/components/ui/Reveal';
import {Sources} from '@/components/home/Sources';
import {CtaBand} from '@/components/home/CtaBand';

type Params = {params: Promise<{locale: string}>};
type Area = {title: string; body: string; source: string | null};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'company.compliance.meta'});
  return pageMetadata({locale: locale as Locale, path: '/compliance', title: t('title'), description: t('description')});
}

export default async function CompliancePage({params}: Params) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  return <Compliance locale={locale} />;
}

function Compliance({locale}: {locale: Locale}) {
  const t = useTranslations('company.compliance');
  const tp = useTranslations('pages.breadcrumb');
  const tc = useTranslations('common.a11y');
  const areas = t.raw('areas.items') as Area[];
  const practices = t.raw('practices.items') as string[];
  const sourceIds = areas.flatMap((a) => (a.source ? [a.source] : []));
  const n = (id: string) => sourceIds.indexOf(id) + 1;

  return (
    <>
      <PageHero
        icon="shield"
        chip={t('hero.chip')}
        title1={t('hero.title1')}
        title2={t('hero.title2')}
        sub={t('hero.sub')}
        breadcrumbs={<Breadcrumbs items={[{label: tp('home'), href: '/'}, {label: t('meta.title')}]} />}
      />

      <section aria-labelledby="areas-title" className="container-site pb-20 sm:pb-28">
        <SectionHeading id="areas-title" chip={t('areas.chip')} title1={t('areas.title')} />
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((a, i) => (
            <li key={a.title}>
              <Reveal delay={(i % 3) * 0.06} className="h-full rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-navy-900/[0.06]">
                <span aria-hidden className="block h-0.5 w-8 rounded-full bg-gold-500" />
                <h3 className="mt-5 text-[17px] leading-snug font-semibold text-navy-900">
                  {a.title}
                  {a.source && <Footnote n={n(a.source)} id={a.source} label={tc('source', {n: n(a.source)})} />}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-500">{a.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="practices-title" className="container-site pb-20 sm:pb-28">
        <div className="on-dark grid grid-cols-1 gap-8 rounded-[1.75rem] bg-[linear-gradient(160deg,var(--color-navy-700),var(--color-navy-500))] p-6 text-white sm:p-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
          <div>
            <TagChip tone="dark">{t('practices.chip')}</TagChip>
            <h2 id="practices-title" className="title mt-5 font-semibold text-white">
              {t('practices.title')}
            </h2>
          </div>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {practices.map((p) => (
              <li key={p} className="flex items-start gap-3 rounded-xl bg-white/[0.07] px-4 py-3.5 text-[14px] ring-1 ring-white/10">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-gold-500" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 flex max-w-3xl items-start gap-2.5 text-[13.5px] leading-relaxed text-ink-500">
          <Info aria-hidden strokeWidth={1.5} className="mt-0.5 size-4 shrink-0 text-blue-600" />
          {t('disclaimer')}
        </p>
      </section>

      <Sources ids={sourceIds} locale={locale} />
      <CtaBand />
    </>
  );
}
