import type {Metadata} from 'next';
import {pageMetadata} from '@/lib/seo';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ArrowUpRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {getIndustries, getPillars} from '@/content';
import type {FitLevel} from '@/content/schema';
import {PageHero} from '@/components/page/PageHero';
import {Breadcrumbs} from '@/components/page/Breadcrumbs';
import {Reveal} from '@/components/ui/Reveal';
import {SectionHeading} from '@/components/ui/SectionHeading';
import {PillarIcon} from '@/components/ui/PillarIcon';
import {CtaBand} from '@/components/home/CtaBand';

export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'pages.industriesHub.meta'});
  return pageMetadata({locale: locale as Locale, path: '/industries', title: t('title'), description: t('description')});
}

export default async function IndustriesHubPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  return <IndustriesHub locale={locale} />;
}

function IndustriesHub({locale}: {locale: Locale}) {
  const t = useTranslations('pages');
  const industries = getIndustries(locale);
  const pillars = getPillars(locale);
  const levels: FitLevel[] = ['primary', 'relevant', 'limited'];
  const dot = (level: FitLevel) =>
    ({
      primary: 'inline-block size-3 rounded-full bg-navy-700 ring-[1.5px] ring-gold-500',
      relevant: 'inline-block size-3 rounded-full ring-[1.5px] ring-navy-700',
      limited: 'inline-block h-0.5 w-3 bg-ink-500/50 align-middle'
    })[level];

  return (
    <>
      <PageHero
        chip={t('industriesHub.chip')}
        title1={t('industriesHub.title1')}
        title2={t('industriesHub.title2')}
        sub={t('industriesHub.sub')}
        breadcrumbs={<Breadcrumbs items={[{label: t('breadcrumb.home'), href: '/'}, {label: t('breadcrumb.industries')}]} />}
      />

      <section aria-label={t('industriesHub.chip')} className="container-site pb-20 sm:pb-28">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry, i) => (
            <li key={industry.slug}>
              <Reveal delay={(i % 4) * 0.06} className="h-full">
                <Link
                  href={`/industries/${industry.slug}`}
                  className="group relative flex h-[24rem] flex-col justify-end overflow-hidden rounded-[var(--radius-card)] bg-navy-700 p-5 text-white"
                >
                  <Image
                    src={industry.image}
                    alt={industry.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 290px, (min-width: 640px) 45vw, 92vw"
                    className="object-cover transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.04]"
                  />
                  <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgb(14_35_71/0)_30%,rgb(14_35_71/0.55)_58%,rgb(14_35_71/0.94)_100%)]" />
                  <div className="relative">
                    <h2 className="text-[18px] leading-snug font-semibold">{industry.name}</h2>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-white/80">{industry.summary}</p>
                    <span className="label-caps mt-4 inline-flex items-center gap-1.5 text-gold-300">
                      {t('industriesHub.explore')}
                      <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Sector fit matrix: where each solution area plays, and how an engagement usually starts */}
      <section aria-labelledby="fit-title" className="bg-white/50 py-20 sm:py-28">
        <div className="container-site">
          <SectionHeading id="fit-title" chip={t('industriesHub.fit.chip')} title1={t('industriesHub.fit.title1')} title2={t('industriesHub.fit.title2')} sub={t('industriesHub.fit.sub')} />
          <div className="no-scrollbar mt-10 overflow-x-auto rounded-[var(--radius-card)] bg-white ring-1 ring-navy-900/[0.06]">
            <table className="w-full min-w-[860px] border-collapse text-start text-[13.5px]">
              <thead>
                <tr className="border-b border-navy-900/[0.08]">
                  <th scope="col" className="p-4 text-start text-[12.5px] font-semibold text-ink-500">
                    {t('industriesHub.fit.sector')}
                  </th>
                  {pillars.map((p) => (
                    <th key={p.id} scope="col" className="px-2 py-4 text-center text-[12px] font-semibold text-navy-900">
                      <span className="mx-auto mb-2 grid size-8 place-items-center rounded-full bg-navy-700 text-white ring-[1.5px] ring-gold-500">
                        <PillarIcon icon={p.icon} className="size-3.5" />
                      </span>
                      {p.label}
                    </th>
                  ))}
                  <th scope="col" className="p-4 text-start text-[12.5px] font-semibold text-ink-500">
                    {t('industriesHub.fit.first')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {industries.map((industry) => (
                  <tr key={industry.slug} className="border-b border-navy-900/[0.06] last:border-0">
                    <th scope="row" className="p-4 text-start font-semibold text-navy-900">
                      <Link href={`/industries/${industry.slug}`} className="hover:text-blue-600">
                        {industry.name}
                      </Link>
                    </th>
                    {pillars.map((p) => (
                      <td key={p.id} className="px-2 py-4 text-center">
                        <span aria-hidden className={dot(industry.fit[p.id])} />
                        <span className="sr-only">{t(`industriesHub.fit.${industry.fit[p.id]}`)}</span>
                      </td>
                    ))}
                    <td className="p-4 text-ink-700">
                      {industry.firstEngagement.map((item, i) => (
                        <span key={item}>
                          {i > 0 && ' · '}
                          <bdi>{item}</bdi>
                        </span>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-ink-500">
            {levels.map((level) => (
              <li key={level} className="flex items-center gap-2">
                <span aria-hidden className={dot(level)} />
                {t(`industriesHub.fit.${level}`)}
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-2xl text-[14px] leading-relaxed text-ink-500">{t('industriesHub.fit.note')}</p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
