import type {Metadata} from 'next';
import {pageMetadata} from '@/lib/seo';
import {useTranslations} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Check, Lock} from 'lucide-react';
import type {Locale} from '@/i18n/routing';
import {getPillars} from '@/content';
import {PageHero} from '@/components/page/PageHero';
import {Breadcrumbs} from '@/components/page/Breadcrumbs';
import {AllianceForm} from '@/components/page/AllianceForm';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {TagChip} from '@/components/ui/TagChip';
import {Reveal} from '@/components/ui/Reveal';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'company.alliance.meta'});
  return pageMetadata({locale: locale as Locale, path: '/alliance', title: t('title'), description: t('description')});
}

export default async function AlliancePage({params}: Params) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  return <Alliance locale={locale} />;
}

function Alliance({locale}: {locale: Locale}) {
  const t = useTranslations('company.alliance');
  const tp = useTranslations('pages.breadcrumb');
  const offer = t.raw('offer.items') as Array<{title: string; body: string}>;
  const criteria = t.raw('criteria.items') as string[];

  return (
    <>
      <PageHero
        chip={t('hero.chip')}
        title1={t('hero.title1')}
        title2={t('hero.title2')}
        sub={t('hero.sub')}
        breadcrumbs={<Breadcrumbs items={[{label: tp('home'), href: '/'}, {label: t('hero.chip')}]} />}
      />

      <section aria-labelledby="offer-title" className="container-site pb-20 sm:pb-24">
        <SectionHeading id="offer-title" chip={t('offer.chip')} title1={t('offer.title')} />
        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {offer.map((o, i) => (
            <li key={o.title}>
              <Reveal delay={i * 0.06} className="h-full rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-navy-900/[0.06]">
                <span className="text-[12px] font-semibold text-blue-600 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 text-[16px] font-semibold text-navy-900">{o.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">{o.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section id="enquiry" aria-labelledby="enquiry-title" className="on-dark scroll-mt-24 bg-[linear-gradient(180deg,var(--color-navy-700)_0%,var(--color-navy-500)_100%)] py-16 sm:py-24">
        <div className="container-site grid grid-cols-1 gap-3 rounded-[1.75rem] bg-navy-900/45 p-3 ring-1 ring-white/10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="rounded-[1.4rem] bg-white/[0.05] p-6 text-white sm:p-8">
            <TagChip tone="dark">{t('criteria.chip')}</TagChip>
            <ul className="mt-6 grid gap-3">
              {criteria.map((c) => (
                <li key={c} className="flex items-start gap-3 text-[14.5px] leading-snug text-white/85">
                  <span className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full bg-gold-500 text-navy-900">
                    <Check aria-hidden strokeWidth={2.25} className="size-3" />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
            <p className="mt-8 flex items-start gap-2.5 border-t border-white/10 pt-6 text-[13px] leading-relaxed text-white/80">
              <Lock aria-hidden strokeWidth={1.5} className="mt-0.5 size-4 shrink-0 text-gold-300" />
              {t('criteria.note')}
            </p>
          </div>
          <div className="relative p-5 text-white sm:p-8 lg:p-10">
            <TagChip tone="dark">{t('form.chip')}</TagChip>
            <h2 id="enquiry-title" className="title mt-4 font-semibold text-white">
              {t('form.title')}
            </h2>
            <div className="mt-8">
              <AllianceForm pillars={getPillars(locale)} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
