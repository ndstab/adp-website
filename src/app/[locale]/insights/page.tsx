import type {Metadata} from 'next';
import {pageMetadata} from '@/lib/seo';
import Image from 'next/image';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {ArrowUpRight} from 'lucide-react';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {getInsights} from '@/content/insights';
import {PageHero} from '@/components/page/PageHero';
import {Breadcrumbs} from '@/components/page/Breadcrumbs';
import {CtaBand} from '@/components/home/CtaBand';

type Params = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Params): Promise<Metadata> {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'company.insights.meta'});
  return pageMetadata({locale: locale as Locale, path: '/insights', title: t('title'), description: t('description')});
}

export default async function InsightsPage({params}: Params) {
  const {locale} = (await params) as {locale: Locale};
  setRequestLocale(locale);
  const t = await getTranslations('company.insights');
  const tp = await getTranslations('pages.breadcrumb');
  const insights = await getInsights(locale);
  const date = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB', {dateStyle: 'long', timeZone: 'Asia/Riyadh'});

  return (
    <>
      <PageHero
        chip={t('chip')}
        title1={t('title1')}
        title2={t('title2')}
        sub={t('sub')}
        breadcrumbs={<Breadcrumbs items={[{label: tp('home'), href: '/'}, {label: t('chip')}]} />}
      />
      <section aria-label={t('chip')} className="container-site pb-20 sm:pb-28">
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {insights.map((post) => (
            <li key={post.slug}>
              <Link href={`/insights/${post.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] bg-white ring-1 ring-navy-900/[0.06] transition-shadow hover:shadow-card">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image src={post.image} alt={post.imageAlt} fill sizes="(min-width: 768px) 600px, 92vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  <span className="label-caps absolute start-4 top-4 rounded-md bg-white/90 px-2 py-1 !text-[10px] text-navy-900">{t('draft')}</span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-[12.5px] text-ink-500">
                    <time dateTime={post.date}>{date.format(new Date(post.date))}</time> · {t('minutes', {n: post.readMinutes})}
                  </p>
                  <h2 className="mt-3 text-[20px] leading-snug font-semibold text-navy-900">{post.title}</h2>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-500">{post.excerpt}</p>
                  <span className="label-caps mt-6 inline-flex items-center gap-1.5 text-navy-900 group-hover:text-blue-600">
                    {t('read')}
                    <ArrowUpRight aria-hidden strokeWidth={1.5} className="size-3.5 rtl:-scale-x-100" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </>
  );
}
