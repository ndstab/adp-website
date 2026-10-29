import type {Metadata} from 'next';
import {pageMetadata} from '@/lib/seo';
import {useTranslations} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Mail} from 'lucide-react';
import type {Locale} from '@/i18n/routing';
import {site} from '@/content';
import {PhotoHero} from '@/components/page/PageHero';
import {Breadcrumbs} from '@/components/page/Breadcrumbs';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {TagChip} from '@/components/ui/TagChip';
import {buttonClass} from '@/components/ui/Button';
import {Reveal} from '@/components/ui/Reveal';
import {CtaBand} from '@/components/home/CtaBand';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'company.careers.meta'});
  return pageMetadata({locale: locale as Locale, path: '/careers', title: t('title'), description: t('description')});
}

export default async function CareersPage({params}: Params) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  return <Careers />;
}

function Careers() {
  const t = useTranslations('company.careers');
  const tp = useTranslations('pages.breadcrumb');
  const why = t.raw('why.items') as Array<{title: string; body: string}>;
  const areas = t.raw('areas.items') as string[];
  // [CONFIRM] a dedicated careers inbox; applications go to the main address for now.
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(t('roles.subject'))}`;

  return (
    <>
      <PhotoHero
        image="/images/about/professional-woman-laptop.jpg"
        alt={t('hero.alt')}
        chip={t('hero.chip')}
        title1={t('hero.title1')}
        title2={t('hero.title2')}
        sub={t('hero.sub')}
        breadcrumbs={<Breadcrumbs items={[{label: tp('home'), href: '/'}, {label: t('hero.chip')}]} />}
      />

      <section aria-labelledby="why-title" className="container-site py-20 sm:py-28">
        <SectionHeading id="why-title" chip={t('why.chip')} title1={t('hero.title1')} title2={t('hero.title2')} />
        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {why.map((w, i) => (
            <li key={w.title}>
              <Reveal delay={i * 0.06} className="h-full rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-navy-900/[0.06]">
                <span aria-hidden className="block h-0.5 w-8 rounded-full bg-gold-500" />
                <h3 className="mt-5 text-[16px] font-semibold text-navy-900">{w.title}</h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-500">{w.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="roles-title" className="bg-white/50 py-20 sm:py-28">
        <div className="container-site grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <TagChip>{t('areas.chip')}</TagChip>
            <ul className="mt-6 flex flex-wrap gap-2">
              {areas.map((a) => (
                <li key={a} className="rounded-full bg-white px-4 py-2.5 text-[14px] text-navy-900 ring-1 ring-navy-900/10">
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[var(--radius-card)] bg-white p-6 ring-1 ring-navy-900/[0.06] sm:p-8">
            <h2 id="roles-title" className="text-[22px] font-semibold text-navy-900">
              {t('roles.title')}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-500">{t('roles.empty')}</p>
            <a href={mailto} className={buttonClass('gold', 'mt-6')}>
              <Mail aria-hidden strokeWidth={1.75} className="size-4" />
              {t('roles.cta')}
            </a>
            <p className="mt-5 text-[12.5px] text-ink-500">{t('roles.privacy')}</p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
