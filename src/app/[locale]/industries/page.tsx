import type {Metadata} from 'next';
import {pageMetadata} from '@/lib/seo';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ArrowUpRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {getIndustries} from '@/content';
import {PageHero} from '@/components/page/PageHero';
import {Breadcrumbs} from '@/components/page/Breadcrumbs';
import {Reveal} from '@/components/ui/Reveal';
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

      <CtaBand />
    </>
  );
}
